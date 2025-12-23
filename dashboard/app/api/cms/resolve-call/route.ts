import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as forAdmin} from '@supabase/supabase-js'

const supabaseAdmin = forAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string 
)

export async function POST(req : NextRequest){
    try{
        const resolveCallData =await req.json()
        const supabase =await createClient()
        const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        if(user_error || !user_data || user_data.user.user_metadata.role != 'user'){
            return NextResponse.json({
                message : 'Unauthorized access'
            },{status : 401})
        }

        const {error : resolveCall_error} = await supabase.from('history').insert({
            call_id : resolveCallData.call_id,
            dealership_id : resolveCallData.dealership_id,
            cms_id : user_data.user.email,
            status : resolveCallData.status
        })
        if(resolveCall_error){throw new Error()}

        const {error : updateEventStatus_error} = await supabaseAdmin.from('call_analyses').update({verdict : 'reviewed'}).eq('event_id', resolveCallData.event_id)
        if(updateEventStatus_error){throw new Error()}
        return NextResponse.json({  
            message : 'Call resolved'
        }, {status : 200})
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500})
    }
}   