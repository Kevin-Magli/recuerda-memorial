import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://sevlixbnmabtnxsfkand.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldmxpeGJubWFidG54c2ZrYW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzcxNzEsImV4cCI6MjA4NzQ1MzE3MX0.KvixcpSdYurLYFOs14NvJ_jW6_5xKQ7qbS9N2_JoGio";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)