
-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image TEXT,
  brochure TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to products
CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  TO public
  USING (true);

-- Create policy to allow authenticated users to insert products
CREATE POLICY "Authenticated users can create products" 
  ON public.products 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update products
CREATE POLICY "Authenticated users can update products" 
  ON public.products 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete products
CREATE POLICY "Authenticated users can delete products" 
  ON public.products 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO public.products (name, description, category, image) VALUES
('Pvc Heavy Duty Water Hose', 'Durable and flexible hose pipe for industrial and agricultural applications.', 'Water Hose', '/api/placeholder/250/200'),
('Rubber Hydraulic Hose', 'Reinforced rubber hose designed for high-pressure hydraulic systems.', 'Hydraulic Hose', '/api/placeholder/250/200'),
('Industrial Rubber Sheets', 'High-quality rubber sheets used for gaskets, sealing, and industrial applications.', 'Rubber Sheets', '/api/placeholder/250/200'),
('Electrical Insulating Mats As Per IS 15652 : 2006', 'Safety mats compliant with IS standards, providing electrical insulation for high-voltage areas.', 'Safety Mats', '/api/placeholder/250/200'),
('Rubber Anti Slip Mat', 'Textured anti-slip surface that provides excellent grip in wet and dry conditions.', 'Safety Mats', '/api/placeholder/250/200'),
('Rubber Water Discharge Hose', 'Flexible hose for water discharge applications, excellent for dewatering tasks.', 'Water Hose', '/api/placeholder/250/200');
