import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as forAdmin} from '@supabase/supabase-js'

const supabaseAdmin = forAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string 
)

export async function GET(req : NextRequest, {params} : {params : any}){
    try{
        const supabase =await createClient()
        const { phone } = await params;
        const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        if(user_error || !user_data || user_data.user.user_metadata.role != 'user'){
            return NextResponse.json({
                message : 'Unauthorized access'
            },{status : 401})
        }

        const {data : sms_data, error : sms_error} = await supabaseAdmin.from('message').select('*').eq('phone', phone).order('created_at', { ascending: true })
        if(sms_error){throw new Error()}

        return NextResponse.json({
            sms_data,
        }, {status : 200})
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500})
    }
}   