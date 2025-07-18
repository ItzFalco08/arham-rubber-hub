
-- Create contacts table for storing contact form submissions
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact form data
CREATE POLICY "Anyone can submit contact forms" 
  ON public.contacts 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Create policy to allow authenticated users (admins) to view contact submissions
CREATE POLICY "Authenticated users can view contacts" 
  ON public.contacts 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete contact submissions
CREATE POLICY "Authenticated users can delete contacts" 
  ON public.contacts 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Add a global_pdf column to products table for shared PDF functionality
ALTER TABLE public.products ADD COLUMN global_pdf TEXT;

-- Create a settings table for global configurations like shared PDF
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings
CREATE POLICY "Authenticated users can manage settings" 
  ON public.settings 
  FOR ALL 
  TO authenticated
  USING (true);

-- Insert default global PDF setting
INSERT INTO public.settings (key, value) VALUES ('global_pdf', null);
