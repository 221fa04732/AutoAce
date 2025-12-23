'use client'

import axios from "axios"
import { useEffect, useState } from "react"
import { RotateCw } from "lucide-react"
import { Loader } from "../loader"
import Error from "../error"
import { Users, Plus, ChevronDown, ChevronUp, CarFront, Trash, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SimpleError from "../simpleError"
import { SimpleLoader } from "../simpleLoader"
import { toast } from "sonner"
import BASE_URL from "@/lib/config"

export default function CSM_Member(){

    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(false)
    const [data, setData] = useState([])

    const fetchData = async () => {
        setLoader(true)
        setError(false)
        try{
            const res = await axios.get(`${BASE_URL}/api/admin/csm`)
            setData(res.data.data.users)
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
            <div className="text-lg font-bold">CSM Members</div>
            <button className="flex justify-center items-center gap-2 px-3 py-1 border rounded-lg hover:bg-stone-900" onClick={()=>{fetchData()}}><RotateCw className="h-4 w-4"/>Refresh</button>
        </div>
        {data.length === 0 ? <CSM_MemberDealership /> : <div className="w-full flex flex-col my-6 gap-4">{data && data.map(( item : any, index)=>(item.user_metadata.role === 'user' && <CSM_MemberCard key={index} csm={item} />))}</div>}
    </div>)
}

const CSM_MemberCard = ({ csm } : any) => {

    const [isExpanded, setIsExpanded] = useState(false)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(false)
    const [data, setData] = useState([])
    const [dealershipId, setDealershipId] = useState('')

    const handleAssign = async () => {
        if(dealershipId === ''){
            toast('please enter dealership id')
            return;
        }
        try{
            await axios.post(`${BASE_URL}/api/admin/csm`, {
                dealership_id : dealershipId,
                csm_id : csm.id
            })
            toast('dealership assigned')
            setDealershipId('')
        }
        catch(err){ 
            toast('error occured')
        }
    }

    const fetchDealership = async () => {
        setData([])
        setError(false)
        setLoader(true)
        try{
            const res = await axios.get(`${BASE_URL}/api/admin/csm/all-dealer/${csm.id}`)
            setData(res.data.assign_event)
        }
        catch(err){
            setError(true)
        }
        finally{
            setLoader(false)
        }
    }

  return (
    <div className="bg-zinc-950 rounded-xl shadow-lg px-4 py-3 border border-neutral-600 hover:bg-zinc-900 hover:-translate-y-1 hover:border-gray-500 duration-300" >
      <div className="flex items-center justify-between">
        <div className="flex justify-center items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <Users className="w-5 h-5 text-yellow-800" />
            </div>
            <div className="font-bold text-xl">{csm.email} </div>  
        </div> 
        <div className="flex gap-4">
            <button onClick={() => {
                    setIsExpanded(!isExpanded)  
                    {!isExpanded && fetchDealership()}
                }}
                className="flex items-center gap-2 h-fit px-4 py-2 text-xs text-blue-400 hover:text-blue-300 bg-blue-950/40 rounded-full">
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {isExpanded ? 'View Less' : 'View Details'}
            </button>
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex items-center justify-center gap-2 font-semibold text-sm border px-4 py-1 rounded-full bg-black hover:bg-zinc-800 hover:scale-105">
                        <Plus size={16}/>
                        <div>Assign Dealership</div>
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Assign Dealership</DialogTitle>
                        <DialogDescription>Enter dealership id and click on assign.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Dealership Id</Label>
                            <Input placeholder="toyota-braintree" value={dealershipId} onChange={(e)=>{setDealershipId(e.target.value)}}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={()=>{handleAssign()}}>Assign</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>
      {isExpanded && <div className="border-t mt-4 pt-2">{loader && <SimpleLoader />} {error && <SimpleError />} {!loader && !error &&data && data.length === 0 ? <div className="h-64 flex flex-col justify-center items-center gap-2 italic font-bold text-gray-500"><CarFront />No Dealership Assign Yet</div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 px-4">{data.map((item : any)=>(
        <DealerList key={item.id} dealer={item} />
      ))}</div>}
      </div>}
    </div>
)};

const CSM_MemberDealership = () => {
  return (<div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-950 rounded-xl shadow-sm mt-16">
    <div className="relative mb-2">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-50 rounded-full blur-xl opacity-20"></div>
        <div className="relative p-5  rounded-full shadow-inner">
            <Users size={56} className="text-gray-300" strokeWidth={1.5} aria-label="No dealership icon"/>
        </div>
        </div>   
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No CSM Member Found</h3>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">There are currently no CSM Member entries in the system.</p>
    </div>
)};

const DealerList = ({dealer} : any) =>{

    const handleRemoveDelearship = async () => {
        try{
            await axios.post(`${BASE_URL}/api/admin/csm/remove-dealer/${dealer.id}`)
            toast('dealership removed')
        }
        catch(err){
            toast('error occured')
        }
    }

    return(<div className="flex items-center justify-between border py-2 px-4 rounded-md hover:-translate-y-1 hover:translate-x-1 duration-300"> 
        <div className="col-span-1 flex gap-2 justify-center items-center text-lg font-semibold"><LayoutDashboard size={10}/>{dealer.dealer_id}</div>
        <button onClick={()=>{
            handleRemoveDelearship()
        }} className="flex justify-center items-center gap-1 p-1 hover:text-red-500 text-red-400"><Trash size={15} className="text-red-500"/>remove</button>
    </div>)
}