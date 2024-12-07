require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true
  }
});

module.exports = supabase;