import { supabase } from '@/integrations/supabase/client';

export const uploadFile = async (
  file: File,
  bucket: 'product-images' | 'product-catalogs',
  fileName?: string
): Promise<string> => {
  try {
    // Generate a unique filename if not provided
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    console.log(`Uploading file to ${bucket}:`, uniqueFileName);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error details:', {
        message: error.message,
        error: error,
        bucket: bucket,
        fileName: uniqueFileName
      });
      
      // Provide more specific error messages
      if (error.message?.includes('Bucket not found') || error.message?.includes('bucket does not exist')) {
        throw new Error(`Storage bucket "${bucket}" does not exist. Please create it in your Supabase dashboard.`);
      } else if (error.message?.includes('Invalid') || error.message?.includes('400')) {
        throw new Error(`Invalid request: ${error.message}. Check if the storage bucket "${bucket}" exists and is properly configured.`);
      } else if (error.message?.includes('File size')) {
        throw new Error('File size exceeds the maximum allowed limit.');
      } else {
        throw new Error(`Upload failed: ${error.message}`);
      }
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log('File uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (
  url: string,
  bucket: 'product-images' | 'product-catalogs'
): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    console.log(`Deleting file from ${bucket}:`, fileName);
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const validateFile = (
  file: File,
  type: 'image' | 'pdf',
  maxSizeMB: number = 10
): string | null => {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  // Check file type
  if (type === 'image') {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedImageTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }
  } else if (type === 'pdf') {
    if (file.type !== 'application/pdf') {
      return 'Please upload a valid PDF file';
    }
  }

  return null; // Valid file
};
