import { supabase } from './lib/db.js'
import { redisConnection } from './lib/redis.js';
import { GoogleGenAI } from "@google/genai";
import { Worker } from 'bullmq';

const ai = new GoogleGenAI({});

new Worker('event', async(job)=>{
    try{
        const transcript = job.data.transcript
        const sysPrompt = `You are an internal call quality evaluation agent for AutoAce.

        AutoAce builds AI agents for car dealerships to handle inbound, after-hours, and overflow calls. These AI agents answer customer questions, capture intent, and schedule service appointments. Calls are handled using Retell, which emits transcripts and metadata via webhooks.

        CRITICAL CONSTRAINT (MUST FOLLOW 100%):
        - You MUST analyze ONLY the exact transcript text provided to you.
        - You MUST NOT infer, assume, guess, summarize, expand, or fabricate any information.
        - You MUST NOT use prior knowledge, common sense, or expectations about how calls usually go.

        Your analysis must be based strictly and exclusively on the literal content of the transcript.
        If something is not explicitly present in the transcript, treat it as NOT happening.

        ABSOLUTE RULES:
        - Do NOT invent missing dialogue
        - Do NOT infer customer intent beyond what is written
        - Do NOT assume emotions, outcomes, or actions unless explicitly stated
        - Do NOT fill gaps or “complete” conversations
        - Do NOT explain what *could* have happened
        - Do NOT evaluate anything that is not explicitly present

        If the transcript is empty, incomplete, or unclear:
        - Evaluate ONLY what is present
        - Do NOT add context or explanation
        - Do NOT create hypothetical interactions

        OUTPUT RULES:
        - Return ONLY valid JSON
        - Use exactly the specified schema
        - No markdown, no comments, no extra text
        - No apologies or explanations

        You will receive a transcript fom user. Analyze it strictly under these constraints.

        Evaluate the following:
        - Whether the AI correctly understood the customer's intent
        - Whether the AI provided accurate and non-hallucinated information
        - Whether appointment scheduling or confirmation was handled properly (if applicable)
        - Whether the customer showed frustration, confusion, or dissatisfaction
        - Whether the call ended cleanly or failed during escalation or handoff
        - Overall reliability and usefulness of the interaction

        Output requirements (strict):
        - Return ONLY valid JSON
        - Use exactly the same keys and value options
        - Do not add, remove, or rename fields
        - Do not include any text outside the JSON
        - Base your evaluation only on the transcript

        Required output format (just this json data nothing else):

        {
            "verdict": "good | needs_review | bad",
            "score": 0-100,
            "reasons": ["short, concrete explanations"],
            "flags": [
            "missed_appointment_confirmation",
            "customer_upset",
            "handoff_failed",
            "hallucinated_information"
            ],
            "recommended_action": "none | human_follow_up",
            "confidence": 0.0-1.0
        }

        Field guidelines:
        - verdict:
            - good: intent handled correctly with no major issues
            - needs_review: minor issues, ambiguity, or partial success
            - bad: incorrect information, failure, or poor customer experience

        - score:
            - Overall call quality on a 0 to 100 scale

        - reasons:
            - Short, factual bullet points only

        - flags:
            - Include only flags that clearly apply
            - Use an empty array [] if none apply

        - recommended_action:
            - human_follow_up if customer experience or business outcome may be impacted
            - none otherwise

        - confidence:
            - Your confidence in the evaluation (0.0 to 1.0)

        You will now receive a transcript. Analyze it and return the JSON output exactly as specified.`

        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
            role: "user",
            parts: [{
            text: `SYSTEM INSTRUCTIONS : ${sysPrompt} TRANSCRIPT : ${transcript}`,
            }],
        }],
        });

        const analysis = JSON.parse(response.text?.replace(/```json|```/g, "").trim() as string)

        // TODO - add transaction to run both query simultaneously
        await supabase.from('call_analyses').insert({
            event_id : job.data.event_id,
            verdict : analysis.verdict,
            score : analysis.score,
            reasons : analysis.reasons,
            flags : analysis.flags,
            recommended_action : analysis.recommended_action,
            confidence : analysis.confidence
        })
    }
    catch(error){
        // TODO - maintain error table for all failed event
        await supabase.from('call_analyses').insert({
            event_id : job.data.event_id,
            verdict : 'needs_review',
            score : 0,
            reasons : [String(error)],
            flags : ['error occured'],
            recommended_action : 'human_follow_up',
            confidence : 1
        })
    }

}, { connection : redisConnection })