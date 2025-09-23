import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id'> & { id: string | number }) => void;
  removeFromWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
  clearWishlist: () => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem(`wishlist_${user?.id || 'guest'}`);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    }
  }, [user?.id]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`wishlist_${user?.id || 'guest'}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user?.id]);

  const addToWishlist = (item: Omit<WishlistItem, 'id'> & { id: string | number }) => {
    const itemWithStringId = {
      ...item,
      id: String(item.id)
    };

    setWishlist(prevWishlist => {
      const itemExists = prevWishlist.some(wishlistItem => wishlistItem.id === String(item.id));

      if (!itemExists) {
        toast({
          title: 'Added to Wishlist',
          description: `${item.name} has been added to your wishlist.`,
        });
        return [...prevWishlist, itemWithStringId];
      } else {
        toast({
          title: 'Already in Wishlist',
          description: `${item.name} is already in your wishlist.`,
          variant: 'default',
        });
        return prevWishlist;
      }
    });
  };

  const removeFromWishlist = (id: string | number) => {
    setWishlist(prevWishlist => {
      const item = prevWishlist.find(item => item.id === String(id));
      if (item) {
        toast({
          title: 'Removed from Wishlist',
          description: `${item.name} has been removed from your wishlist.`,
        });
      }
      return prevWishlist.filter(item => item.id !== String(id));
    });
  };

  const isInWishlist = (id: string | number) => {
    return wishlist.some(item => item.id === String(id));
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast({
      title: 'Wishlist Cleared',
      description: 'All items have been removed from your wishlist.',
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
