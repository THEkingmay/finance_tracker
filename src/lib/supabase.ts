import { createClient } from '@supabase/supabase-js'

// ดึงค่าจาก environment variables
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

// สร้าง client
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase