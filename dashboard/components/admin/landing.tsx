"use client"

import { useState } from "react"
import Sidebar from "./siderbar";
import Event from "./event";
import Dealership from "./dealership";
import CSM_Member from "./csm";
import History from "./history";

export default function AdminLanding(){
    const [item, setItem] = useState('event')

    return(<div className="fixed top-16 bottom-0 left-0 right-0">
       <div className="h-full w-full grid grid-cols-12">
        <div className="col-span-2 border-r"><Sidebar setItem={setItem} item={item}/></div>
        <div className="col-span-10 p-4 overflow-y-scroll thin-scrollbar">
            {item==='event' && <Event />}
            {item==='dealership' && <Dealership />}
            {item==='csm' && <CSM_Member />}
            {item==='history' && <History />}
        </div>
       </div>
    </div>
)}