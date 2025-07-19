import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Phone, X, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
    isHidden: boolean;
    className?: string;
    navClassName?: string;
}

function Header({isHidden, className, navClassName}: HeaderProps) {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsVisible(scrollPosition > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const scrollToSection = (sectionId: string) => {
        // If we're already on the home page, just scroll
        if (window.location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                const elementPosition = element.offsetTop;
                const offsetPosition = elementPosition - 100; // 100px offset for fixed navbar
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            // Navigate to home page first, then scroll
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const elementPosition = element.offsetTop;
                    const offsetPosition = elementPosition - 100; // 100px offset for fixed navbar
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    };
        
    return (
        <header className={`w-full fixed top-0 z-50 shadow-sm transition-all duration-300 ease-in-out 
        ${className} ${isHidden ? (isVisible ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden') : "h-auto opacity-100"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`${navClassName || 'bg-white text-[#3C3A3D]'} flex justify-between mt-4 px-4 rounded-[12px] items-center h-20`}>
                    {/* Enhanced Logo */}
                    <div className='bg-white py-[3px] px-[12px] rounded-[13px] cursor-pointer' onClick={()=> navigate("/")}>
                        <img src="/images/logo.png" alt="ARHAM RUBBER" width={100} height={56}  />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-10">
                    <button 
                        onClick={() => scrollToSection('products')}
                        className=" hover:text-red-600 transition-all duration-200 font-medium text-lg relative group cursor-pointer"
                    >
                        Our Products
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300"></span>
                    </button>
                    <button 
                        onClick={() => scrollToSection('about')}
                        className=" hover:text-red-600 transition-all duration-200 font-medium text-lg relative group cursor-pointer"
                    >
                        About us
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300"></span>
                    </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                {isMobileMenuOpen  && (
                    <div className="md:hidden border py-6 mt-4 px-6 rounded-lg border-slate-400 space-y-6 bg-white/95 backdrop-blur-sm">
                        <button 
                            onClick={() => {
                                scrollToSection('products');
                                setIsMobileMenuOpen(false);
                            }}
                            className="block text-slate-700 hover:text-red-600 transition-colors font-semibold text-lg w-full text-left"
                        >
                            Our Products
                        </button>
                        <button 
                            onClick={() => {
                                scrollToSection('about');
                                setIsMobileMenuOpen(false);
                            }}
                            className="block text-slate-700 hover:text-red-600 transition-colors font-semibold text-lg w-full text-left"
                        >
                            About us
                        </button>
                        <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 text-lg font-semibold shadow-xl rounded-xl" onClick={() => navigate('/contact')}>
                            <Phone className="w-5 h-5 mr-3" />
                            Contact now
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header