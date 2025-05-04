-- Add profile_image_url column to users table (nullable)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Create RLS policy for profile_images bucket

-- First, create the bucket if it doesn't exist
-- Run this in Supabase Dashboard or via API:
-- CREATE BUCKET profile_images;

-- Then set up the following policies in Supabase Dashboard:

-- 1. Policy for reading profile images (everyone can read)
/*
CREATE POLICY "Public Access for Profile Images" 
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile_images');
*/

-- 2. Policy for inserting profile images (authenticated users can upload their own)
/*
CREATE POLICY "Users can upload their own profile images"
ON storage.objects
FOR INSERT
WITH CHECK (
  auth.uid() = SPLIT_PART(name, '-', 1)::uuid
  AND bucket_id = 'profile_images'
);
*/

-- 3. Policy for updating profile images (authenticated users can update their own)
/*
CREATE POLICY "Users can update their own profile images"
ON storage.objects
FOR UPDATE 
USING (
  auth.uid() = SPLIT_PART(name, '-', 1)::uuid
  AND bucket_id = 'profile_images'
)
WITH CHECK (
  auth.uid() = SPLIT_PART(name, '-', 1)::uuid
  AND bucket_id = 'profile_images'
);
*/

-- 4. Policy for deleting profile images (authenticated users can delete their own)
/*
CREATE POLICY "Users can delete their own profile images"
ON storage.objects
FOR DELETE
USING (
  auth.uid() = SPLIT_PART(name, '-', 1)::uuid
  AND bucket_id = 'profile_images'
);
*/

-- Instructions for Supabase dashboard:
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a new bucket named 'profile_images'
-- 3. Set it to public (for easy access to images)
-- 4. Add the RLS policies above through the dashboard interface
-- 5. Make sure you have the correct column added to the users table 