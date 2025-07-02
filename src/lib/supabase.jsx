import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bsuhsjlhtgzjkmdtelez.supabase.co";
// const supabaseKey = process.env.SUPABASE_KEY;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY; // GANTI INI

export const supabase = createClient(supabaseUrl, supabaseKey);
