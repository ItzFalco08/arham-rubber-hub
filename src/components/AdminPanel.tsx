
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Download, Eye, EyeOff, FileText, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  brochure?: string;
  global_pdf?: string;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  created_at: string;
}

interface Settings {
  id: string;
  key: string;
  value?: string;
  created_at: string;
  updated_at: string;
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGlobalPdfDialogOpen, setIsGlobalPdfDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    brochure: ''
  });
  const [globalPdfFile, setGlobalPdfFile] = useState<string>('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products from Supabase
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched:', data);
      return data as Product[];
    },
    enabled: isAuthenticated,
  });

  // Fetch contacts from Supabase
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      console.log('Fetching contacts from Supabase...');
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }
      
      console.log('Contacts fetched:', data);
      return data as Contact[];
    },
    enabled: isAuthenticated,
  });

  // Fetch global PDF setting
  const { data: globalPdfSetting } = useQuery({
    queryKey: ['global-pdf'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'global_pdf')
        .single();
      
      if (error) {
        console.error('Error fetching global PDF setting:', error);
        return null;
      }
      
      return data as Settings;
    },
    enabled: isAuthenticated,
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'global_pdf'>) => {
      console.log('Adding product:', product);
      
      // Validate required fields
      if (!product.name?.trim()) {
        throw new Error('Product name is required');
      }
      if (!product.category?.trim()) {
        throw new Error('Category is required');
      }
      if (!product.description?.trim()) {
        throw new Error('Description is required');
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name.trim(),
          description: product.description.trim(),
          category: product.category.trim(),
          image: product.image?.trim() || '/api/placeholder/250/200',
          brochure: product.brochure?.trim() || null
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
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      setNewProduct({ name: '', description: '', category: '', image: '', brochure: '' });
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      console.log('Updating product:', product);
      
      // Validate required fields
      if (!product.name?.trim()) {
        throw new Error('Product name is required');
      }
      if (!product.category?.trim()) {
        throw new Error('Category is required');
      }
      if (!product.description?.trim()) {
        throw new Error('Description is required');
      }

      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name.trim(),
          description: product.description.trim(),
          category: product.category.trim(),
          image: product.image?.trim() || '/api/placeholder/250/200',
          brochure: product.brochure?.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)
        .select();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      console.log('Product updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setEditingProduct(null);
    },
    onError: (error: Error) => {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting product with id:', id);
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
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contact with id:', id);
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
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    },
  });

  // Update global PDF mutation
  const updateGlobalPdfMutation = useMutation({
    mutationFn: async (pdfUrl: string) => {
      console.log('Updating global PDF:', pdfUrl);
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
      console.log('Global PDF updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-pdf'] });
      toast({
        title: "Success",
        description: "Global PDF updated successfully",
      });
      setGlobalPdfFile('');
      setIsGlobalPdfDialogOpen(false);
    },
    onError: (error: Error) => {
      console.error('Error updating global PDF:', error);
      toast({
        title: "Error",
        description: "Failed to update global PDF",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'password') {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = () => {
    console.log('Submitting new product:', newProduct);
    addProductMutation.mutate(newProduct);
  };

  const handleEditProduct = (product: Product) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    console.log('Submitting updated product:', editingProduct);
    updateProductMutation.mutate(editingProduct);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'new' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (type === 'new') {
          setNewProduct({ ...newProduct, image: imageUrl });
        } else if (editingProduct) {
          setEditingProduct({ ...editingProduct, image: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'new' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        if (type === 'new') {
          setNewProduct({ ...newProduct, brochure: fileUrl });
        } else if (editingProduct) {
          setEditingProduct({ ...editingProduct, brochure: fileUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGlobalPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        setGlobalPdfFile(fileUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateGlobalPdf = () => {
    if (globalPdfFile) {
      updateGlobalPdfMutation.mutate(globalPdfFile);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-gray-900">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                Login
              </Button>
            </form>
            <p className="text-sm text-gray-600 text-center mt-4">
              Demo credentials: admin / password
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                AR
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ARHAM RUBBER</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => window.location.href = '/'} variant="outline" size="sm">
                View Website
              </Button>
              <Button onClick={() => setIsAuthenticated(false)} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-gray-900">Products ({products.length})</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to add a new product to your catalog.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="productName">Product Name *</Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="productCategory">Category *</Label>
                      <Input
                        id="productCategory"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        placeholder="Enter category"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="productDescription">Description *</Label>
                      <Textarea
                        id="productDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Enter product description"
                        required
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productImage">Product Image</Label>
                      <Input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'new')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productBrochure">Brochure PDF</Label>
                      <Input
                        id="productBrochure"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleBrochureUpload(e, 'new')}
                      />
                    </div>
                    <Button 
                      onClick={handleAddProduct} 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      disabled={addProductMutation.isPending}
                    >
                      {addProductMutation.isPending ? 'Adding Product...' : 'Add Product'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {productsLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image || '/api/placeholder/250/200'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Badge className="mb-2 bg-red-100 text-red-800">{product.category}</Badge>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 min-w-0"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 flex-1 min-w-0"
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                        {(product.brochure || globalPdfSetting?.value) && (
                          <Button size="sm" variant="outline" className="flex-1 min-w-0">
                            <Download className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">PDF</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Submissions ({contacts.length})</h2>
            </div>

            {contactsLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading contacts...</p>
              </div>
            ) : contacts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No contact submissions yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead className="hidden md:table-cell">Company</TableHead>
                      <TableHead className="hidden lg:table-cell">Message</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">{contact.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{contact.phone || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell">{contact.company || '-'}</TableCell>
                        <TableCell className="hidden lg:table-cell max-w-xs truncate">{contact.message || '-'}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={deleteContactMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Global PDF Brochure</CardTitle>
                  <p className="text-sm text-gray-600">
                    Upload a PDF that will be available for download on all products
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {globalPdfSetting?.value && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">Global PDF is currently set</p>
                    </div>
                  )}
                  <Dialog open={isGlobalPdfDialogOpen} onOpenChange={setIsGlobalPdfDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        {globalPdfSetting?.value ? 'Update Global PDF' : 'Upload Global PDF'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Global PDF Brochure</DialogTitle>
                        <DialogDescription>
                          This PDF will be available for download on all products
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="globalPdf">Select PDF File</Label>
                          <Input
                            id="globalPdf"
                            type="file"
                            accept=".pdf"
                            onChange={handleGlobalPdfUpload}
                          />
                        </div>
                        <Button 
                          onClick={handleUpdateGlobalPdf} 
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          disabled={updateGlobalPdfMutation.isPending || !globalPdfFile}
                        >
                          {updateGlobalPdfMutation.isPending ? 'Uploading...' : 'Update Global PDF'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editProductName">Product Name *</Label>
                <Input
                  id="editProductName"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editProductCategory">Category *</Label>
                <Input
                  id="editProductCategory"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editProductDescription">Description *</Label>
                <Textarea
                  id="editProductDescription"
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="editProductImage">Product Image</Label>
                <Input
                  id="editProductImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'edit')}
                />
              </div>
              <div>
                <Label htmlFor="editProductBrochure">Brochure PDF</Label>
                <Input
                  id="editProductBrochure"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleBrochureUpload(e, 'edit')}
                />
              </div>
              <Button 
                onClick={handleUpdateProduct} 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending ? 'Updating Product...' : 'Update Product'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPanel;
