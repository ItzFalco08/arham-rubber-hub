
import React, { useState } from 'react';
import { Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', phone: '' });
  };

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
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => window.location.href = '/'}
            >
              <Phone className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Contact Section */}
      <section className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Industrial worker image */}
            <div className="relative h-[600px] rounded-lg overflow-hidden">
              <img 
                src="/api/placeholder/600/600" 
                alt="Industrial worker with tools" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent"></div>
            </div>

            {/* Right side - Contact form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Reach Us</h2>
                  
                  <div className="mb-6">
                    <p className="text-gray-600 text-center leading-relaxed">
                      No 83/1, Madukkarai Road, Kurichi, Madukkarai, 
                      Coimbatore-641021, Tamil Nadu, India
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
                    >
                      Submit
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
                <li><a href="/" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Sitemap</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Products</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-white transition-colors">Pvc suction hose</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Epdm rubber sheet</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Fly ash hose</a></li>
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

export default Contact;
