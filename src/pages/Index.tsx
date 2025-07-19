import React, { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Facebook, Twitter, Instagram, Download, Eye, Star, Users, Globe, Award, TrendingUp, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import WhyArham from '@/components/WhyArham';
import Header from '@/components/Header';
import About from '@/components/About';
import Hero from '@/components/Hero';
import { useProducts } from '@/context/ProductsContext';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setProducts } = useProducts();
  

  // Fetch products from Supabase
  const { data: products = [], isLoading, error } = useQuery({
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
      return data;
    },
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
        console.error('Error fetching global PDF:', error);
        return null;
      }
      
      return data;
    },
  });

  // Set products in context when data is fetched
  useEffect(() => {
    if (products) {
      setProducts(products);
    }
  }, [products, setProducts]);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Products to display (with load more functionality)
  const displayedProducts = filteredProducts.slice(0, visibleProducts);
  const hasMoreProducts = filteredProducts.length > visibleProducts;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setVisibleProducts(6); // Reset visible products on search
    
    setTimeout(() => {
      setIsSearching(false);
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const handleLoadMore = () => {
    navigate('/products');
  };

  const handleDownloadBrochure = (product: any) => {
    const pdfUrl = product.brochure || globalPdfSetting?.value;
    if (pdfUrl) {
      console.log(`Downloading brochure for ${product.name}`);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${product.name}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `${product.name} brochure download started`,
      });
    } else {
      toast({
        title: "No Brochure Available",
        description: "This product doesn't have a brochure available",
        variant: "destructive",
      });
    }
  };


  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <X className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-red-600">Oops! Something went wrong</h2>
            <p className="text-slate-600 leading-relaxed">We're having trouble loading the products. Please check your connection and try again.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Enhanced Modern Header */}
      <Header isHidden={true} />

      {/* Enhanced Hero Section with Modern Design */}
      <Hero isSearching={isSearching} handleSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Enhanced About Us Section */}
      <About/>

      {/* Enhanced Products Section with Load More */}
      <section id="products" className="py-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-[64px] font-medium text-[#020202] mb-8 tracking-tight">
                  {searchTerm ? `Search Results for "${searchTerm}"` : "Best Selling Products"}
              </h2>
              {/* <div className="w-24 h-2 bg-gradient-to-r from-red-600 to-red-700 rounded-full mx-auto mb-8"></div> */}
              <p className="text-lg text-[#3C3A3D] max-w-xl mx-auto leading-relaxed">
                  {searchTerm
                      ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`
                      : '"Reliable Rubber Solutions for Every Industry—Engineered to Perform, Built to Last!"'}
              </p>
          </div>

          <div className='w-full relative items-center flex flex-col'>
          {isLoading ? (
              <div className="text-center py-24">
                  <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto"></div>
              </div>
          ) : filteredProducts.length === 0 && searchTerm ? (
              <div className="text-center py-24">
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-xl">
                      <Search className="w-16 h-16 text-slate-400" />
                  </div>
                  <h3 className="text-4xl font-bold text-slate-700 mb-6">No products found</h3>
                  <p className="text-slate-500 mb-10 max-w-lg mx-auto text-xl leading-relaxed">Try adjusting your search terms or browse all products below.</p>
                  <Button
                      onClick={() => setSearchTerm("")}
                      variant="outline"
                      size="lg"
                      className="hover:bg-red-50 hover:border-red-300 px-8 py-4 text-lg font-semibold rounded-xl border-2 transform hover:scale-105 transition-all duration-200">
                      Clear Search
                  </Button>
              </div>
          ) : (
            <>
              <div className="grid mx-0 w-fit grid-cols-1 lg:grid-cols-2 gap-8">
                  {displayedProducts.map((product) => (
                      <Card
                          key={product.id}
                          className="bg-white w-fit lg:w-full min-h-[400px] border-none rounded-lg  transition-all duration-300 overflow-hidden">

                          <div className="flex flex-col md:flex-row h-full">
                              {/* Content Section */}
                              <CardContent className="w-full max-w-[26rem] lg:w-[60%] p-6 md:p-8 flex flex-col justify-between">
                                  <div className="mb-6">
                                      <h3 
                                          className="leading-tight mb-4 font-medium text-[#020202]" 
                                          style={{fontSize: 'clamp(20px, 3vw, 36px)'}}
                                      >
                                          {product.name}
                                      </h3>
                                      <p 
                                          className="text-[#3C3A3D] font-regular line-clamp-4 leading-relaxed" 
                                          style={{fontSize: 'clamp(14px, 1.5vw, 16px)'}}
                                      >
                                          {product.description}
                                      </p>
                                  </div>

                                  <div className="flex flex-col gap-3">
                                      <Button
                                          variant="outline"
                                          onClick={() => navigate('/contact')}
                                          className=" w-fit h-12 border-[#CB4954] hover:bg-transparent text-[#020202]  rounded-lg border font-semibold text-sm md:text-base"
                                      >
                                          See More Details
                                      </Button>
                                      <Button 
                                          onClick={() => handleDownloadBrochure(product)}
                                          className="w-fit h-12 bg-[#CB4954] hover:bg-[#963840] transition-none rounded-lg font-semibold text-sm md:text-base"
                                      >
                                          <Download className="w-4 h-4 mr-2" />
                                          Download Catalogue
                                      </Button>
                                  </div>
                              </CardContent>

                              {/* Image Section */}
                              <div className=" w-full md:max-w-[40%] h-full flex items-center justify-center px-12 pb-4 md:p-0">
                                  <img
                                      src={product.image || '/images/dummy.png'}
                                      alt={product.name}
                                      className="w-full h-fit max-w-[262px] max-h-[262px] object-cover rounded-lg"
                                  />
                              </div>
                          </div>
                      </Card>
                  ))}
              </div>

              {/* View All Products Button */}
              {hasMoreProducts && (
                  <div className="text-center mt-16">
                      <Button
                          onClick={handleLoadMore}
                          size="sm"
                          className="bg-[#CB4954] text-white text-lg font-medium transition-none hover:bg-[#963840] ">
                          View All Products
                          <ArrowRight className="w-6 h-6 ml-3" />
                      </Button>
                      <p className="text-slate-500 mt-4 text-lg">
                          Showing {displayedProducts.length} of {filteredProducts.length} products
                      </p>
                  </div>
              )}

              {!hasMoreProducts && filteredProducts.length > 6 && (
                  <div className="text-center mt-16">
                      <p className="text-slate-600 text-xl font-semibold">🎉 You've seen all {filteredProducts.length} products!</p>
                  </div>
              )}
            </>
          )}
          </div>

        </div>
      </section>

      <WhyArham/>

      <Contact/>
      {/* Enhanced Footer */}
      <Footer/>
    </div>
  );
};

export default Index;
