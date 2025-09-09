import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { Product, defaultProduct } from '@/types/product';
import { ProductForm } from '@/components/admin/ProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

// Mock data - in a real app, this would come from an API
const mockProducts: Product[] = [
  { 
    id: '1', 
    name: 'Elegant Evening Gown',
    description: 'A beautiful evening gown for special occasions',
    category: 'Dresses', 
    price: 129.99, 
    stock: 42,
    status: 'in-stock',
    image: '/placeholder-dress.jpg',
    tags: ['evening', 'formal', 'gown'],
    sku: 'DRE-001'
  },
  { 
    id: '2', 
    name: 'Classic Blazer',
    description: 'A versatile blazer for any formal occasion',
    category: 'Outerwear', 
    price: 89.99, 
    stock: 15,
    status: 'low-stock',
    image: '/placeholder-blazer.jpg',
    tags: ['formal', 'blazer', 'jacket'],
    sku: 'BLA-001'
  },
  { 
    id: '3', 
    name: 'Casual T-Shirt',
    description: 'Comfortable and stylish everyday t-shirt',
    category: 'Tops', 
    price: 24.99, 
    stock: 0,
    status: 'out-of-stock',
    image: '/placeholder-tshirt.jpg',
    tags: ['casual', 'tshirt', 'cotton'],
    sku: 'TSH-001'
  },
];

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setProducts(products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveProduct = async (productData: Product) => {
    try {
      setIsSaving(true);
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (editingProduct) {
        // Update existing product
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
        ));
      } else {
        // Add new product
        const newProduct = {
          ...productData,
          id: Math.random().toString(36).substr(2, 9), // Generate random ID
          createdAt: new Date().toISOString()
        };
        setProducts([newProduct, ...products]);
      }
      
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your store's products and inventory</p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {isFormOpen && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingProduct(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={editingProduct || defaultProduct}
              onSave={handleSaveProduct}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingProduct(null);
              }}
              isSaving={isSaving}
            />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(product.status)}`}>
                      {product.status.replace('-', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(product.id)}
                        disabled={isDeleting && productToDelete === product.id}
                      >
                        {isDeleting && productToDelete === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Product</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            </CardContent>
            <div className="flex justify-end space-x-3 p-6 pt-0">
              <Button 
                variant="outline" 
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
