import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { type Product } from '@shared/schema';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/CartProvider';
import { useState } from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', id],
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    select: (data) => data?.filter(p => p.id !== id && p.category === product?.category).slice(0, 3) || [],
    enabled: !!product,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    addItem(product, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-playfair font-bold text-forest mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/shop">
              <Button className="bg-sage hover:bg-forest text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream" data-testid="product-detail-page">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Breadcrumb */}
        <div className="mb-8" data-testid="breadcrumb">
          <Link href="/shop" className="flex items-center text-sage hover:text-forest transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Shop
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Product Image */}
          <div className="relative">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
              data-testid="product-detail-image"
            />
            {product.featured && (
              <Badge className="absolute top-4 right-4 bg-sage text-white px-4 py-2">
                Featured
              </Badge>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-playfair font-bold text-forest mb-2" data-testid="product-detail-name">
                {product.name}
              </h1>
              {product.namebengali && (
                <p className="text-lg text-sage mb-4" data-testid="product-detail-bengali-name">
                  {product.namebergali}
                </p>
              )}
              <div className="text-3xl font-bold text-forest mb-6" data-testid="product-detail-price">
                ৳{product.price}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-forest mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed" data-testid="product-detail-description">
                {product.description}
              </p>
            </div>

            {product.ingredients && (
              <div>
                <h3 className="text-xl font-semibold text-forest mb-3">Ingredients</h3>
                <p className="text-gray-600" data-testid="product-detail-ingredients">
                  {product.ingredients}
                </p>
              </div>
            )}

            {product.benefits && (
              <div>
                <h3 className="text-xl font-semibold text-forest mb-3">Benefits</h3>
                <p className="text-gray-600" data-testid="product-detail-benefits">
                  {product.benefits}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-forest">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-sage rounded-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="rounded-full"
                    data-testid="quantity-decrease"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="px-4 py-2 font-semibold" data-testid="quantity-display">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(quantity + 1)}
                    className="rounded-full"
                    data-testid="quantity-increase"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="bg-sage hover:bg-forest text-white px-8 py-3 rounded-full font-medium flex-1 max-w-xs"
                  data-testid="add-to-cart-detail"
                >
                  {isAdding ? 'Added to Cart!' : `Add to Cart - ৳${(parseFloat(product.price) * quantity).toFixed(2)}`}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section data-testid="related-products">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-playfair font-bold text-forest mb-4">Related Products</h2>
              <p className="text-lg text-gray-600">You might also like these handcrafted items</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
