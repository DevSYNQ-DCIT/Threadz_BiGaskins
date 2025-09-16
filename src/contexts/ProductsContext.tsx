import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { productsService, Product } from '@/lib/products';

type ProductsContextType = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const unsubscribe = productsService.subscribeToProducts(({ eventType, new: newProduct, old: oldProduct }) => {
      switch (eventType) {
        case 'INSERT':
          if (newProduct) {
            setProducts(prev => [newProduct, ...prev]);
          }
          break;
        case 'UPDATE':
          if (newProduct) {
            setProducts(prev =>
              prev.map(product =>
                product.id === newProduct.id ? newProduct : product
              )
            );
          }
          break;
        case 'DELETE':
          if (oldProduct) {
            setProducts(prev =>
              prev.filter(product => product.id !== oldProduct.id)
            );
          }
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export default ProductsContext;
