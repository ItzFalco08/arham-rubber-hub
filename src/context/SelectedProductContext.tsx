import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedProductContextType {
  selectedProduct: string | null;
  setSelectedProduct: (product: string | null) => void;
}

const SelectedProductContext = createContext<SelectedProductContextType | undefined>(undefined);

export const SelectedProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <SelectedProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </SelectedProductContext.Provider>
  );
};

export const useSelectedProduct = () => {
  const context = useContext(SelectedProductContext);
  if (context === undefined) {
    throw new Error('useSelectedProduct must be used within a SelectedProductProvider');
  }
  return context;
};

export { SelectedProductContext };
