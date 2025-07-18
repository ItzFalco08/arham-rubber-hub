
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      setIsSearching(false);
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-destructive">Error loading products</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                AR
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">ARHAM RUBBER</h1>
                <p className="text-xs text-muted-foreground font-medium">INTERNATIONAL</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#products" className="text-foreground hover:text-red-600 transition-colors duration-200 font-medium">
                Our Products
              </a>
              <a href="#about" className="text-foreground hover:text-red-600 transition-colors duration-200 font-medium">
                About us
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Contact Button */}
            <Button className="hidden md:flex bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Phone className="w-4 h-4 mr-2" />
              Contact now
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-4">
              <a 
                href="#products" 
                className="block text-foreground hover:text-red-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Products
              </a>
              <a 
                href="#about" 
                className="block text-foreground hover:text-red-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </a>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Contact now
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-blue-900/95 flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block mb-2">High-Performance</span>
              <span className="block text-red-400">Industrial Rubber Solutions</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-blue-100">
              Trusted provider of rubber sheets for diversified needs of food and clean room industry where 
              in, these international standards constructed quality and innovation to power industries worldwide.
            </p>
            
            {/* Enhanced Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-4 sm:gap-0">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sm:rounded-r-none sm:border-r-0 h-14 text-gray-900 text-lg shadow-lg"
              />
              <Button 
                type="submit" 
                size="lg"
                className="sm:rounded-l-none bg-red-600 hover:bg-red-700 h-14 px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Enhanced About Us Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6 tracking-tight">About Us</h2>
                <div className="w-20 h-1 bg-red-600 mb-8"></div>
              </div>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-lg">
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
              
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-600/20 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Industrial rubber manufacturing" 
                className="relative rounded-2xl shadow-2xl w-full h-auto transform -rotate-1 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section id="products" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6 tracking-tight">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Best Selling Products'}
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {searchTerm 
                ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
                : 'Flexible Rubber Solutions for Every Industry - Engineered to Perform, Built to Last!'
              }
            </p>
          </div>
          
          {filteredProducts.length === 0 && searchTerm ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">No products found</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Try adjusting your search terms or browse all products below.
              </p>
              <Button 
                onClick={() => setSearchTerm('')}
                variant="outline"
                size="lg"
                className="hover:bg-red-50 hover:border-red-300"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                    <img 
                      src={product.image || '/api/placeholder/300/300'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-sm font-medium">
                      {product.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-red-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSeeMoreDetails}
                        className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownloadBrochure(product)}
                        className="flex-1 bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Brochure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-16">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6 tracking-tight">Why Arham Rubber International</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
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
              <div key={index} className="text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:bg-red-700 transition-all duration-300">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="py-20 bg-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Helping A Local Business Reinvent Itself</h2>
            <p className="text-xl opacity-90">We decided there was no fixed work and dedication</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "14+", label: "Years in Business" },
              { number: "52+", label: "Countries Served" },
              { number: "3,655+", label: "Products Delivered" },
              { number: "10,565+", label: "Happy Customers" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">{stat.number}</div>
                <p className="text-lg opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  AR
                </div>
                <div>
                  <h3 className="text-xl font-bold">ARHAM RUBBER</h3>
                  <p className="text-sm text-gray-400">INTERNATIONAL</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-400">
                <p>83/1 Madukkarai main road sidco industrial estate kurichi</p>
                <p>Coimbatore - 641021</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-red-400">Home</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Sitemap</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors duration-200">Contact us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-red-400">Products</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#products" className="hover:text-white transition-colors duration-200">Pvc suction hose</a></li>
                <li><a href="#products" className="hover:text-white transition-colors duration-200">Epdm rubber sheet</a></li>
                <li><a href="#products" className="hover:text-white transition-colors duration-200">Fly ash hose</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-red-400">Follow Us</h4>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Instagram].map((Icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">Copyright © 2024</p>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms & Conditions</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
