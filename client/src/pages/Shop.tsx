import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type Product } from '@shared/schema';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Shop() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const categories = [
    { id: 'all', name: 'All Products', count: products?.length || 0 },
    { id: 'soaps', name: 'Soaps', count: products?.filter(p => p.category === 'soaps').length || 0 },
    { id: 'scrubs', name: 'Scrubs', count: products?.filter(p => p.category === 'scrubs').length || 0 },
    { id: 'oils', name: 'Oils', count: products?.filter(p => p.category === 'oils').length || 0 },
  ];

  const filteredProducts = products?.filter(product => 
    activeFilter === 'all' || product.category === activeFilter
  ) || [];

  return (
    <div className="min-h-screen bg-cream" data-testid="shop-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-cream to-sage/10" data-testid="shop-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-playfair font-bold text-forest mb-4" data-testid="shop-title">Our Complete Collection</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Explore our full range of handmade natural products, each crafted with care and traditional wisdom
            </p>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12" data-testid="category-filters">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                    activeFilter === category.id
                      ? 'bg-sage text-white'
                      : 'bg-white text-sage hover:bg-sage hover:text-white border-sage'
                  }`}
                  data-testid={`filter-${category.id}`}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-20" data-testid="products-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16" data-testid="no-products">
              <h3 className="text-2xl font-playfair font-bold text-forest mb-4">No products found</h3>
              <p className="text-gray-600 mb-8">Try selecting a different category or check back later for new arrivals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
