"use client"

import { useEffect, useState, useRef } from "react"
import { SimpleLoader } from "../simpleLoader"
import SimpleError from "../simpleError"
import BASE_URL from "@/lib/config"
import axios from "axios"
import { Users } from "lucide-react"
import { format } from "date-fns"

interface Message {
  id: string
  created_at: string
  phone: string
  message: string
  sender: string
}

export default function MessageHistory({ phoneNumber }: { phoneNumber: string }) {
  const [messageData, setMessageData] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchSmsData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cms/sms/${phoneNumber}`)
      const newMessages = res.data.sms_data
      setMessageData(prev =>{
        const prevLastId = prev[prev.length - 1]?.id
        const newLastId = newMessages[newMessages.length - 1]?.id
        return prevLastId === newLastId ? prev : newMessages
      })
    } 
    catch (err) {
      setError(true)
    } 
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSmsData() 
    const timeInterval = setInterval(()=>{
      fetchSmsData()
    },3000)

    return () => clearInterval(timeInterval)

  }, [phoneNumber])

const containerRef = useRef<HTMLDivElement | null>(null)

useEffect(() => {
  if(containerRef && containerRef.current)
    containerRef.current.scrollTop = containerRef.current?.scrollHeight
}, [messageData])

  const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return format(date, 'MMM d, yyyy h:mm a')
  }

  if (loading) { return (<SimpleLoader />)}
  if (error) {return (<SimpleError />)}

  return (<div className="relative">
      <div id="message-container" ref={containerRef} className="h-64 overflow-y-auto bg-slate-900 p-4 space-y-4 scroll-smooth">
        {messageData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg font-medium text-gray-300">No messages yet</p>
            <p className="text-sm text-gray-500">Start a conversation with the customer</p>
          </div>
        ) : (
            messageData.map((item) => {
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
        </div>
    </div>
)}