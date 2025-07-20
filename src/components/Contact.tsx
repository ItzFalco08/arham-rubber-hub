"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useSelectedProduct } from "@/context/SelectedProductContext"
import { useProducts } from "@/context/ProductsContext"

export default function Contact() {
  const { selectedProduct, setSelectedProduct } = useSelectedProduct();
  const { products } = useProducts(); // Get products from context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: selectedProduct || "none", // Initialize with selected product or "none"
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Update product field when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        product: selectedProduct
      }));
    }
  }, [selectedProduct]);

  // Clear selected product when component unmounts or form is submitted
  useEffect(() => {
    return () => {
      // Optional: Clear selected product when leaving the page
      // setSelectedProduct(null);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProductChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      product: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        })
        return
      }

      console.log("Submitting form to Supabase:", formData)
      
      // Insert into Supabase
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim(),
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          product: formData.product === "none" ? null : formData.product.trim() || null // Handle "none" case
        }])
      
      if (error) {
        console.error('Supabase error:', error)
        toast({
          title: "Submission Failed",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        })
        return
      }

      console.log("Form submitted successfully to Supabase")
      
      // Clear selected product after successful submission
      setSelectedProduct(null);
      
      // Reset form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        product: "none",
        message: "",
      })
      
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      })
      
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-[56rem] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/mechanic-bg.png')",
        }}
      >
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image space (handled by background) */}
          <div className="hidden lg:block">{/* This space is for the background image */}</div>

          {/* Right side - Contact Form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md bg-white shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold text-gray-900 text-center">Reach Us</CardTitle>

                <div className="text-center text-gray-600 text-sm leading-relaxed mt-4">
                  <p>No 83/1, Madukkarai Road, Kurichi, Madukkarai,</p>
                  <p>Coimbatore-641021, Tamil Nadu, India</p>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone number (optional)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      name="company"
                      placeholder="Company name (optional)"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Select value={formData.product} onValueChange={handleProductChange}>
                      <SelectTrigger 
                        className={`w-full px-4 py-3 border-0 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all ${
                          selectedProduct && formData.product === selectedProduct 
                            ? 'bg-blue-50 border-2 border-blue-200' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <SelectValue placeholder="Product of interest (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (General Inquiry)</SelectItem>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.name}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedProduct && formData.product === selectedProduct && (
                      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <span className="text-blue-500 text-sm">✨</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#CB4954] hover:bg-[#963840] transition-none text-white font-semibold py-3 px-6  disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
