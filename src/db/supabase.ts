import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Check connection
supabase
  .from('information_schema.tables') // Use any Supabase table here
  .select('table_name')
  .then(({ data, error }) => {
    if (error) {
      console.error('Unable to connect to Supabase:', error);
    } else {
      console.info('Connection to Supabase successful:', data);
    }
  });

export default supabase;