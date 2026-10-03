import { createClient } from '@supabase/supabase-js';
import process from 'node:process';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ||  process.env.SUPABASE_URL || '';
const supabaseServicekey =  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if( !supabaseUrl || !supabaseServicekey) {
    console.warn('[Supabase] Warning: supabase url service key is missing in environment variables.');
}

export const supabase =  createClient(supabaseUrl,supabaseServicekey);