'use client'

import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { RotateCw, PhoneCall } from "lucide-react"
import { Loader } from "../loader"
import Error from "../error"
import CallDetailCard from "./call_detail_card"
import BASE_URL from "@/lib/config"

export default function Event() {

  const [loader, setLoader] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState<any[]>([])

  const [filters, setFilters] = useState({
    dealership: "",
    verdict: "",
    fromDate: "",
    toDate: ""
  })

  const fetchData = async () => {
    setLoader(true)
    setError(false)
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/call-details`)
      setData(res.data.call_summary)
    } catch (err) {
      setError(true)
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  const summary = data.reduce(
    (acc: any, item: any) => {
      acc.total += 1
      if (item.verdict === "good") acc.good += 1
      if (item.verdict === "bad") acc.bad += 1
      if (item.verdict === "needs_review") acc.needs_review += 1
      if (item.verdict === "reviewed") acc.reviewed += 1
      return acc
    },
    { total: 0, good: 0, bad: 0, needs_review: 0, reviewed : 0 }
  )

  const dealershipOptions = useMemo(() => {
    return Array.from(
      new Set(data.map((item: any) => item.dealership_id).filter(Boolean))
    )
  }, [data])

  const filteredData = data.filter((item: any) => {
  const createdAt = new Date(item.created_at).getTime()

  const matchDealership =
    !filters.dealership || item.dealership_id === filters.dealership

  const matchVerdict =
    !filters.verdict || item.verdict === filters.verdict

  let matchDate = true

  if (filters.fromDate) {
    const from = new Date(filters.fromDate)
    from.setHours(0, 0, 0, 0)
    matchDate = createdAt >= from.getTime()
  }

  if (filters.toDate) {
    const to = new Date(filters.toDate)
    to.setHours(23, 59, 59, 999)
    matchDate = matchDate && createdAt <= to.getTime()
  }

  return matchDealership && matchVerdict && matchDate
})


  if (loader) return <Loader />
  if (error) return <Error />

  return (
    <div className="w-full flex flex-col justify-start items-center">
      <div className="w-full border-b flex justify-between items-center pb-2">
        <div className="text-lg font-bold">Call Details</div>
        <button className="flex justify-center items-center gap-2 px-3 py-1 border rounded-lg hover:bg-stone-900" onClick={fetchData}> <RotateCw className="h-4 w-4" />Refresh</button>
      </div>
      <div className="w-full grid grid-cols-5 gap-4 my-4">
        <SummaryCard label="Total Calls" value={summary.total} />
        <SummaryCard label="Good" value={summary.good} />
        <SummaryCard label="Bad" value={summary.bad} />
        <SummaryCard label="Needs Review" value={summary.needs_review} />
        <SummaryCard label="Reviewed" value={summary.reviewed} />
      </div>
      <div className="w-full flex gap-4 my-2 items-end border rounded-md     p-2">
        <select
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border"
            value={filters.dealership}
            onChange={(e) =>
            setFilters({ ...filters, dealership: e.target.value })
            }>
            <option value="">All Dealerships</option>
            {dealershipOptions.map((id) => (
            <option key={id} value={id}>{id}</option>
            ))}
        </select>
        <select
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border"
            value={filters.verdict}
            onChange={(e) =>
            setFilters({ ...filters, verdict: e.target.value })
            }>
            <option value="">All Verdicts</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="needs_review">Needs Review</option>
            <option value="reviewed">Reviewed</option>
        </select>
        <div className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border">
            From:<input
            type="date"
            className="bg-transparent outline-none"
            value={filters.fromDate}
            onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
            }/>
            To:<input
            type="date"
            className="bg-transparent outline-none"
            value={filters.toDate}
            onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
            }/>
        </div>
      </div>
      {filteredData.length === 0 ? (<EmptyCallDetails />) : (
        <div className="w-full flex flex-col gap-6 my-6">
          {filteredData.map((item: any, index: number) => (
            <CallDetailCard key={index} event={item} />
          ))}
        </div>
      )}
    </div>
)}

const SummaryCard = ({ label, value }: any) => (
  <div className="w-full p-4 rounded-xl border bg-zinc-950">
    <div className="text-sm text-gray-400">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
)

const EmptyCallDetails = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-950 rounded-xl shadow-sm mt-16">
      <div className="relative mb-2">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-50 rounded-full blur-xl opacity-20"></div>
        <div className="relative p-5 rounded-full shadow-inner">
          <PhoneCall size={56} className="text-gray-300" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">
        No Call Details Found
      </h3>
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
        There are currently no call details entries in the system.
      </p>
    </div>
  )
}