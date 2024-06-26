import { NextApiRequest, NextApiResponse } from "next"
import supabaseApi from "@/db/supabaseServer"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`)
        return res.status(401).json({ message: 'Unauthorized' })

    const { error } = await supabaseApi.from('codes').select('id').limit(1)
    
    const message = error ? `Keep DB awake : the cron job ran successfully, but the database returned an error` : `Keep DB awake : cron job successful`

    return res.json({ message: message })
}