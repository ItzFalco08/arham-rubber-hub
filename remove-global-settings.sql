-- SQL Commands to Remove Global Settings from Database
-- Run these commands in your Supabase SQL Editor

-- 1. Drop the settings table (if it exists)
DROP TABLE IF EXISTS public.settings;

-- 2. Remove global_pdf column from products table (if it exists)
ALTER TABLE public.products DROP COLUMN IF EXISTS global_pdf;

-- 3. Verify the final products table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Expected columns after cleanup:
-- id (uuid)
-- name (text)  
-- category (text)
-- description (text, nullable)
-- image (text, nullable)
-- brochure (text, nullable)
-- created_at (timestamp)
-- updated_at (timestamp)
