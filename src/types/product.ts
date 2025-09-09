export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  image: string;
  tags?: string[];
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultProduct: Product = {
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  status: 'in-stock',
  image: '',
  tags: [],
  sku: ''
};
