import { type Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from './CartProvider';
import { Link } from 'wouter';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'featured';
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    addItem(product);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const getBadgeVariant = () => {
    if (product.featured) return 'bg-sage text-white';
    if (product.category === 'soaps') return 'bg-forest/90 text-white';
    if (product.category === 'scrubs') return 'bg-earth/90 text-white';
    if (product.category === 'oils') return 'bg-gold/90 text-white';
    return 'bg-sage text-white';
  };

  const getBadgeText = () => {
    if (product.featured) return 'Featured';
    if (product.category === 'soaps') return 'Bestseller';
    if (product.category === 'scrubs') return 'New';
    if (product.category === 'oils') return 'Organic';
    return 'Popular';
  };

  if (variant === 'featured') {
    return (
      <Link href={`/product/${product.id}`} data-testid={`featured-product-${product.id}`}>
        <Card className="group bg-cream hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
          <div className="relative overflow-hidden rounded-t-lg">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              data-testid={`product-image-${product.id}`}
            />
            <Badge className={`absolute top-4 right-4 ${getBadgeVariant()}`}>
              {getBadgeText()}
            </Badge>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-playfair font-semibold text-forest mb-2" data-testid={`product-name-${product.id}`}>
              {product.name}
            </h3>
            {product.nameBengali && (
              <p className="text-sm text-sage mb-2" data-testid={`product-name-bengali-${product.id}`}>
                {product.namebengali}
              </p>
            )}
            <p className="text-gray-600 mb-4" data-testid={`product-description-${product.id}`}>
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-forest" data-testid={`product-price-${product.id}`}>
                ৳{product.price}
              </span>
              <Button 
                onClick={handleAddToCart}
                className="bg-sage hover:bg-forest text-white"
                disabled={isAdding}
                data-testid={`add-to-cart-${product.id}`}
              >
                {isAdding ? 'Added!' : 'Add to Cart'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.id}`} data-testid={`product-${product.id}`}>
      <Card className="group bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            data-testid={`product-image-${product.id}`}
          />
          <Badge className={`absolute top-3 right-3 ${getBadgeVariant()}`}>
            {getBadgeText()}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-forest mb-1" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3" data-testid={`product-description-${product.id}`}>
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-forest" data-testid={`product-price-${product.id}`}>
              ৳{product.price}
            </span>
            <Button 
              onClick={handleAddToCart}
              size="sm"
              className="bg-sage hover:bg-forest text-white"
              disabled={isAdding}
              data-testid={`add-to-cart-${product.id}`}
            >
              {isAdding ? 'Added!' : 'Add'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
