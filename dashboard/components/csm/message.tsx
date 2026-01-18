'use client'

import { supabaseClient } from "@/lib/supabase/client"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import BASE_URL from "@/lib/config"
import { Button } from "../ui/button"
import { format } from "date-fns"
import { Users, ArrowUpToLine, ArrowDownToLine, RotateCcw } from "lucide-react"
import SimpleError from "../simpleError"
import { SimpleLoader } from "../simpleLoader"
import { toast } from "sonner"

type MessageRow = {
  id: string
  phone: string
  message: string
  created_at: string
  sender: string // "client" | csm email
}

export default function Message({ phoneNumber }: { phoneNumber: string }) {
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)


  const [recommendationData, setRecommendationData] = useState([])
  const [recommendationLoader, setRecommendationLoader] = useState(false)

  const fetchRecommendationData = async () => {
    try {
      setRecommendationLoader(true)
      const res = await axios.post(`${BASE_URL}/api/cms/recommended-sms`,{
        sms_data : messages
      })
      setRecommendationData(res.data.recommended_action)
    } 
    catch (err) {
      toast.error('Server Error, Please try again!')
    } 
    finally {
      setRecommendationLoader(false)
    }
  }

  const handleSendSMS = async (message : string) => {
    setRecommendationData([])
    if(message===''){
        toast('Missing Fields')
        return;
    }
    try{
        await axios.post(`${BASE_URL}/api/cms/send-sms`,{
            message : message,
            clientPhoneNumber : phoneNumber
        })
        toast('sms sent')
    }
    catch(err){
        toast.error('error while sending message')
    }
  }

  // 1️⃣ Load full chat history

  const fetchChatHistory = async () => {
    setLoading(true)
    setError(false)
      try {
        const res = await axios.get(`${BASE_URL}/api/cms/sms/${phoneNumber}`)
        const oldMessages = res.data.sms_data

        const apiMessages: MessageRow[] = oldMessages.map((item: any) => ({
          id: item.id,
          phone: item.phone,
          message: item.message,
          created_at: item.created_at,
          sender: item.sender,
        }))

        setMessages(apiMessages)
      } 
      catch (err) {
        setError(true)
      } 
      finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchChatHistory()
  }, [phoneNumber])

  // 2️⃣ Realtime updates
  useEffect(() => {
    const channel = supabaseClient
      .channel(`message-changes-${phoneNumber}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
        },
        (payload) => {
          const newRow = payload.new as MessageRow
          setMessages(prev => {
            if (prev.some(m => m.id === newRow.id)) return prev
            return [...prev, newRow]
          })
        }
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [phoneNumber])

  const containerRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    scrollBottom()
  }, [messages, recommendationData])
  
  const scrollTop = ()=>{
    if(containerRef && containerRef.current)
    containerRef.current.scrollTop = 0
  }
  
  const scrollBottom = () =>{
    if(containerRef && containerRef.current)
    containerRef.current.scrollTop = containerRef.current?.scrollHeight
  }
  
  const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return format(date, 'MMM d, yyyy h:mm a')
  }

  if (loading) { return <SimpleLoader />}
  if(error) { return <SimpleError />}

  return (<div className="relative">
      <div id="message-container" ref={containerRef} className="h-96 overflow-y-auto bg-slate-900 p-4 space-y-4 scroll-smooth rounded-md">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg font-medium text-gray-300">No messages yet</p>
            <p className="text-sm text-gray-500">Start a conversation with the customer</p>
          </div>
        ) : (
            messages.map((item) => {
                const isClient = item.sender === "client"
                return (<div key={item.id} className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}>
                    <div  className={`max-w-[80%] min-w-[35%] rounded-lg px-3 py-2 ${isClient ? 'bg-slate-800 text-slate-100 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                    { !isClient && <div className="flex items-center space-x-2 mb-1 text-gray-400">
                        <Users size={14}/> <span className="font-semibold">{item.sender}</span>
                    </div>}
                    <p className="text-sm">{item.message}</p>
                    </div>
                    <span className={`text-xs px-1   ${isClient ? 'text-slate-500' : 'text-blue-400'}`}>
                    {formatDate(item.created_at)}
                    </span>
                </div>)
            }))}
            {recommendationData.length > 0 && (
              <div className="flex flex-wrap justify-end gap-2 mt-3">
                {recommendationData.map((item: string, index: number) => (
                  <button onClick={()=>{
                    handleSendSMS(item)
                  }} key={index} className="px-3 py-1.5 text-sm rounded-full border border-dashed border-gray-400 text-gray-700 bg-white hover:border-gray-600 hover:bg-blue-100 transition">{item}</button>
                ))}
              </div>
            )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={()=>{
            if(!recommendationLoader){fetchRecommendationData()}
            }}>{recommendationLoader ? "Please Wait" : "AI Recommendation"}</Button>
          <Button onClick={()=>{scrollTop()}}><ArrowUpToLine size={18} /></Button>
          <Button onClick={()=>{scrollBottom()}}><ArrowDownToLine size={18} /></Button>
          <Button onClick={()=>{fetchChatHistory()}}><RotateCcw size={18} /></Button>
        </div>
    </div>
)}