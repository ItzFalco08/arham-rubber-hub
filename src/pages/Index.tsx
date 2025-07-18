import React, { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Facebook, Twitter, Instagram, Download, Eye, Star, Users, Globe, Award, TrendingUp, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(10);
  const { toast } = useToast();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600/20 border-b-blue-600 rounded-full animate-spin mx-auto mt-2 ml-2"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              Loading Products
            </h2>
            <p className="text-slate-600">Please wait while we fetch the latest products...</p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl transform hover:scale-105 transition-transform duration-200">
                  <span className="text-xl">AR</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                  ARHAM RUBBER
                </h1>
                <p className="text-sm text-slate-500 font-medium tracking-wide">INTERNATIONAL</p>
              </div>
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
            <Button className="hidden md:flex bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 rounded-xl">
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
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 text-lg font-semibold shadow-xl rounded-xl">
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
      <section id="about" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 tracking-tight">
                  About Us
                </h2>
                <div className="w-24 h-2 bg-gradient-to-r from-red-600 to-red-700 rounded-full mb-10"></div>
              </div>
              
              <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
                <p>
                  Arham Rubber International, a division of ISO certified American Rubber Industries, is a prominent 
                  manufacturer and supplier of high performance industrial rubber products. We specialize in producing 
                  a diverse range of rubber sheets, hoses, and industrial including mats, using advanced rubber 
                  compounding technology.
                </p>
                <p>
                  Our product range spans across various industrial sectors, from automotive and construction to 
                  variety of industrial niches for applications such as safety, sealing, chemical transfer, cement discharge, 
                  sand blasting, hydraulic systems and refrigeration drawing, item. Additionally, we offer specialized 
                  products like electrical insulation mats and anti-slip mats, ensuring safety and compliance with 
                  international standards.
                </p>
                <p>
                  Including rubber handling. Dedicated to quality and innovation, Arham Rubber International is 
                  committed to providing exceptional rubber products for industrial applications worldwide.
                </p>
              </div>
              
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105">
                Learn More
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-600/20 rounded-3xl transform rotate-3 shadow-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Industrial rubber manufacturing" 
                className="relative rounded-3xl shadow-3xl w-full h-auto transform -rotate-1 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Section with Load More */}
      <section id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 tracking-tight">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Best Selling Products'}
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-red-600 to-red-700 rounded-full mx-auto mb-8"></div>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {searchTerm 
                ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
                : 'Flexible Rubber Solutions for Every Industry - Engineered to Perform, Built to Last!'
              }
            </p>
          </div>
          
          {filteredProducts.length === 0 && searchTerm ? (
            <div className="text-center py-24">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-xl">
                <Search className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-4xl font-bold text-slate-700 mb-6">No products found</h3>
              <p className="text-slate-500 mb-10 max-w-lg mx-auto text-xl leading-relaxed">
                Try adjusting your search terms or browse all products below.
              </p>
              <Button 
                onClick={() => setSearchTerm('')}
                variant="outline"
                size="lg"
                className="hover:bg-red-50 hover:border-red-300 px-8 py-4 text-lg font-semibold rounded-xl border-2 transform hover:scale-105 transition-all duration-200"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-3xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-gradient-to-br from-white to-slate-50 rounded-2xl overflow-hidden">
                    <div className="aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                      <img 
                        src={product.image || '/api/placeholder/300/300'} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300 text-sm font-semibold px-3 py-1 rounded-full">
                        {product.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-slate-600 line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleSeeMoreDetails}
                          className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-300 rounded-xl border-2 font-semibold"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleDownloadBrochure(product)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Brochure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMoreProducts && (
                <div className="text-center mt-16">
                  <Button 
                    onClick={handleLoadMore}
                    size="lg" 
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105"
                  >
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
                  <p className="text-slate-600 text-xl font-semibold">
                    🎉 You've seen all {filteredProducts.length} products!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Enhanced Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 tracking-tight">
              Why Arham Rubber International
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-red-600 to-red-700 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Award,
                title: "Unmatched Quality",
                description: "We provide premium quality rubber products backed by rigorous testing and quality control processes, ensuring long-lasting performance."
              },
              {
                icon: Users,
                title: "Tailored Solutions", 
                description: "We offer customized designs and materials meeting the specific needs and requirements of every industry and application."
              },
              {
                icon: Globe,
                title: "Reliable Delivery",
                description: "We prioritize on-time delivery to keep your operations running smoothly, whether it's a single shipment or recurring orders."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group hover:-translate-y-4 transition-transform duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:shadow-3xl group-hover:from-red-700 group-hover:to-red-800 transition-all duration-500 transform group-hover:scale-110">
                  <feature.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-6">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-xl">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="py-24 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-8">Helping A Local Business Reinvent Itself</h2>
            <p className="text-2xl opacity-90">We decided there was no fixed work and dedication</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: "14+", label: "Years in Business" },
              { number: "52+", label: "Countries Served" },
              { number: "3,655+", label: "Products Delivered" },
              { number: "10,565+", label: "Happy Customers" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-b from-white to-red-100 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <p className="text-xl opacity-90 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl">
                  <span className="text-xl">AR</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    ARHAM RUBBER
                  </h3>
                  <p className="text-slate-400 font-medium">INTERNATIONAL</p>
                </div>
              </div>
              <div className="space-y-3 text-slate-400 text-lg">
                <p>83/1 Madukkarai main road sidco industrial estate kurichi</p>
                <p>Coimbatore - 641021</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold mb-8 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                Home
              </h4>
              <ul className="space-y-4 text-slate-400 text-lg">
                <li><a href="#about" className="hover:text-white transition-colors duration-200 hover:text-xl">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200 hover:text-xl">Sitemap</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors duration-200 hover:text-xl">Contact us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold mb-8 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                Products
              </h4>
              <ul className="space-y-4 text-slate-400 text-lg">
                <li><a href="#products" className="hover:text-white transition-colors duration-200 hover:text-xl">Pvc suction hose</a></li>
                <li><a href="#products" className="hover:text-white transition-colors duration-200 hover:text-xl">Epdm rubber sheet</a></li>
                <li><a href="#products" className="hover:text-white transition-colors duration-200 hover:text-xl">Fly ash hose</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold mb-8 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                Follow Us
              </h4>
              <div className="flex space-x-6">
                {[Facebook, Twitter, Instagram].map((Icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <p className="text-slate-400 text-lg">Copyright © 2024</p>
            <div className="flex space-x-10">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-lg">Terms & Conditions</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-lg">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
