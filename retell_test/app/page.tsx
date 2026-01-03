import { supabase } from "@/lib/db";

export default async function Home(){
    const data = await supabase.from('retell_webhook').select('*')
    return(<div className="flex flex-col justify-center items-center gap-10 my-10">
        {data.data?.map((item : any, index : number)=>(
            <div key={index} className="flex flex-col justify-center items-center border gap-2">
                <div className="text-red-500">{item.id}</div>
                <div>{JSON.stringify(item.data)}</div>
            </div>
        ))}
    </div>)
}