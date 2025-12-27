
import { createClient } from '@supabase/supabase-js';

// Configuration for Khaas Re Live Supabase Project
const SUPABASE_URL = 'https://ucrczfmidwxmtdsdmlzn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcmN6Zm1pZHd4bXRkc2RtbHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MjE0NjMsImV4cCI6MjA4MjM5NzQ2M30.OAt_HpS7vLPYp0i9Uva6KBcF9coyvm0nEDfNtn15PEw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
