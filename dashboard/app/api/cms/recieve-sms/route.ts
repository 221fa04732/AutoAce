import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as forAdmin} from '@supabase/supabase-js'

const supabaseAdmin = forAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string 
)

export async function POST(req : NextRequest){
    try{
        const smsRecieveData = await req.json();
        // const supabase =await createClient()

        // const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        // if(user_error || !user_data || user_data.user.user_metadata.role != 'user'){
        //     return NextResponse.json({
        //         message : 'Unauthorized access'
        //     },{status : 401})
        // }

        const {error : message_error } = await supabaseAdmin.from('sms_message').insert({
            conversationId : '1',
            message : String(smsRecieveData),
            sender : 'user',
        })
        if(message_error){throw new Error()}
        
        return NextResponse.json({ 
            success: true, 
            message: "sms send successfully!" 
        });
    }
    catch(err){
        return NextResponse.json({
            err,
            message : 'Server error'
        },{ status : 500})
    }
}   