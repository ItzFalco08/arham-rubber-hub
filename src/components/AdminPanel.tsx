import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { uploadFile, deleteFile, validateFile } from '@/lib/fileUpload';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Building, 
  Phone, 
  MessageSquare,
  FileText,
  Settings,
  Users,
  Package,
  Shield,
  LogOut,
  UserCheck,
  Image,
  FileUp
} from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    brochure: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [globalPdfFile, setGlobalPdfFile] = useState('');
  const [globalPdfUpload, setGlobalPdfUpload] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "Welcome Back! 🎉",
        description: "Successfully logged in to admin panel",
      });
    } else {
      toast({
        title: "Access Denied ❌",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setShowCredentials(false);
    toast({
      title: "Logged Out 👋",
      description: "Successfully logged out from admin panel",
    });
  };

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      console.log('Fetching products for admin...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Admin products fetched:', data);
      return data;
    },
    enabled: isAuthenticated,
  });

  // Fetch contacts
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      console.log('Fetching contacts for admin...');
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }
      
      console.log('Admin contacts fetched:', data);
      return data;
    },
    enabled: isAuthenticated,
  });

  // Fetch global PDF setting
  const { data: globalPdfSetting } = useQuery({
    queryKey: ['globalPdf'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'global_pdf')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching global PDF setting:', error);
        return null;
      }
      
      return data;
    },
    enabled: isAuthenticated,
  });

  // Product mutations
  const addProductMutation = useMutation({
    mutationFn: async (product: typeof productForm) => {
      console.log('Adding product:', product);
      
      if (!product.name.trim() || !product.category.trim()) {
        throw new Error('Name and category are required');
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name.trim(),
          category: product.category.trim(),
          description: product.description.trim() || null,
          image: product.image.trim() || null,
          brochure: product.brochure.trim() || null
        }])
        .select();
      
      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }
      
      console.log('Product added successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setProductForm({ name: '', category: '', description: '', image: '', brochure: '' });
      setImageFile(null);
      setBrochureFile(null);
      setShowAddForm(false);
      toast({
        title: "Success! ✅",
        description: "Product added successfully",
      });
    },
    onError: (error: any) => {
      console.error('Add product error:', error);
      toast({
        title: "Error ❌",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product }: { id: string, product: typeof productForm }) => {
      console.log('Updating product:', id, product);
      
      if (!product.name.trim() || !product.category.trim()) {
        throw new Error('Name and category are required');
      }

      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name.trim(),
          category: product.category.trim(),
          description: product.description.trim() || null,
          image: product.image.trim() || null,
          brochure: product.brochure.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      console.log('Product updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      setProductForm({ name: '', category: '', description: '', image: '', brochure: '' });
      setImageFile(null);
      setBrochureFile(null);
      toast({
        title: "Success! ✅",
        description: "Product updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Update product error:', error);
      toast({
        title: "Error ❌",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting product:', id);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      console.log('Product deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success! ✅",
        description: "Product deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete product error:', error);
      toast({
        title: "Error ❌",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  });

  // Contact mutations
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contact:', id);
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting contact:', error);
        throw error;
      }
      
      console.log('Contact deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast({
        title: "Success! ✅",
        description: "Contact deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete contact error:', error);
      toast({
        title: "Error ❌",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  });

  // Global PDF mutation
  const updateGlobalPdfMutation = useMutation({
    mutationFn: async (pdfUrl: string) => {
      console.log('Updating global PDF:', pdfUrl);
      
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          key: 'global_pdf',
          value: pdfUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })
        .select();
      
      if (error) {
        console.error('Error updating global PDF:', error);
        throw error;
      }
      
      console.log('Global PDF updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalPdf'] });
      setGlobalPdfFile('');
      toast({
        title: "Success! ✅",
        description: "Global PDF updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Global PDF update error:', error);
      toast({
        title: "Error ❌",
        description: "Failed to update global PDF",
        variant: "destructive",
      });
    }
  });

  // Form handlers
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // File upload handlers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file, 'image', 5); // 5MB limit for images
      if (error) {
        toast({
          title: "Invalid Image File",
          description: error,
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
    }
  };

  const handleBrochureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file, 'pdf', 10); // 10MB limit for PDFs
      if (error) {
        toast({
          title: "Invalid PDF File",
          description: error,
          variant: "destructive",
        });
        return;
      }
      setBrochureFile(file);
    }
  };

  const handleGlobalPdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file, 'pdf', 10); // 10MB limit for PDFs
      if (error) {
        toast({
          title: "Invalid PDF File",
          description: error,
          variant: "destructive",
        });
        return;
      }
      setGlobalPdfUpload(file);
    }
  };

  const handleAddProduct = async () => {
    try {
      let imageUrl = productForm.image;
      let brochureUrl = productForm.brochure;

      // Upload image if file is selected
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadFile(imageFile, 'product-images');
      }

      // Upload brochure if file is selected
      if (brochureFile) {
        setUploadingBrochure(true);
        brochureUrl = await uploadFile(brochureFile, 'product-brochures');
      }

      // Update the product form with uploaded URLs
      const productData = {
        ...productForm,
        image: imageUrl,
        brochure: brochureUrl
      };

      addProductMutation.mutate(productData);
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      setUploadingBrochure(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description || '',
      image: product.image || '',
      brochure: product.brochure || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      let imageUrl = productForm.image;
      let brochureUrl = productForm.brochure;

      // Upload new image if file is selected
      if (imageFile) {
        setUploadingImage(true);
        // Delete old image if exists
        if (editingProduct.image) {
          try {
            await deleteFile(editingProduct.image, 'product-images');
          } catch (deleteError) {
            console.warn('Could not delete old image:', deleteError);
          }
        }
        imageUrl = await uploadFile(imageFile, 'product-images');
      }

      // Upload new brochure if file is selected
      if (brochureFile) {
        setUploadingBrochure(true);
        // Delete old brochure if exists
        if (editingProduct.brochure) {
          try {
            await deleteFile(editingProduct.brochure, 'product-brochures');
          } catch (deleteError) {
            console.warn('Could not delete old brochure:', deleteError);
          }
        }
        brochureUrl = await uploadFile(brochureFile, 'product-brochures');
      }

      // Update the product form with uploaded URLs
      const productData = {
        ...productForm,
        image: imageUrl,
        brochure: brochureUrl
      };

      updateProductMutation.mutate({ id: editingProduct.id, product: productData });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      setUploadingBrochure(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: '', description: '', image: '', brochure: '' });
    setImageFile(null);
    setBrochureFile(null);
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      deleteContactMutation.mutate(id);
    }
  };

  const handleUpdateGlobalPdf = async () => {
    try {
      let pdfUrl = globalPdfFile;

      // Upload file if selected
      if (globalPdfUpload) {
        pdfUrl = await uploadFile(globalPdfUpload, 'product-brochures');
      }

      if (pdfUrl) {
        updateGlobalPdfMutation.mutate(pdfUrl);
        setGlobalPdfUpload(null);
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadPdf = (pdfUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-3xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-transform duration-200">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Admin Panel
              </CardTitle>
              <p className="text-slate-500 text-lg mt-2">Secure access required</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Credentials Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                  Default Credentials
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {showCredentials ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {showCredentials && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border">
                    <span className="text-slate-600 font-medium">Username:</span>
                    <code className="bg-slate-100 px-3 py-1 rounded-lg font-mono text-slate-800">admin</code>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border">
                    <span className="text-slate-600 font-medium">Password:</span>
                    <code className="bg-slate-100 px-3 py-1 rounded-lg font-mono text-slate-800">admin123</code>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Username
                </label>
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  placeholder="Enter username"
                  required
                  className="h-14 border-2 focus:border-red-500 transition-all duration-200 rounded-xl text-lg bg-white/70"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    placeholder="Enter password"
                    required
                    className="h-14 border-2 focus:border-red-500 transition-all duration-200 pr-14 rounded-xl text-lg bg-white/70"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-slate-100 rounded-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl transform hover:scale-105"
              >
                <Shield className="w-5 h-5 mr-3" />
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-6 sm:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 text-lg">Manage products, contacts, and global settings</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 px-6 py-3 text-lg font-semibold rounded-xl border-2 transform hover:scale-105 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[500px] h-16 bg-white shadow-lg rounded-2xl border-2">
            <TabsTrigger value="products" className="flex items-center space-x-3 text-lg font-semibold h-12 rounded-xl">
              <Package className="w-5 h-5" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center space-x-3 text-lg font-semibold h-12 rounded-xl">
              <Users className="w-5 h-5" />
              <span>Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-3 text-lg font-semibold h-12 rounded-xl">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-6 sm:space-y-0">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Products Management</h2>
                <p className="text-slate-600 text-lg mt-2">Add, edit, and manage your product catalog</p>
              </div>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-3" />
                Add New Product
              </Button>
            </div>

            {/* Enhanced Add/Edit Product Form */}
            {showAddForm && (
              <Card className="border-2 border-red-200 shadow-2xl bg-gradient-to-br from-white to-red-50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    {editingProduct ? (
                      <>
                        <Edit2 className="w-6 h-6 mr-3 text-red-600" />
                        Edit Product
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6 mr-3 text-red-600" />
                        Add New Product
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">Product Name *</label>
                      <Input
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        placeholder="Enter product name"
                        className="border-2 focus:border-red-500 transition-colors duration-200 h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">Category *</label>
                      <Input
                        name="category"
                        value={productForm.category}
                        onChange={handleProductFormChange}
                        placeholder="Enter category"
                        className="border-2 focus:border-red-500 transition-colors duration-200 h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <Textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      placeholder="Enter product description"
                      rows={4}
                      className="border-2 focus:border-red-500 transition-colors duration-200 rounded-xl resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center">
                        <Image className="w-4 h-4 mr-2" />
                        Product Image (JPEG, PNG, WebP - Max 5MB)
                      </label>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageFileChange}
                          className="border-2 focus:border-red-500 transition-colors duration-200 h-12 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                        {imageFile && (
                          <p className="text-sm text-green-600 font-medium">
                            📁 Selected: {imageFile.name}
                          </p>
                        )}
                        {productForm.image && !imageFile && (
                          <p className="text-sm text-slate-600">
                            🖼️ Current: <span className="font-mono text-xs">{productForm.image.split('/').pop()}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center">
                        <FileUp className="w-4 h-4 mr-2" />
                        Product Brochure (PDF - Max 10MB)
                      </label>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={handleBrochureFileChange}
                          className="border-2 focus:border-red-500 transition-colors duration-200 h-12 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                        {brochureFile && (
                          <p className="text-sm text-green-600 font-medium">
                            📁 Selected: {brochureFile.name}
                          </p>
                        )}
                        {productForm.brochure && !brochureFile && (
                          <p className="text-sm text-slate-600">
                            📄 Current: <span className="font-mono text-xs">{productForm.brochure.split('/').pop()}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
                    <Button 
                      onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                      disabled={addProductMutation.isPending || updateProductMutation.isPending || uploadingImage || uploadingBrochure}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-200"
                    >
                      {uploadingImage || uploadingBrochure ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        editingProduct ? 'Update Product' : 'Add Product'
                      )}
                    </Button>
                    <Button 
                      onClick={handleCancelEdit}
                      variant="outline"
                      disabled={uploadingImage || uploadingBrochure}
                      className="hover:bg-slate-50 px-8 py-3 text-lg font-semibold rounded-xl border-2"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {productsLoading ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-slate-600 text-xl">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <p className="text-slate-500 text-xl">No products found. Add your first product!</p>
                </div>
              ) : (
                products.map((product) => (
                  <Card key={product.id} className="shadow-xl hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 rounded-2xl overflow-hidden group hover:-translate-y-2">
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-2xl overflow-hidden">
                      <img 
                        src={product.image || '/api/placeholder/300/300'} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-xs mb-3 px-3 py-1 rounded-full font-semibold">
                            {product.category}
                          </Badge>
                          <h3 className="font-bold text-slate-800 text-lg mb-2 truncate">
                            {product.name}
                          </h3>
                          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-3 pt-4">
                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 text-sm hover:bg-blue-50 hover:border-blue-300 border-2 rounded-xl font-semibold"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-700 border-2 rounded-xl font-semibold"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                        {(product.brochure || globalPdfSetting?.value) && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full text-sm hover:bg-green-50 hover:border-green-300 border-2 rounded-xl font-semibold"
                            onClick={() => downloadPdf(product.brochure || globalPdfSetting?.value || '', `${product.name}-brochure.pdf`)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Enhanced Contacts Tab */}
          <TabsContent value="contacts" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Contact Submissions</h2>
              <p className="text-slate-600 text-lg mt-2">View and manage customer inquiries</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {contactsLoading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-slate-600 text-xl">Loading contacts...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <p className="text-slate-500 text-xl">No contact submissions found</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <Card key={contact.id} className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
                        <div className="flex-1 space-y-6">
                          <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center text-slate-800">
                              <User className="w-5 h-5 mr-3 text-red-600" />
                              <span className="font-bold text-lg">{contact.name}</span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <Mail className="w-5 h-5 mr-3 text-red-600" />
                              <span className="text-lg">{contact.email}</span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center text-slate-600">
                                <Phone className="w-5 h-5 mr-3 text-red-600" />
                                <span className="text-lg">{contact.phone}</span>
                              </div>
                            )}
                            {contact.company && (
                              <div className="flex items-center text-slate-600">
                                <Building className="w-5 h-5 mr-3 text-red-600" />
                                <span className="text-lg">{contact.company}</span>
                              </div>
                            )}
                          </div>
                          
                          {contact.message && (
                            <div className="flex items-start space-x-3">
                              <MessageSquare className="w-5 h-5 mt-1 text-red-600 flex-shrink-0" />
                              <p className="text-slate-600 text-lg leading-relaxed">{contact.message}</p>
                            </div>
                          )}
                          
                          <p className="text-sm text-slate-500 font-medium">
                            📅 Submitted: {new Date(contact.created_at).toLocaleString()}
                          </p>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 px-6 py-3 text-lg font-semibold rounded-xl border-2 transform hover:scale-105 transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Enhanced Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Global Settings</h2>
              <p className="text-slate-600 text-lg mt-2">Manage global configurations and preferences</p>
            </div>
            
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 text-2xl font-bold">
                  <FileText className="w-7 h-7 mr-3 text-red-600" />
                  Global PDF Brochure
                </CardTitle>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Set a default PDF brochure that will be used for products without individual brochures
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <FileUp className="w-4 h-4 mr-2" />
                    Upload Global PDF Brochure (PDF - Max 10MB)
                  </label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={handleGlobalPdfFileChange}
                      className="border-2 focus:border-red-500 transition-colors duration-200 h-14 rounded-xl text-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    {globalPdfUpload && (
                      <p className="text-sm text-green-600 font-medium">
                        📁 Selected: {globalPdfUpload.name}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-slate-500">
                    Or enter a URL directly:
                  </div>
                  <Input
                    type="url"
                    value={globalPdfFile}
                    onChange={(e) => setGlobalPdfFile(e.target.value)}
                    placeholder="Enter global PDF brochure URL"
                    className="border-2 focus:border-red-500 transition-colors duration-200 h-12 rounded-xl"
                  />
                </div>
                
                {globalPdfSetting?.value && (
                  <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border-2 border-slate-200">
                    <p className="text-sm text-slate-700 font-semibold mb-3">📄 Current Global PDF:</p>
                    <p className="text-sm text-slate-600 break-all mb-6 font-mono bg-white p-3 rounded-xl">
                      {globalPdfSetting.value}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadPdf(globalPdfSetting.value, 'global-brochure.pdf')}
                      className="hover:bg-green-50 hover:border-green-300 px-6 py-3 text-lg font-semibold rounded-xl border-2 transform hover:scale-105 transition-all duration-200"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Current PDF
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={handleUpdateGlobalPdf}
                  disabled={(!globalPdfFile && !globalPdfUpload) || updateGlobalPdfMutation.isPending}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-200"
                >
                  {updateGlobalPdfMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-3" />
                      Update Global PDF
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
