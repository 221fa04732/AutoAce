import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
  
export async function POST(req : NextRequest, {params} : {params : any}){

    const { id } = await params;
    try{
        const supabase =await createClient()
        const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        if(user_error || !user_data || user_data.user.user_metadata.role != 'admin'){
            return NextResponse.json({
                message : 'Unauthorized access'
            },{status : 401})
        }

        const { error : remove_deler_error } = await supabase.from('assign_event').update({'is_assigned' : 'FALSE'}).eq('id', id);
        if(remove_deler_error){throw new Error()}
        return NextResponse.json({
            message : 'dealer removed sucessfully'
        }, {status : 200})
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500})
    }
}   