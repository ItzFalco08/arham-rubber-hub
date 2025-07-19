import { Facebook, Twitter, Instagram, ArrowRight } from "lucide-react"
import { useProducts } from '@/context/ProductsContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Footer() {
  const { products } = useProducts();
  const navigate = useNavigate();
  
  // Show only first 4 products
  const displayedProducts = products.slice(0, 4);

  return (
    <footer className="bg-[#f7f7f7] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">

            <img src="/images/logo.png" className="w-[140px] mb-6" alt="" />

            <address className="text-gray-600 text-sm not-italic leading-relaxed">
              83/1 Madukkarai main road sidco
              <br />
              industrial estate kurichi
              <br />
              Coimbatore - 641021
            </address>
          </div>

          {/* Home Links */}
          <div className="col-span-1">
            <h4 className="font-semibold text-red-600 mb-4">Pages</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                  Products
                </a>
              </li>
            </ul>
          </div>

          {/* Products Links */}
          <div className="col-span-1">
            <h4 className="font-semibold text-red-600 mb-4">Products</h4>
            <ul className="space-y-3 mb-4">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <li key={product.id}>
                    <a 
                      onClick={() => navigate(`/contact`)} 
                      className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors text-sm"
                    >
                      {product.name}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">Loading products...</li>
              )}
            </ul>
            {products.length > 4 && (
              <a
                onClick={() => navigate('/products')}
                className="cursor-pointer text-sm flex items-center gap-1"
              >
                View All Products
                <ArrowRight className="w-4 h-4 " />
              </a>
            )}
          </div>

          {/* Social Media */}
          <div className="col-span-1">
            <h4 className="font-semibold text-red-600 mb-4">Follow Us</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">Copyright © 2024</p>
          <div className="flex space-x-6">
            <a onClick={()=> navigate("/termsandconditions")} className="cursor-pointer text-gray-500 hover:text-red-600 transition-colors text-sm">
              Terms & Conditions
            </a>
            <a onClick={()=> navigate('/privacypolicy')} className="cursor-pointer text-gray-500 hover:text-red-600 transition-colors text-sm">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
