import { PhoneCall, History, Users, CarFront } from 'lucide-react';

export default function Sidebar({setItem, item } : any){
    return(<div className='p-4 flex flex-col gap-4'> 
        <div onClick={()=>{setItem('event')}} className={`flex justify-start items-center gap-2 text-md font-semibold text-stone-400 hover:text-white cursor-pointer hover:bg-stone-800 rounded-md p-2 ${item==='event' && 'bg-stone-900 text-white'}`}><PhoneCall className='w-4 h-4' />Call Details</div>
        <div onClick={()=>{setItem('csm')}} className={`flex justify-start items-center gap-2 text-md font-semibold text-stone-400 hover:text-white cursor-pointer hover:bg-stone-800 rounded-md p-2 ${item==='csm' && 'bg-stone-900 text-white'}`}><Users className='w-4 h-4' />CSM Member</div>
        <div onClick={()=>{setItem('dealership')}} className={`flex justify-start items-center gap-2 text-md font-semibold text-stone-400 hover:text-white cursor-pointer hover:bg-stone-800 rounded-md p-2 ${item==='dealership' && 'bg-stone-900 text-white'}`}><CarFront className='w-4 h-4' />Dealership</div>
        <div onClick={()=>{setItem('history')}} className={`flex justify-start items-center gap-2 text-md font-semibold text-stone-400 hover:text-white cursor-pointer hover:bg-stone-800 rounded-md p-2 ${item==='history' && 'bg-stone-900 text-white'}`}><History className='w-4 h-4' />History</div>
    </div>)
}