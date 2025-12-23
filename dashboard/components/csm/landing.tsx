"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import History from "./history"
import Event from "./event"

export default function CMSLanding(){
    const [item, setItem] = useState('event')

    return(<div className="fixed top-16 bottom-0 left-0 right-0">
       <div className="h-full w-full grid grid-cols-12">
        <div className="col-span-2 border-r"><Sidebar setItem={setItem} item={item}/></div>
        <div className="col-span-10 p-4 overflow-scroll">
            {item==='event' && <Event />}
            {item==='history' && <History />}
        </div>
       </div>
    </div>
)}