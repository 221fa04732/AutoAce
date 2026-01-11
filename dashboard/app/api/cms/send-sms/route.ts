import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import twilio from 'twilio'
import { createClient as forAdmin} from '@supabase/supabase-js'

const supabaseAdmin = forAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string 
)

export async function POST(req : NextRequest){
    try{
        const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
        const authToken = process.env.TWILIO_AUTH_TOKEN as string;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER as string;
        const client = twilio(accountSid, authToken);
        const smsData = await req.json();
        const supabase =await createClient()

        const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        if(user_error || !user_data || user_data.user.user_metadata.role != 'user'){
            return NextResponse.json({
                message : 'Unauthorized access'
            },{status : 401})
        }

        if(!smsData.message){
            return NextResponse.json({ 
                message: "Missing data" 
            },{ status: 201 });
        }

        const message = await client.messages.create({
            body: smsData.message,
            from: twilioPhoneNumber,
            to: smsData.clientPhoneNumber,
        });

        const { error : message_error } = await supabaseAdmin.from('message').insert({
            phone : smsData.clientPhoneNumber,
            message : smsData.message,
            sender : user_data.user.user_metadata.email
        })
        if(message_error){throw new Error()}

        return NextResponse.json({ 
            success: true, 
            message: "sms send successfully!" 
        });
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500})
    }
}   