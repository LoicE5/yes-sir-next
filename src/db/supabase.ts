import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKeys = {
    serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    anon: process.env.SUPABASE_ANON_KEY!
}
const supabaseApi = createClient(supabaseUrl, supabaseKeys.serviceRole)
const supabaseClient = createClient(supabaseUrl, supabaseKeys.anon)

export {
    supabaseApi,
    supabaseClient
}