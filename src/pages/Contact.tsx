
import React, { useState } from 'react';
import { Phone, MapPin, Facebook, Twitter, Instagram, Mail, Clock, User, Building, MessageSquare, ArrowRight, CheckCircle, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Validation Error", 
        description: "Email is required",
        variant: "destructive",
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting contact form:', formData);

      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          message: formData.message.trim() || null
        }]);

      if (error) {
        console.error('Error submitting contact form:', error);
        toast({
          title: "Submission Failed",
          description: "Failed to submit form. Please try again or contact us directly.",
          variant: "destructive",
        });
        return;
      }

      console.log('Contact form submitted successfully');
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Thank you for contacting us! We will get back to you within 24 hours.",
      });
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', phone: '', email: '', company: '', message: '' });
        setIsSubmitted(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                AR
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">ARHAM RUBBER</h1>
                <p className="text-xs text-muted-foreground font-medium">INTERNATIONAL</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="/#products" className="text-foreground hover:text-red-600 transition-colors duration-200 font-medium">
                Our Products
              </a>
              <a href="/#about" className="text-foreground hover:text-red-600 transition-colors duration-200 font-medium">
                About us
              </a>
            </nav>

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

            <Button 
              className="hidden md:flex bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => window.location.href = '/'}
            >
              <Phone className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-4">
              <a 
                href="/#products" 
                className="block text-foreground hover:text-red-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Products
              </a>
              <a 
                href="/#about" 
                className="block text-foreground hover:text-red-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </a>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={() => window.location.href = '/'}
              >
                <Phone className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Contact Section */}
      <section className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Contact Information & Image */}
            <div className="space-y-8">
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Industrial rubber manufacturing facility" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>
              </div>

              {/* Contact Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">Visit Us</h3>
                    <p className="text-sm text-muted-foreground">
                      83/1, Madukkarai Road, Kurichi<br />
                      Coimbatore-641021, Tamil Nadu
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      We respond within<br />
                      24 hours
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right side - Enhanced Contact Form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-lg shadow-2xl border-0">
                <CardContent className="p-8 sm:p-10">
                  {isSubmitted ? (
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Thank You!</h2>
                        <p className="text-muted-foreground">
                          Your message has been sent successfully. We'll get back to you within 24 hours.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Get In Touch</h2>
                        <div className="w-16 h-1 bg-red-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground leading-relaxed">
                          Ready to discuss your rubber product needs? Send us a message and we'll respond promptly.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center">
                            <User className="w-4 h-4 mr-2 text-red-600" />
                            Full Name *
                          </label>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="h-12 border-2 focus:border-red-500 transition-colors duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-red-600" />
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="h-12 border-2 focus:border-red-500 transition-colors duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-red-600" />
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-12 border-2 focus:border-red-500 transition-colors duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center">
                            <Building className="w-4 h-4 mr-2 text-red-600" />
                            Company Name
                          </label>
                          <Input
                            type="text"
                            name="company"
                            placeholder="Enter your company name"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="h-12 border-2 focus:border-red-500 transition-colors duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2 text-red-600" />
                            Message
                          </label>
                          <Textarea
                            name="message"
                            placeholder="Tell us about your requirements..."
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            className="border-2 focus:border-red-500 transition-colors duration-200 resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                              Sending Message...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              Send Message
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </div>
                          )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                          * Required fields
                        </p>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
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
                <li><a href="/" className="hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="/" className="hover:text-white transition-colors duration-200">Sitemap</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors duration-200">Contact us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-red-400">Products</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors duration-200">Pvc suction hose</a></li>
                <li><a href="/" className="hover:text-white transition-colors duration-200">Epdm rubber sheet</a></li>
                <li><a href="/" className="hover:text-white transition-colors duration-200">Fly ash hose</a></li>
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

export default Contact;
