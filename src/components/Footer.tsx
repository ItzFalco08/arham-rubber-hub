import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
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
            <h4 className="font-semibold text-red-600 mb-4">Home</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                  Sitemap
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          {/* Products Links */}
          <div className="col-span-1">
            <h4 className="font-semibold text-red-600 mb-4">Products</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                  Water Rubber Hose
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                  Cotton Hose Pipe
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm">
                  Cotton Hose Pipe
                </a>
              </li>
            </ul>
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
            <a href="#" className="text-gray-500 hover:text-red-600 transition-colors text-sm">
              Terms & Conditions
            </a>
            <a href="#" className="text-gray-500 hover:text-red-600 transition-colors text-sm">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
