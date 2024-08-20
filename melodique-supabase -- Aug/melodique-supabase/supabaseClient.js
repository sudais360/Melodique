import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pmnopubejtazgfgswker.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtbm9wdWJlanRhemdmZ3N3a2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MTg2NjUsImV4cCI6MjAzNjA5NDY2NX0.9_06MaY899_ZZHmh4D5_7eg_auIZH7ZX59uUs3GH_8g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
