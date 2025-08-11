import { useState } from 'react';
import { Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: string;
  items: string;
}

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const createOrder = useMutation({
    mutationFn: async (orderData: OrderData) => {
      return await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. We'll contact you soon.",
      });
      clearCart();
      setShowCheckout(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: "Order failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    const orderItems = items.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      price: parseFloat(item.product.price),
      quantity: item.quantity,
    }));

    const orderData: OrderData = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      totalAmount: getTotalPrice().toFixed(2),
      items: JSON.stringify(orderItems),
    };

    createOrder.mutate(orderData);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream" data-testid="empty-cart">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <ShoppingBag size={80} className="mx-auto text-sage mb-6" />
            <h1 className="text-4xl font-playfair font-bold text-forest mb-4" data-testid="empty-cart-title">Your Cart is Empty</h1>
            <p className="text-lg text-gray-600 mb-8">Looks like you haven't added any natural goodness to your cart yet.</p>
            <Link href="/shop">
              <Button className="bg-sage hover:bg-forest text-white px-8 py-4 rounded-full font-medium" data-testid="shop-now-button">
                Shop Natural Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream" data-testid="cart-page">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-playfair font-bold text-forest mb-8" data-testid="cart-title">
          Your Cart ({getTotalItems()} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
            {items.map((item) => (
              <Card key={item.productId} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img 
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                      data-testid={`cart-item-image-${item.productId}`}
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-forest" data-testid={`cart-item-name-${item.productId}`}>
                            {item.product.name}
                          </h3>
                          {item.product.namebergali && (
                            <p className="text-sm text-sage" data-testid={`cart-item-bengali-${item.productId}`}>
                              {item.product.namebergali}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-700"
                          data-testid={`remove-item-${item.productId}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      
                      <p className="text-gray-600 mb-4" data-testid={`cart-item-description-${item.productId}`}>
                        {item.product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            data-testid={`decrease-quantity-${item.productId}`}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="px-4 py-2 font-semibold" data-testid={`item-quantity-${item.productId}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            data-testid={`increase-quantity-${item.productId}`}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500">৳{item.product.price} each</div>
                          <div className="text-lg font-bold text-forest" data-testid={`item-total-${item.productId}`}>
                            ৳{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card data-testid="order-summary">
              <CardHeader>
                <CardTitle className="text-forest">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span data-testid="subtotal">৳{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-sage">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-forest" data-testid="total-price">৳{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                {!showCheckout ? (
                  <Button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-sage hover:bg-forest text-white py-3 rounded-full font-medium"
                    data-testid="checkout-button"
                  >
                    Proceed to Checkout
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowCheckout(false)}
                    variant="outline"
                    className="w-full border-sage text-sage hover:bg-sage hover:text-white"
                    data-testid="cancel-checkout-button"
                  >
                    Cancel Checkout
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Checkout Form */}
            {showCheckout && (
              <Card data-testid="checkout-form">
                <CardHeader>
                  <CardTitle className="text-forest">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          required
                          data-testid="first-name-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          required
                          data-testid="last-name-input"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        required
                        data-testid="email-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        required
                        data-testid="phone-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Delivery Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                        required
                        rows={4}
                        placeholder="Please provide your complete address with area/district"
                        data-testid="address-input"
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={createOrder.isPending}
                      className="w-full bg-sage hover:bg-forest text-white py-3 rounded-full font-medium"
                      data-testid="place-order-button"
                    >
                      {createOrder.isPending ? 'Placing Order...' : `Place Order - ৳${getTotalPrice().toFixed(2)}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
