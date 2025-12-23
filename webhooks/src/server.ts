import express, { raw } from 'express'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { supabase } from './lib/db.js'
import { redisConnection } from './lib/redis.js'
import { Queue } from 'bullmq'

dotenv.config()
const app = express()
const queue = new Queue('event', {
    connection : redisConnection
})
app.use(raw({ type : 'application/json' }))
const PORT = process.env.PORT
const WEBHOOKS_SECRET=process.env.WEBHOOKS_SECRET as string

app.post('/webhooks/retell', async(req, res)=>{
    try{
        const rawData = req.body.toString();
        const timestamp = req.headers['x-timestamp'] as string
        const signature = req.headers['x-signature'] as string

        if(!timestamp || !signature){
            res.status(400).json({
                msg : "Missing headers"
            })
            return;
        }

        // check timeout (1 sec)
        if(Math.abs(Date.now()/1000 - Number(timestamp)) > 1){
            res.status(401).json({
                msg : "Request timeout"
            })
            return;
        }

        // check authentication (using HMAC)
        const currSignature = crypto.createHmac('sha256', WEBHOOKS_SECRET).update(`${timestamp}.${rawData}`).digest('hex');
        const isAuthorized = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(currSignature));
        if(!isAuthorized){
            res.status(401).json({
                signature,
                currSignature,
                msg : "Unauthorized access"
            })
            return;
        }

        // check idempotency
        const data = JSON.parse(rawData)
        const {data: isDuplicate} = await supabase.from('event').select('*').eq('event_id', data.event_id).single()
        if(isDuplicate){
            res.status(409).json({
                msg : 'Event already exist'
            })
            return;
        }

        // event added to DB (supabase)
        const {error} = await supabase.from('event').insert({
            event_id : data.event_id,
            dealership_id : data.dealership_id,
            call_id : data.call_id,
            timestamp : data.timestamp,
            transcript : data.transcript,
            phone : data.customer.phone,
            name : data.customer.name,
            duration_sec : data.metadata.duration_sec,
            channel : data.metadata.channel,
            ai_engine : data.metadata.ai_engine,
        })

        if(error){
            res.json({
                msg  : "Error while handling data",
            })
            return;
        }

        // event push to queue for analysis
        await queue.add('analyse-event', {event_id : data.event_id, transcript : data.transcript})
        res.status(200).json({
            msg : "Event done sucessfully"
        })
    }
    catch(err){
        res.status(500).json({
            msg : "Server error"
        })
    }
})

app.listen(PORT, ()=>{
    console.log(`webhook listening on ${PORT}`)
})