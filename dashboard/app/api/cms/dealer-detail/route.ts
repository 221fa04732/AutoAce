import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req : NextRequest){
    try{
        const supabase =await createClient()
        const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        if(user_error || !user_data || user_data.user.user_metadata.role != 'user'){
            return NextResponse.json({
                message : 'Unauthorized access'
            },{status : 401})
        }

        const {data : dealer_data, error : dealer_error} = await supabase.from('assign_event').select('*').eq('cms_id', user_data.user.id)
        if(dealer_error){throw new Error()}
        return NextResponse.json({
            dealer_data
        }, {status : 200})
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500})
    }
}   