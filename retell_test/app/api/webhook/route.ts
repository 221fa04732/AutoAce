import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
  
export async function GET(req : NextRequest){
    return NextResponse.json({
        message : 'Healthy Server'
    },{ status : 201})
}   

export async function POST(req : NextRequest){
    try{
        const data = await req.json()
        const {data : webhook_data, error : webhook_error } = await supabase.from('retell_webhook').insert({
            data : data
        })
        if(webhook_error){
            throw new Error()
        }
        return NextResponse.json({
            message : 'data saved'
        }, { status : 201 })
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500})
    }
}   