-- Add measurements column to product_information for size charts
-- Run this migration in Supabase SQL editor after schema.sql

ALTER TABLE product_information 
ADD COLUMN IF NOT EXISTS measurements jsonb;

-- measurements structure:
-- {
--   "enabled": true,
--   "unit": "cm",  // or "inches"
--   "sizes": [
--     {
--       "size": "XS",
--       "chest": "30-32",
--       "waist": "24-26",
--       "hip": "32-34"
--     }
--   ]
-- }
