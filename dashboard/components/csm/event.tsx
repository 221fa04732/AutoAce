'use client'

import axios from "axios"
import { useEffect, useState } from "react"
import { RotateCw } from "lucide-react"
import { Loader } from "../loader"
import Error from "../error"
import { ChevronDown, ChevronUp, CarFront, Phone,  CheckCircle, AlertTriangle, ArrowUpRight, MessageSquare, Mail } from "lucide-react"
import SimpleError from "../simpleError"
import { SimpleLoader } from "../simpleLoader"
import CallDetailCard from "../admin/call_detail_card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import BASE_URL from "@/lib/config"
import { SmsCommandListInstance } from "twilio/lib/rest/supersim/v1/smsCommand"

export default function Event(){

    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(false)
    const [data, setData] = useState([])

    const fetchData = async () => {
        setLoader(true)
        setError(false)
        try{
            const res = await axios.get(`${BASE_URL}/api/cms/dealer-detail`)
            setData(res.data.dealer_data)
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
            <div className="text-lg font-bold">Assigned Dealership Detail</div>
            <button className="flex justify-center items-center gap-2 px-3 py-1 border rounded-lg hover:bg-stone-900" onClick={()=>{fetchData()}}><RotateCw className="h-4 w-4"/>Refresh</button>
        </div>
        {data.length === 0 ? <EmptyDealerList /> : <div className="w-full flex flex-col my-6 gap-4">{data && data.map(( item : any, index)=>(<DealershipCard key={index} dealer={item}/>))}</div>}
    </div>)
}

const DealershipCard = ({ dealer } : any) => {

    const [isExpanded, setIsExpanded] = useState(false)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(false)
    const [data, setData] = useState([])
    const [email, setEmail]= useState('')
    const [message, setMessage]= useState('')
    const [sms, setSms] = useState('')

    const fetchCallDetails = async () => {
        setData([])
        setError(false)
        setLoader(true)
        try{
            const res = await axios.get(`${BASE_URL}/api/cms/call-detail/${dealer.dealer_id}`)
            setData(res.data.event_data)
        }
        catch(err){
            setError(true)
        }
        finally{
            setLoader(false)
        }
    }

    const handleResolveCall = async (event_id : string, call_id : string, dealership_id : string, status : string) => {
        try{
            await axios.post(`${BASE_URL}/api/cms/resolve-call`,{
                event_id,
                call_id,
                dealership_id,
                status
            })
            toast.success(`Call Reviewed : ${status}`)
        }
        catch(err){
            toast.error('Server Error')
        }
        finally{
            fetchCallDetails()
        }
    }

    const handleMessage = async () => {
        if(message==='' || email=== ''){
            toast('Missing Fields')
            return;
        }
        try{
            await axios.post(`${BASE_URL}/api/cms/send-message`,{
                email,
                message
            })
            toast('message sent')
            setEmail('')
            setMessage('')
        }
        catch(err){
            toast.error('error while sending message')
        }
    }

    const handleSMS = async () => {
        if(sms===''){
            toast('Missing Fields')
            return;
        }
        try{
            await axios.post(`${BASE_URL}/api/cms/send-sms`,{
                message : sms
            })
            toast('sms sent')
            setSms('')
        }
        catch(err){
            toast.error('error while sending message')
        }
    }

  return (
    <div className="bg-zinc-950 rounded-xl shadow-lg px-4 py-3 border border-neutral-600 hover:bg-zinc-900 hover:-translate-y-1 hover:border-gray-500 duration-300" >
      <div className="flex items-center justify-between">
        <div className="flex justify-center items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <CarFront className="w-5 h-5 text-yellow-800" />
            </div>
            <div className="font-bold text-xl">{dealer.dealer_id} </div>  
        </div> 
        <div className="flex gap-4">
            <button onClick={() => {
                    setIsExpanded(!isExpanded)  
                    {!isExpanded && fetchCallDetails()}
                }}
                className="flex items-center gap-2 h-fit px-4 py-2 text-xs text-blue-400 hover:text-blue-300 bg-blue-950/40 rounded-full">
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {isExpanded ? 'View Less' : 'View Details'}
            </button>
        </div>
      </div>
      {isExpanded && <div className="border-t mt-4 pt-2">{loader && <SimpleLoader />} {error && <SimpleError />} {!loader && !error &&data && data.length === 0 ? <div className="h-64 flex flex-col justify-center items-center gap-2 italic font-bold text-gray-500"><Phone onClick={()=>{
        toast('hii')
      }} />All Call Issue Resolved</div> : <div className="grid grid-cols-1 py-6 px-4 gap-2">{data.map((item : any, index : number)=>(
        <div key={index}>
            <div className="relative top-2 w-full border rounded-t-lg px-6 py-3 pb-8 flex items-center justify-between bg-slate-950">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    CSM Remarks
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={()=>{
                        handleResolveCall(item.event_id, item.call_id, item.dealership_id, 'resolved')
                    }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md 
                    bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle size={14} />Resolved
                    </button>
                    <button onClick={()=>{
                        handleResolveCall(item.event_id, item.call_id, item.dealership_id, 'follow_up')
                    }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md 
                    bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400">
                    <AlertTriangle size={14} />Follow-up
                    </button>
                    <button onClick={()=>{
                        handleResolveCall(item.event_id, item.call_id, item.dealership_id, 'escalated')
                    }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md 
                    bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">
                    <ArrowUpRight size={14} />Escalate
                    </button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"><Mail size={14} />Mail</button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                <Label htmlFor="name-1">Email</Label>
                                <Input placeholder="example@gmail.com" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                                </div>
                                <div className="grid gap-3">
                                <Label htmlFor="username-1">Message</Label>
                                <Textarea placeholder="Type your message here." className="min-h-32" value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={()=>{
                                    handleMessage()
                                }}>Send mail</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"><MessageSquare size={14} />SMS</button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                <Label htmlFor="username-1">Message</Label>
                                <Textarea placeholder="Type your message here." className="min-h-40" value={sms} onChange={(e)=>{setSms(e.target.value)}}/>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={()=>{
                                    handleSMS()
                                }}>Send sms</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <CallDetailCard key={item.id} event={item} />
        </div>))}</div>}
      </div>}
    </div>
)};

const EmptyDealerList = () => {
  return (<div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-950 rounded-xl shadow-sm mt-16">
    <div className="relative mb-2">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-50 rounded-full blur-xl opacity-20"></div>
        <div className="relative p-5  rounded-full shadow-inner">
            <CarFront size={56} className="text-gray-300" strokeWidth={1.5} aria-label="No dealership icon"/>
        </div>
        </div>   
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Dealership Assigned.</h3>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">There are currently no dealership assigned yet to you.</p>
    </div>
)};