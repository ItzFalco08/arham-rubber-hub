import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import WhyArham from '@/components/WhyArham';
import Header from '@/components/Header';
import About from '@/components/About';
import Hero from '@/components/Hero';
import Products from '@/components/Products';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Enhanced Modern Header */}
      <Header isHidden={true} />

      {/* Enhanced Hero Section with Modern Design */}
      <Hero isSearching={isSearching} handleSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Enhanced About Us Section */}
      <About/>

      {/* Enhanced Products Section with Limit */}
      <Products
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        limitProducts={true}
      />

      <WhyArham/>

      <Contact/>
      {/* Enhanced Footer */}
      <Footer/>
    </div>
  );
};

export default Index;
