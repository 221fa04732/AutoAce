import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function POST(req : NextRequest){
    try{
        const mailData = await req.json();
        const supabase =await createClient()
        const { data : user_data, error : user_error} = await supabase.auth.getUser();
        
        if(user_error || !user_data || user_data.user.user_metadata.role != 'user'){
            return NextResponse.json({
                message : 'Unauthorized access'
            },{status : 401})
        }

        if(!mailData.email || !mailData.message){
            return NextResponse.json({ 
                message: "Missing data" 
            },{ status: 201 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: 'AutoAce Support',
            to: mailData.email,
            subject: 'AutoAce - Regarding call resolving.',
            text: mailData.message,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ 
            success: true, 
            message: "Message send successfully!" 
        });
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500})
    }
}   