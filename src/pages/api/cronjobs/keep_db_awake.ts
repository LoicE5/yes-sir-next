import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"

const TABLE = 'keep_db_awake'
const CLEANUP_OLDER_THAN_DAYS = 7
const MS_PER_DAY = 86_400_000

type DatabaseOperation = PromiseSettledResult<{ error: { message: string } | null }>

function opStatus(settled: DatabaseOperation): 'ok' | 'error' {
    return settled.status === 'fulfilled' && !settled.value.error ? 'ok' : 'error'
}

function opErrorMsg(settled: DatabaseOperation): string | null {
    if (settled.status === 'rejected')
        return String(settled.reason)
    return settled.value.error?.message ?? null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`)
        return res.status(401).json({ message: 'Unauthorized' })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey)
        return res.status(500).json({ message: 'Keep DB awake: missing environment variables' })

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)

    const now = new Date().toISOString()

    const [serviceRead, serviceWrite] = (await Promise.allSettled([
        serviceClient.from(TABLE).select('id').limit(1),
        serviceClient.from(TABLE).insert({ pinged_at: now, key_type: 'service_role' }),
    ])) as DatabaseOperation[]

    // Cleanup records older than CLEANUP_OLDER_THAN_DAYS days (fire-and-forget, does not affect response)
    const cutoff = new Date(Date.now() - CLEANUP_OLDER_THAN_DAYS * MS_PER_DAY).toISOString()
    void serviceClient.from(TABLE).delete().lt('pinged_at', cutoff)

    res.setHeader('Cache-Control', 'no-store, must-revalidate')

    const results = {
        service_read:  opStatus(serviceRead),
        service_write: opStatus(serviceWrite),
    }

    const allOk = Object.values(results).every(v => v === 'ok')

    if (!allOk) {
        const errors = {
            service_read:  opErrorMsg(serviceRead),
            service_write: opErrorMsg(serviceWrite),
        }
        return res.status(500).json({ message: 'Keep DB awake: some operations failed', results, errors })
    }

    return res.json({ message: 'Keep DB awake: cron job successful', results })
}
