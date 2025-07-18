
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
  Package
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
  const [globalPdfFile, setGlobalPdfFile] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "Welcome!",
        description: "Successfully logged in to admin panel",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    toast({
      title: "Logged Out",
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
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    },
    onError: (error: any) => {
      console.error('Add product error:', error);
      toast({
        title: "Error",
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
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Update product error:', error);
      toast({
        title: "Error",
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
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete product error:', error);
      toast({
        title: "Error",
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
        title: "Success",
        description: "Contact deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Delete contact error:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  });

  // Global PDF mutation
  const updateGlobalPdfMutation = useMutation({
    mutationFn: async (pdfUrl: string) => {
      console.log('Updating global PDF:', pdfUrl);
      
      // First try to update existing record
      const { data, error } = await supabase
        .from('settings')
        .update({
          value: pdfUrl,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'global_pdf')
        .select();
      
      if (error) {
        console.error('Error updating global PDF:', error);
        throw error;
      }
      
      // If no rows were updated, insert a new record
      if (!data || data.length === 0) {
        const { data: insertData, error: insertError } = await supabase
          .from('settings')
          .insert([{
            key: 'global_pdf',
            value: pdfUrl
          }])
          .select();
        
        if (insertError) {
          console.error('Error inserting global PDF:', insertError);
          throw insertError;
        }
        
        console.log('Global PDF inserted successfully:', insertData);
        return insertData;
      }
      
      console.log('Global PDF updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalPdf'] });
      setGlobalPdfFile('');
      toast({
        title: "Success",
        description: "Global PDF updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Global PDF update error:', error);
      toast({
        title: "Error",
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

  const handleAddProduct = () => {
    addProductMutation.mutate(productForm);
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

  const handleUpdateProduct = () => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, product: productForm });
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: '', description: '', image: '', brochure: '' });
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContactMutation.mutate(id);
    }
  };

  const handleUpdateGlobalPdf = () => {
    if (globalPdfFile) {
      updateGlobalPdfMutation.mutate(globalPdfFile);
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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Admin Panel</CardTitle>
              <p className="text-muted-foreground">Enter your credentials to access</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Username</label>
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  placeholder="Enter username"
                  required
                  className="h-12 border-2 focus:border-red-500 transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    placeholder="Enter password"
                    required
                    className="h-12 border-2 focus:border-red-500 transition-colors duration-200 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage products, contacts, and settings</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] h-12">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-semibold text-foreground">Products Management</h2>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Add/Edit Product Form */}
            {showAddForm && (
              <Card className="border-2 border-red-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Product Name *</label>
                      <Input
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        placeholder="Enter product name"
                        className="border-2 focus:border-red-500 transition-colors duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Category *</label>
                      <Input
                        name="category"
                        value={productForm.category}
                        onChange={handleProductFormChange}
                        placeholder="Enter category"
                        className="border-2 focus:border-red-500 transition-colors duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <Textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      placeholder="Enter product description"
                      rows={3}
                      className="border-2 focus:border-red-500 transition-colors duration-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Image URL</label>
                      <Input
                        name="image"
                        value={productForm.image}
                        onChange={handleProductFormChange}
                        placeholder="Enter image URL"
                        className="border-2 focus:border-red-500 transition-colors duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Brochure URL</label>
                      <Input
                        name="brochure"
                        value={productForm.brochure}
                        onChange={handleProductFormChange}
                        placeholder="Enter brochure URL"
                        className="border-2 focus:border-red-500 transition-colors duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                    <Button 
                      onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                      disabled={addProductMutation.isPending || updateProductMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                    <Button 
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {productsLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                products.map((product) => (
                  <Card key={product.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
                    <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                      <img 
                        src={product.image || '/api/placeholder/300/300'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <Badge className="bg-red-100 text-red-800 text-xs mb-2">
                            {product.category}
                          </Badge>
                          <h3 className="font-bold text-foreground text-sm mb-1 truncate">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground text-xs line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                        {(product.brochure || globalPdfSetting?.value) && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full text-xs hover:bg-green-50 hover:border-green-300"
                            onClick={() => downloadPdf(product.brochure || globalPdfSetting?.value || '', `${product.name}-brochure.pdf`)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Download PDF</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Contact Submissions</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {contactsLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading contacts...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No contact submissions found</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <Card key={contact.id} className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center text-foreground">
                              <User className="w-4 h-4 mr-2 text-red-600" />
                              <span className="font-semibold">{contact.name}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Mail className="w-4 h-4 mr-2 text-red-600" />
                              <span>{contact.email}</span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center text-muted-foreground">
                                <Phone className="w-4 h-4 mr-2 text-red-600" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                            {contact.company && (
                              <div className="flex items-center text-muted-foreground">
                                <Building className="w-4 h-4 mr-2 text-red-600" />
                                <span>{contact.company}</span>
                              </div>
                            )}
                          </div>
                          
                          {contact.message && (
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="w-4 h-4 mt-1 text-red-600 flex-shrink-0" />
                              <p className="text-muted-foreground">{contact.message}</p>
                            </div>
                          )}
                          
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(contact.created_at).toLocaleString()}
                          </p>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
            
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <FileText className="w-5 h-5 mr-2 text-red-600" />
                  Global PDF Brochure
                </CardTitle>
                <p className="text-muted-foreground">
                  Set a default PDF brochure that will be used for products without individual brochures
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">PDF URL</label>
                  <Input
                    type="url"
                    value={globalPdfFile}
                    onChange={(e) => setGlobalPdfFile(e.target.value)}
                    placeholder="Enter global PDF brochure URL"
                    className="border-2 focus:border-red-500 transition-colors duration-200"
                  />
                </div>
                
                {globalPdfSetting?.value && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-foreground font-medium mb-2">Current Global PDF:</p>
                    <p className="text-sm text-muted-foreground break-all mb-3">{globalPdfSetting.value}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadPdf(globalPdfSetting.value, 'global-brochure.pdf')}
                      className="hover:bg-green-50 hover:border-green-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Current PDF
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={handleUpdateGlobalPdf}
                  disabled={!globalPdfFile || updateGlobalPdfMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Update Global PDF
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
