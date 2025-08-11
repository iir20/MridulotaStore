import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { type Product, type Order, type Contact } from '@shared/schema';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Plus, Edit, Trash2, Eye, Package, ShoppingCart, Users, MessageSquare } from 'lucide-react';

interface ProductFormData {
  name: string;
  namebergali: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  ingredients: string;
  benefits: string;
  featured: boolean;
}

export default function Admin() {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    namebergali: '',
    description: '',
    price: '',
    category: 'soaps',
    imageUrl: '',
    ingredients: '',
    benefits: '',
    featured: false,
  });

  // Queries
  const { data: products = [], refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
  });

  // Mutations
  const createProduct = useMutation({
    mutationFn: async (data: ProductFormData) => {
      return await apiRequest('POST', '/api/products', data);
    },
    onSuccess: () => {
      toast({ title: "Product created successfully!" });
      setShowProductForm(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      return await apiRequest('PUT', `/api/products/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Product updated successfully!" });
      setShowProductForm(false);
      setEditingProduct(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Product deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest('PUT', `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({ title: "Order status updated!" });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update order status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      namebergali: '',
      description: '',
      price: '',
      category: 'soaps',
      imageUrl: '',
      ingredients: '',
      benefits: '',
      featured: false,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      namebergali: product.namebergali || '',
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      ingredients: product.ingredients || '',
      benefits: product.benefits || '',
      featured: product.featured,
    });
    setShowProductForm(true);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, data: formData });
    } else {
      createProduct.mutate(formData);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(id);
    }
  };

  const formatOrderItems = (itemsJson: string) => {
    try {
      const items = JSON.parse(itemsJson);
      return items.map((item: any) => `${item.productName} x${item.quantity}`).join(', ');
    } catch {
      return 'Invalid order data';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-sage/20 text-forest';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="admin-page">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-forest mb-4" data-testid="admin-title">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your products, orders, and customer inquiries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="admin-stats">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="text-sage mr-3" size={24} />
                <div>
                  <div className="text-2xl font-bold text-forest" data-testid="total-products">{products.length}</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="text-sage mr-3" size={24} />
                <div>
                  <div className="text-2xl font-bold text-forest" data-testid="total-orders">{orders.length}</div>
                  <div className="text-sm text-gray-600">Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="text-sage mr-3" size={24} />
                <div>
                  <div className="text-2xl font-bold text-forest" data-testid="total-contacts">{contacts.length}</div>
                  <div className="text-sm text-gray-600">Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="text-sage mr-3" size={24} />
                <div>
                  <div className="text-2xl font-bold text-forest" data-testid="featured-products">{products.filter(p => p.featured).length}</div>
                  <div className="text-sm text-gray-600">Featured</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6" data-testid="admin-tabs">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">Messages</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6" data-testid="products-tab">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-playfair font-bold text-forest">Products</h2>
              <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
                <DialogTrigger asChild>
                  <Button className="bg-sage hover:bg-forest text-white" data-testid="add-product-button">
                    <Plus size={16} className="mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitProduct} className="space-y-4" data-testid="product-form">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          data-testid="product-name-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="namebergali">Bengali Name</Label>
                        <Input
                          id="namebergali"
                          value={formData.namebergali}
                          onChange={(e) => setFormData(prev => ({ ...prev, namebergali: e.target.value }))}
                          data-testid="product-bengali-name-input"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        required
                        data-testid="product-description-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (৳)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          required
                          data-testid="product-price-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger data-testid="product-category-select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="soaps">Soaps</SelectItem>
                            <SelectItem value="scrubs">Scrubs</SelectItem>
                            <SelectItem value="oils">Oils</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        required
                        data-testid="product-image-input"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ingredients">Ingredients</Label>
                      <Textarea
                        id="ingredients"
                        value={formData.ingredients}
                        onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                        data-testid="product-ingredients-input"
                      />
                    </div>

                    <div>
                      <Label htmlFor="benefits">Benefits</Label>
                      <Textarea
                        id="benefits"
                        value={formData.benefits}
                        onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                        data-testid="product-benefits-input"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        data-testid="product-featured-checkbox"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        disabled={createProduct.isPending || updateProduct.isPending}
                        className="bg-sage hover:bg-forest text-white"
                        data-testid="save-product-button"
                      >
                        {createProduct.isPending || updateProduct.isPending ? 'Saving...' : 'Save Product'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                          resetForm();
                        }}
                        data-testid="cancel-product-button"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden" data-testid={`product-card-${product.id}`}>
                  <div className="relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.featured && (
                      <Badge className="absolute top-2 right-2 bg-sage text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-forest mb-2" data-testid={`product-name-${product.id}`}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">৳{product.price}</p>
                    <p className="text-xs text-sage mb-3">{product.category}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                        data-testid={`edit-product-${product.id}`}
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                        data-testid={`delete-product-${product.id}`}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6" data-testid="orders-tab">
            <h2 className="text-2xl font-playfair font-bold text-forest">Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} data-testid={`order-card-${order.id}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-forest mb-1" data-testid={`order-customer-${order.id}`}>
                          {order.customerName}
                        </h3>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)} data-testid={`order-status-${order.id}`}>
                          {order.status}
                        </Badge>
                        <p className="text-lg font-bold text-forest mt-2" data-testid={`order-total-${order.id}`}>
                          ৳{order.totalAmount}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-forest mb-1">Items:</p>
                      <p className="text-sm text-gray-600" data-testid={`order-items-${order.id}`}>
                        {formatOrderItems(order.items)}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-forest mb-1">Delivery Address:</p>
                      <p className="text-sm text-gray-600" data-testid={`order-address-${order.id}`}>
                        {order.customerAddress}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Select 
                        value={order.status} 
                        onValueChange={(status) => updateOrderStatus.mutate({ id: order.id, status })}
                      >
                        <SelectTrigger className="w-40" data-testid={`order-status-select-${order.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {orders.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">No orders found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6" data-testid="contacts-tab">
            <h2 className="text-2xl font-playfair font-bold text-forest">Customer Messages</h2>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card key={contact.id} data-testid={`contact-card-${contact.id}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-forest mb-1" data-testid={`contact-name-${contact.id}`}>
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                        {contact.phone && (
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500" data-testid={`contact-date-${contact.id}`}>
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-forest mb-2">Message:</p>
                      <p className="text-sm text-gray-600" data-testid={`contact-message-${contact.id}`}>
                        {contact.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {contacts.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">No messages found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
