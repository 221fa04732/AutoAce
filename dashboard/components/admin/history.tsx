'use client'

import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { RotateCw } from "lucide-react"
import { Loader } from "../loader"
import Error from "../error"
import {
  HistoryIcon,
  CarFront,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react"
import BASE_URL from "@/lib/config"

export default function History() {
  const [loader, setLoader] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState<any[]>([])

  const [dealerFilter, setDealerFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [csmFilter, setCsmFilter] = useState("all") 
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const fetchData = async () => {
    setLoader(true)
    setError(false)
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/history`)
      setData(res.data.history_data || [])
    } catch {
      setError(true)
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemTime = new Date(item.created_at).getTime()
      const from = fromDate ? new Date(fromDate).getTime() : null
      const to = toDate ? new Date(toDate).getTime() + 86400000 : null

      const dealerMatch =
        dealerFilter === "all" || item.dealership_id === dealerFilter

      const statusMatch =
        statusFilter === "all" || item.status === statusFilter

      const csmMatch =                      
        csmFilter === "all" || item.cms_id === csmFilter

      const fromMatch = from ? itemTime >= from : true
      const toMatch = to ? itemTime <= to : true

      return dealerMatch && statusMatch && csmMatch && fromMatch && toMatch
    })
  }, [data, dealerFilter, statusFilter, csmFilter, fromDate, toDate])

  if (loader) return <Loader />
  if (error) return <Error />

  return (
    <div className="w-full flex flex-col justify-start items-center">
      <div className="w-full border-b flex justify-between items-center pb-2">
        <div className="text-lg font-bold">Call History</div>
        <button
          className="flex items-center gap-2 px-3 py-1 border rounded-lg hover:bg-stone-900"
          onClick={fetchData}>
          <RotateCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
      <FilterBar
        data={data}
        dealerFilter={dealerFilter}
        setDealerFilter={setDealerFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        csmFilter={csmFilter}               
        setCsmFilter={setCsmFilter}        
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />
      {filteredData.length === 0 ? (
        <EmptyHistoryList />
      ) : (
        <div className="w-full grid grid-cols-2 my-6 gap-6">
          {filteredData.map((item, index) => (
            <HistoryCard key={index} history={item} />
          ))}
        </div>
      )}
    </div>
  )
}

const FilterBar = ({
  data,
  dealerFilter,
  setDealerFilter,
  statusFilter,
  setStatusFilter,
  csmFilter,
  setCsmFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}: any) => {
  const dealers = [...new Set(data.map((d: any) => d.dealership_id))]
  const csms = [...new Set(data.map((d: any) => d.cms_id))]

  return (
    <div className="w-full flex justify-between items-center gap-4 mt-4 p-4 bg-zinc-950 border border-neutral-700 rounded-xl">
      <select
        className="w-full bg-zinc-900 border border-neutral-600 rounded-md px-3 py-2 text-sm"
        value={dealerFilter}
        onChange={(e) => setDealerFilter(e.target.value)}>
        <option value="all">All Dealers</option>
        {dealers.map((dealer: any) => (
          <option key={dealer} value={dealer}>
            {dealer}
          </option>
        ))}
      </select>
      <select
        className="w-full bg-zinc-900 border border-neutral-600 rounded-md px-3 py-2 text-sm"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">All Status</option>
        <option value="resolved">Resolved</option>
        <option value="follow_up">Follow-up</option>
        <option value="escalated">Escalated</option>
      </select>
      <select
        className="w-full bg-zinc-900 border border-neutral-600 rounded-md px-3 py-2 text-sm"
        value={csmFilter}
        onChange={(e) => setCsmFilter(e.target.value)}>
        <option value="all">All CSMs</option>
        {csms.map((csm: any) => (
          <option key={csm} value={csm}>
            {csm}
          </option>
        ))}
      </select>
      <div className="w-full bg-zinc-900 border py-1 px-4 border-neutral-600 rounded-md flex justify-center items-center gap-4 text-sm">
        From:<input
          type="date"
          className="bg-zinc-900 border border-neutral-600 rounded-md px-3 py-0.5 text-sm"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}/>
        To:<input
          type="date"
          className="bg-zinc-900 border border-neutral-600 rounded-md px-3 py-0.5 text-sm"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}/>
      </div>
    </div>
  )
}

const statusStyles: Record<string, string> = {
  resolved: "text-green-400 border-green-500/40",
  escalated: "text-red-400 border-red-500/40",
  follow_up: "text-yellow-400 border-yellow-500/40",
}

const statusIcons: Record<string, any> = {
  resolved: <CheckCircle className="w-3.5 h-3.5" />,
  escalated: <AlertTriangle className="w-3.5 h-3.5" />,
  follow_up: <Clock className="w-3.5 h-3.5" />,
}

const HistoryCard = ({ history }: any) => {
  return (
    <div className="relative bg-zinc-950 rounded-xl border border-neutral-700 px-5 py-4 shadow-md hover:bg-zinc-900 hover:border-neutral-500 transition hover:-translate-y-1">
      <div
        className={`absolute -top-3 right-4 flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border bg-zinc-900 ${statusStyles[history.status]}`}>
        {statusIcons[history.status]}
        <span className="capitalize">{history.status}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <HistoryIcon className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-slate-100">
            {history.call_id}
          </span>
          <span className="flex gap-2 items-center text-sm text-gray-400">
            <CarFront size={14} />
            {history.dealership_id}
          </span>
        </div>
      </div>
      <div className="w-full mt-3 text-xs text-slate-500 flex justify-between items-center">
        <span>Reviewed by: {history.cms_id}</span>
        <span>Reviewed at: {new Date(history.created_at).toLocaleString()}</span>
      </div>
    </div>
  )
}

const EmptyHistoryList = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-950 rounded-xl shadow-sm mt-16">
      <HistoryIcon size={56} className="text-gray-400 mb-3" />
      <h3 className="text-xl font-semibold text-gray-300 mb-2">
        No History Yet
      </h3>
      <p className="text-gray-500">
        There are no history records for your account.
      </p>
    </div>
  )
}
