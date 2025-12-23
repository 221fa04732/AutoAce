import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { error } from "console";

export async function GET(req : NextRequest, {params} : {params : any}){
    try{
        const { id } = await params;
        const supabase =await createClient()
        const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        if(user_error || !user_data || user_data.user.user_metadata.role != 'user'){
            return NextResponse.json({
                message : 'Unauthorized access'
            },{status : 401})
        }

        const {data : event_data, error : event_error} = await supabase.from('event_view').select('*').eq('dealership_id', id).in('verdict' , ['bad', 'needs_review'])
        if(event_error){throw new Error()}
        return NextResponse.json({
            event_data
        }, {status : 200})
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500})
    }
}   