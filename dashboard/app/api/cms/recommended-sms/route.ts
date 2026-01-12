import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server.js";
const ai = new GoogleGenAI({});

export async function POST(req : NextRequest){
    try{
        const sms_data =await req.json()
        const sysPrompt = `You are an AI assistant that helps a human agent reply to SMS messages.
        
            Your task:
            - Read the previous chat conversation.
            - Understand the client's last message, intent, and sentiment.
            - Suggest EXACTLY 2 or 3 short follow-up SMS replies the agent can send.
        
            Rules:
            - Replies must sound natural, polite, and human.
            - Each message must be under 160 characters.
            - Do NOT include emojis.
            - Do NOT repeat the client's message.
            - Do NOT fabricate facts or promises.
            - Ask at most one question per message.
            - If information is missing, ask for clarification.
            - If the client is inactive or vague, suggest a gentle nudge.
            - Also make sure to give suggestion on latest chat.
            - If there is no enough conversation, please make friendly suggestion.
        
            Output format:
            Return ONLY a valid JSON array of strings.
            No markdown. No explanation.
            
            Example output:
            [
            "Could you please confirm a good time to discuss this?",
            "Let me know if you did like me to share more details.",
            "I can help with the next steps whenever you are ready."
            ]`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                role: "user",
                parts: [{
                text: `SYSTEM INSTRUCTIONS : ${sysPrompt} PREVIOUS_CHAT : ${JSON.stringify(sms_data)}`,
                }],
            }],
        });
        const recommended_action = JSON.parse(response.text?.replace(/```json|```/g, "").trim() as string)

        return NextResponse.json({
            recommended_action
        }, { status : 200 })
    }
    catch(err){
        return NextResponse.json({
            message : 'Server error'
        },{ status : 500 })
    }
}