import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://lhnrwyxniyzjobszhdbu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnJ3eXhuaXl6am9ic3poZGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODAwNDIsImV4cCI6MjA3ODk1NjA0Mn0.wrv6dCptKiUq_9ew6vYAwIILvvHJlvfIgidC12SnRrY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
