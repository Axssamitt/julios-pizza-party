
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tsztjcrhlsurtfeqvinb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzenRqY3JobHN1cnRmZXF2aW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjM1NjIsImV4cCI6MjA2NDUzOTU2Mn0.JX3d2id-gBtFjlpNxQwejxSDaKjjdBC5zKNQR1VQAj8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
