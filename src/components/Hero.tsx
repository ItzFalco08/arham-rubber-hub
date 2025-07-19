import React from 'react'
import { Input } from './ui/input'
import { Loader, Search } from 'lucide-react'
import { Button } from './ui/button'
import Header from './Header'

function Hero({handleSearch, searchTerm, setSearchTerm, isSearching}) {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center text-white overflow-hidden">
        <div className='w-full h-24  z-50 absolute top-0 left-0'>
            <Header className='relative mt-0 bg-transparent' navClassName="bg-transparent text-white" isHidden={false} />
        </div>

        <div
            className="absolute inset-0 bg-cover bg-center opacity-100"
            style={{
                backgroundImage: "url('/images/hero-bg.png')",
            }}
        />
        <div className="absolute inset-0 bg-opacity-60 bg-[#0D1B3999]" />

        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12 animate-fade-in">
                <div className="space-y-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        <span className="block mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">High-Performance</span>
                        <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Industrial Rubber Solutions</span>
                    </h1>

                    <p className="text-xl sm:text-2xl md:text-xl max-w-4xl mx-auto leading-relaxed text-blue-100 font-light">
                        "From versatile rubber sheets to specialized industrial hoses and custom-molded parts, Arham Rubber International delivers unmatched quality and innovation to power
                        industries worldwide."
                    </p>
                </div>

                {/* Enhanced Search Form */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row max-w-sm mx-auto gap-4 sm:gap-0">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder="Search Products"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-16 px-6 !text-lg focus:outline-none focus-visible:ring-0 focus:border-transparent border-1 rounded-full backdrop-blur-sml bg-white bg-opacity-[0.1] outline-none border-white/60 border placeholder:text-gray-300 text-white"
                        />

                        <Button
                            type="submit"
                            
                            className=" bg-[#CB4954] hover:bg-[#963840] w-12 h-12 rounded-full text-xl absolute right-2 top-2 flex items-center justify-center font-semibold"
                            >
                            {isSearching ? (
                                <Loader className='animate-spin' />
                            ) : (
                                <Search className="w-6 h-6" />
                            )}
                        </Button>                            
                    </div>

                </form>
            </div>
        </div>
    </section>
  )
}

export default Hero