-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('product-brochures', 'product-brochures', true);

-- Set up storage policies for product-images bucket
CREATE POLICY "Anyone can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');

-- Set up storage policies for product-brochures bucket
CREATE POLICY "Anyone can view product brochures" ON storage.objects
FOR SELECT USING (bucket_id = 'product-brochures');

CREATE POLICY "Authenticated users can upload product brochures" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-brochures');

CREATE POLICY "Authenticated users can update product brochures" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-brochures');

CREATE POLICY "Authenticated users can delete product brochures" ON storage.objects
FOR DELETE USING (bucket_id = 'product-brochures');
