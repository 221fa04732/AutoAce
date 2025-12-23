import { createClient as forAdmin} from '@supabase/supabase-js'
import { createClient as forServer} from "@/lib/supabase/server";
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = forAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string 
)

export async function GET(){
    try{
        const supabase =await forServer()
        const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        if(user_error || !user_data || user_data.user.user_metadata.role != 'admin'){
            return NextResponse.json({
                message : 'Unauthorized access'
            },{status : 401})
        }

        const { data, error } = await supabaseAdmin.auth.admin.listUsers()
        if(error){
            throw new Error()
        }
        return NextResponse.json({
            error, 
            data
        }, {status : 200})
    }
    catch(e){
        return NextResponse.json({
            message : "Server error"
        }, {status : 500})
    }
}

export async function POST(req : NextRequest){
    const data : any =await req.json()
    try{
        const supabase =await forServer()
        const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        if(user_error || !user_data || user_data.user.user_metadata.role != 'admin'){
            return NextResponse.json({
                message : 'Unauthorized access'
            },{status : 401})
        }

        const { data : assign_dealer, error: dealer_error} = await supabase.from('assign_event').insert({
            dealer_id : data.dealership_id,
            cms_id : data.csm_id
        })
        if(dealer_error){throw new Error()}
        return NextResponse.json({
            message : 'dealer assign sucessfully'
        }, {status : 200})
    }
    catch(e){   
        return NextResponse.json({
            message : "Server error"
        }, {status : 500})
    }
}