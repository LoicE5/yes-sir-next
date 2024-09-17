import { NextApiRequest, NextApiResponse } from "next"
import supabaseApi from "@/db/supabaseServer"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`)
        return res.status(401).json({ message: 'Unauthorized' })

    const { error } = await supabaseApi.from('codes_history').select('code').limit(1)
    
    if (error)
        return res.status(500).json({message: `Keep DB awake : the cron job ran successfully, but the database returned an error`})

    return res.json({ message: `Keep DB awake : cron job successful` })
}