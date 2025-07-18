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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(10);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    setVisibleProducts(10); // Reset visible products on search
    
    setTimeout(() => {
      setIsSearching(false);
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 10);
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

  const handleSeeMoreDetails = () => {
    window.location.href = '/contact';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
      <header className=" w-full fixed top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between bg-white mt-4 px-4 rounded-[12px] items-center h-20">
            {/* Enhanced Logo */}
            <div className='bg-white py-[3px] px-[12px] rounded-[13px]'>
              <img src="/images/logo.png" alt="ARHAM RUBBER" width={100} height={56} />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-10">
              <a href="#products" className="text-slate-700 hover:text-red-600 transition-all duration-200 font-semibold text-lg relative group">
                Our Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#about" className="text-slate-700 hover:text-red-600 transition-all duration-200 font-semibold text-lg relative group">
                About us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-3 hover:bg-slate-100 rounded-xl"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            {/* Enhanced Contact Button */}
            <Button className="hidden md:flex bg-[#CB4954] hover:bg-[#963840] text-white px-4 py-6 text-lg font-semibold shadow-xl" onClick={() => navigate('/contact')}>
              <Phone className="w-5 h-5 mr-3" />
              Contact now
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-6 space-y-6 bg-white/95 backdrop-blur-sm">
              <a 
                href="#products" 
                className="block text-slate-700 hover:text-red-600 transition-colors font-semibold text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Products
              </a>
              <a 
                href="#about" 
                className="block text-slate-700 hover:text-red-600 transition-colors font-semibold text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </a>
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 text-lg font-semibold shadow-xl rounded-xl" onClick={() => navigate('/contact')}>
                <Phone className="w-5 h-5 mr-3" />
                Contact now
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Hero Section with Modern Design */}
      <section className="relative min-h-[95vh] bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900 flex items-center justify-center text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-blue-900/60" />
        
        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 animate-fade-in">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  High-Performance
                </span>
                <span className="block bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
                  Industrial Rubber Solutions
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl max-w-5xl mx-auto leading-relaxed text-blue-100 font-light">
                Trusted provider of rubber sheets for diversified needs of food and clean room industry where 
                in, these international standards constructed quality and innovation to power industries worldwide.
              </p>
            </div>
            
            {/* Enhanced Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row max-w-3xl mx-auto gap-4 sm:gap-0">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="sm:rounded-r-none sm:border-r-0 h-16 text-slate-900 text-xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm placeholder:text-slate-500 focus:ring-4 focus:ring-red-500/20"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
              </div>
              <Button 
                type="submit" 
                size="lg"
                className="sm:rounded-l-none bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 h-16 px-12 shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl font-semibold transform hover:scale-105"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-6 h-6 mr-3" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Enhanced About Us Section */}
      <section id="about" className="py-[72px] max-w-7xl mx-auto bg-white">
        <div className='w-full flex gap-[130px]'>
          <h1 className=' text-6xl font-semibold whitespace-nowrap'>About Us</h1>
          <p className='text-[18px] text-justify'>Arham Rubber International, a division of ISO-certified American Rubber Industries, is a premier manufacturer and supplier of high-performance industrial rubber products. We specialize in producing a diverse range of rubber sheets, hoses, and electrical insulating mats, along with custom rubber molded parts tailored to meet unique client specifications. Our product portfolio includes an extensive variety of industrial hoses for applications such as water, steam, chemical transfer, cement discharge, sand blasting, hydraulic systems, and refrigeration charging lines. Additionally, we offer specialized solutions like composite hoses for tanker loading, stainless steel braided hoses, and rubber profiles including rubber beading. Dedicated to quality and innovation, Arham Rubber International is committed to providing reliable and durable products for industrial applications worldwide.</p>
        </div>
      </section>


            {/* Enhanced Products Section with Load More */}
            <section id="products" className="py-24 bg-[#F7F7F7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-6xl font-semibold bg-[#020202] bg-clip-text text-transparent mb-8 tracking-tight">
                            {searchTerm ? `Search Results for "${searchTerm}"` : "Best Selling Products"}
                        </h2>
                        {/* <div className="w-24 h-2 bg-gradient-to-r from-red-600 to-red-700 rounded-full mx-auto mb-8"></div> */}
                        <p className="text-lg text-[#3C3A3D] max-w-xl mx-auto leading-relaxed">
                            {searchTerm
                                ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`
                                : '"Reliable Rubber Solutions for Every Industry—Engineered to Perform, Built to Last!"'}
                        </p>
                    </div>

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
                            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                                {displayedProducts.map((product) => (
                                    <Card
                                        key={product.id}
                                        className=" bg-white border-none rounded-md h-full w-full">

                                        <div className=" flex gap-2 items-center  rounded-t-2xl h-full">
                                            <CardContent className="p-6 rounded-[2px] flex flex-col h-full">

                                                <div className="h-full">
                                                    <h3 className="text-5xl font-semibold max-w-[50%]  text-[#020202]  leading-tight">{product.name}</h3>
                                                    {/* <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300 text-sm font-semibold px-3 py-1 rounded-full">
                                                      {product.category}
                                                    </Badge> */}
                                                    <p className="text-[#3C3A3D] font-regular line-clamp-3 leading-relaxed">{product.description}</p>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="lg"
                                                        onClick={handleSeeMoreDetails}
                                                        className="flex-1 bg-gray-50 border-[#CB4954] text-[#020202] transition-all duration-300 rounded-lg border-[1px] font-semibold">
                                                        {/* <Eye className="w-4 h-4 mr-2" /> */}
                                                        See More Details
                                                    </Button>
                                                    <Button 
                                                      size="lg" 
                                                      onClick={() => handleDownloadBrochure(product)}
                                                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
                                                    >
                                                      <Download className="w-4 h-4 mr-2" />
                                                      Brochure
                                                    </Button>
                                                </div>
                                            </CardContent>
                                            <div>
                                            <img
                                                // src={"https://lipsum.app/640x480/"}
                                                src={product.image || '/api/placeholder/300/300'}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700"
                                            />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasMoreProducts && (
                                <div className="text-center mt-16">
                                    <Button
                                        onClick={handleLoadMore}
                                        size="lg"
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105">
                                        Load More Products
                                        <ArrowRight className="w-6 h-6 ml-3" />
                                    </Button>
                                    <p className="text-slate-500 mt-4 text-lg">
                                        Showing {displayedProducts.length} of {filteredProducts.length} products
                                    </p>
                                </div>
                            )}

                            {!hasMoreProducts && filteredProducts.length > 10 && (
                                <div className="text-center mt-16">
                                    <p className="text-slate-600 text-xl font-semibold">🎉 You've seen all {filteredProducts.length} products!</p>
                                </div>
                            )}
                        </>
                    )}
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
