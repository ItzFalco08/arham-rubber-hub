
import React, { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Facebook, Twitter, Instagram, Download, Eye, Star, Users, Globe, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      setIsSearching(false);
      // Scroll to products section
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const handleDownloadBrochure = (productName: string) => {
    console.log(`Downloading brochure for ${productName}`);
    // This would typically trigger a PDF download
  };

  const handleSeeMoreDetails = () => {
    window.location.href = '/contact';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  AR
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">ARHAM RUBBER</h1>
                  <p className="text-xs text-gray-500">INTERNATIONAL</p>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#products" className="text-gray-700 hover:text-red-600 transition-colors">Our Products</a>
              <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors">About us</a>
            </nav>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Contact now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-r from-blue-900/90 to-blue-800/90 flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            "High-Performance Industrial Rubber Solutions"
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Trusted provider of rubber sheets for diversified needs of food and clean room industry where 
            in, these international standards constructed quality and innovation to power industries worldwide.
          </p>
          <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-r-none border-r-0 h-12 text-gray-900"
            />
            <Button 
              type="submit" 
              className="rounded-l-none bg-red-600 hover:bg-red-700 h-12 px-6"
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
              <p className="text-gray-600 mb-4">
                Arham Rubber International, a division of ISO certified American Rubber Industries, is a prominent 
                manufacturer and supplier of high performance industrial rubber products. We specialize in producing 
                a diverse range of rubber sheets, hoses, and industrial including mats, using advanced rubber 
                compounding technology.
              </p>
              <p className="text-gray-600 mb-4">
                Our product range spans across various industrial sectors, from automotive and construction to 
                variety of industrial niches for applications such as safety, sealing, chemical transfer, cement discharge, 
                sand blasting, hydraulic systems and refrigeration drawing, item. Additionally, we offer specialized 
                products like electrical insulation mats and anti-slip mats, ensuring safety and compliance with 
                international standards.
              </p>
              <p className="text-gray-600">
                Including rubber handling. Dedicated to quality and innovation, Arham Rubber International is 
                committed to providing exceptional rubber products for industrial applications worldwide.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Industrial rubber manufacturing" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section id="products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Best Selling Products'}
            </h2>
            <p className="text-gray-600">
              {searchTerm 
                ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
                : 'Flexible Rubber Solutions for Every Industry - Engineered to Perform, Built to Last!'
              }
            </p>
          </div>
          
          {filteredProducts.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or browse all products below.
              </p>
              <Button 
                onClick={() => setSearchTerm('')}
                variant="outline"
                className="hover:bg-red-50 hover:border-red-300"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image || '/api/placeholder/250/200'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-red-100 text-red-800">{product.category}</Badge>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{product.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{product.description}</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSeeMoreDetails}
                        className="flex-1 hover:bg-red-50 hover:border-red-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        See More Details
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownloadBrochure(product.name)}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Brochure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Why Arham Rubber */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Arham Rubber International</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Unmatched Quality</h3>
              <p className="text-gray-600">
                We provide premium quality rubber products backed by rigorous testing and quality control processes, ensuring long-lasting performance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tailored Solutions</h3>
              <p className="text-gray-600">
                We offer customized designs and materials meeting the specific needs and requirements of every industry and application.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reliable Delivery</h3>
              <p className="text-gray-600">
                We prioritize on-time delivery to keep your operations running smoothly, whether it's a single shipment or recurring orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Helping A Local Business Reinvent Itself</h2>
            <p className="text-lg opacity-90">We decided there was no fixed work and dedication</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">14+</div>
              <p className="text-sm opacity-80">Years in Business</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">52+</div>
              <p className="text-sm opacity-80">Countries Served</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3,655+</div>
              <p className="text-sm opacity-80">Products Delivered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,565+</div>
              <p className="text-sm opacity-80">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  AR
                </div>
                <div>
                  <h3 className="text-lg font-bold">ARHAM RUBBER</h3>
                  <p className="text-xs text-gray-400">INTERNATIONAL</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                83/1 Madukkarai main road sidco industrial estate kurichi
              </p>
              <p className="text-gray-400 text-sm">Coimbatore - 641021</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Home</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Products</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Pvc suction hose</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Epdm rubber sheet</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fly ash hose</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">Copyright © 2024</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms & Conditions</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
