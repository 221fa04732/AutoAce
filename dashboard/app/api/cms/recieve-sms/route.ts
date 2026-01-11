import { NextRequest, NextResponse } from "next/server";
import { createClient as forAdmin} from '@supabase/supabase-js'

const supabaseAdmin = forAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string 
)

export async function POST(req : NextRequest){
    try{
        const smsRawData = await req.formData();
        const smsRecieveData = Object.fromEntries(smsRawData.entries());

        const {error : message_error } = await supabaseAdmin.from('message').insert({
            phone : smsRecieveData.From,
            message : smsRecieveData.Body,
            sender : 'client',
        })
        if(message_error){throw new Error()}
        
        return NextResponse.json({ 
            success: true, 
            message: "sms recieve successfully!" 
        }, { status : 200 });
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500})
    }
}   