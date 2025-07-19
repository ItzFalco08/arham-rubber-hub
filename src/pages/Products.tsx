import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Products from '@/components/Products'
import React from 'react'

function ProductsPage() {
  return (
    <>
      <Header isHidden={false}/>
      <Products limitProducts={false} className="mt-24" />
      <Footer/>
    </>
  )
}

export default ProductsPage