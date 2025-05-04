-- Create a public bucket for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profileimages', 'profileimages', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to upload to the profileimages bucket (for testing)
-- You can restrict this later with proper policies
CREATE POLICY "Allow public uploads to profileimages" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profileimages');

-- Allow authenticated users to update objects in profileimages
CREATE POLICY "Allow authenticated updates to profileimages" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'profileimages');

-- Allow public reads from profileimages
CREATE POLICY "Allow public reads from profileimages" ON storage.objects
  FOR SELECT USING (bucket_id = 'profileimages');

-- Allow authenticated users to delete objects in profileimages
CREATE POLICY "Allow authenticated deletes from profileimages" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'profileimages'); 