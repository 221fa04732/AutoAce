'use client'

import axios from "axios"
import { useEffect, useState } from "react"
import { RotateCw } from "lucide-react"
import { Loader } from "../loader"
import Error from "../error"
import { CarFront } from "lucide-react"
import BASE_URL from "@/lib/config"

export default function Dealership(){

    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(false)
    const [data, setData] = useState([])

    const fetchData = async () => {
        setLoader(true)
        setError(false)
        try{
            const res = await axios.get(`${BASE_URL}/api/admin/dealership`)
            setData(res.data.dealer_summary)
        }
        catch(err){
            setError(true)
        }
        finally{
            setLoader(false)
        }
    }

    useEffect(()=>{
        fetchData()
    }, [])

    if(loader){
        return(<Loader />)
    }

    if(error){
        return(<Error />)
    }

    return(<div className="w-full flex flex-col justify-start items-center">
        <div className="w-full border-b flex justify-between items-center pb-2">
            <div className="text-lg font-bold">Dealership Data</div>
            <button className="flex justify-center items-center gap-2 px-3 py-1 border rounded-lg hover:bg-stone-900" onClick={()=>{fetchData()}}><RotateCw className="h-4 w-4"/>Refresh</button>
        </div>
        {data.length === 0 ? <EmptyDealership /> : <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 my-6 place-content-center">{data && data.map(( item : any, index)=>(
            <DealerCard key={index} dealer={item} />
        ))}</div>}
    </div>)
}

const DealerCard = ({ dealer } : any) => {
  const { dealership_id, good, bad, needs_review, reviewed } = dealer;
  const total = good + bad + needs_review + reviewed;
  
  return (
    <div className="bg-zinc-950 rounded-xl shadow-lg px-4 py-3 border border-emerald-950 cursor-pointer hover:bg-zinc-900 hover:translate-x-1 hover:-translate-y-1 hover:border-blue-500 duration-300">
      <div className="flex items-center mb-6 pb-2 border-b border-emerald-950">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4">
          <CarFront className="text-emerald-600 w-5 h-5" />
        </div>
        <div className="font-bold text-xl text-emerald-600">{dealership_id} </div>  
      </div>
      <div className="grid grid-cols-12 text-gray-400 text-sm font-semibold">
        <div className="col-span-10">Total Event</div>
        <div className="col-span-2">{total}</div>
        <div className="col-span-10">Good</div>
        <div className="col-span-2">{good}</div>
        <div className="col-span-10">Bad</div>
        <div className="col-span-2">{bad}</div>
        <div className="col-span-10">Need Review</div>
        <div className="col-span-2">{needs_review}</div>
        <div className="col-span-10">Reviewed</div>
        <div className="col-span-2">{reviewed}</div>
      </div>
    </div>
)};

const EmptyDealership = () => {
  return (<div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-950 rounded-xl shadow-sm mt-16">
    <div className="relative mb-2">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-50 rounded-full blur-xl opacity-20"></div>
        <div className="relative p-5  rounded-full shadow-inner">
            <CarFront size={56} className="text-gray-300" strokeWidth={1.5} aria-label="No dealership icon"/>
        </div>
        </div>   
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Dealerships Found</h3>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">There are currently no dealership entries in the system. New entries will appear here once they are added.</p>
    </div>
)};