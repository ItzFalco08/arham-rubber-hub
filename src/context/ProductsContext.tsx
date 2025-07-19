import React, { createContext, useContext, useState, useCallback } from 'react';

export type Product = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  image?: string;
  brochure?: string;
};

interface ProductsContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Memoize setProducts to ensure it's stable across renders
  const stableSetProducts = useCallback((products: React.SetStateAction<Product[]>) => {
    setProducts(products);
  }, []);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    products,
    setProducts: stableSetProducts
  }), [products, stableSetProducts]);

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within a ProductsProvider');
  return context;
};
