import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { type Product } from '@shared/schema';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  const testimonials = [
    {
      id: '1',
      name: 'Rashida Ahmed',
      location: 'Dhaka',
      text: "The neem soap has completely transformed my skin. No more breakouts and my skin feels so soft and healthy. I'm never going back to commercial soaps!",
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c3d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
    },
    {
      id: '2',
      name: 'Farhan Khan',
      location: 'Chittagong',
      text: "I have very sensitive skin and most soaps irritate it. MRIDULOTA's aloe vera soap is so gentle and soothing. Perfect for my daily routine!",
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
    },
    {
      id: '3',
      name: 'Sania Rahman',
      location: 'Sylhet',
      text: "The turmeric soap gives my skin such a beautiful glow! I love that it's made with natural ingredients. The quality is outstanding and shipping was fast.",
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100'
    }
  ];

  return (
    <div className="min-h-screen bg-cream" data-testid="home-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage/10 to-earth/10 min-h-screen flex items-center" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-playfair font-bold text-forest leading-tight" data-testid="hero-title">
                  Nature's Purity,<br />
                  <span className="text-sage">Handmade</span> with Love
                </h1>
                <p className="text-lg text-gray-600 max-w-xl leading-relaxed" data-testid="hero-description">
                  Discover our collection of 100% natural, handcrafted soaps made with love and traditional Bengali wisdom. Each bar is a gentle embrace for your skin.
                </p>
                <div className="text-sm text-sage font-medium" data-testid="hero-tagline">
                  ১০০% প্রাকৃতিক • হাতে তৈরি • ভালোবাসায় মোড়ানো
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button 
                    size="lg"
                    className="bg-sage hover:bg-forest text-white px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                    data-testid="shop-collection-button"
                  >
                    Shop Our Collection
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-sage text-sage hover:bg-sage hover:text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
                    data-testid="learn-story-button"
                  >
                    Learn Our Story
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                alt="Natural handmade soaps with botanical elements" 
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                data-testid="hero-image"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-2xl font-playfair font-bold text-forest" data-testid="customer-count">500+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white" data-testid="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-forest mb-4" data-testid="featured-title">Featured Collection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked favorites crafted with premium natural ingredients and traditional care
            </p>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} variant="featured" />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button className="bg-forest hover:bg-sage text-white px-8 py-4 rounded-full font-medium" data-testid="view-all-products">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-sage/10 to-cream" data-testid="about-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-playfair font-bold text-forest" data-testid="about-title">About MRIDULOTA</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Born from ancient Bengali traditions and a passion for natural skincare, MRIDULOTA creates handmade soaps using time-honored recipes passed down through generations.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Each soap is carefully crafted with 100% natural ingredients, free from harsh chemicals and artificial fragrances.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center p-4 shadow-lg">
                  <CardContent className="p-2">
                    <div className="text-3xl font-playfair font-bold text-sage" data-testid="stat-natural">100%</div>
                    <div className="text-sm text-gray-600">Natural Ingredients</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-4 shadow-lg">
                  <CardContent className="p-2">
                    <div className="text-3xl font-playfair font-bold text-sage" data-testid="stat-customers">500+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-4 shadow-lg">
                  <CardContent className="p-2">
                    <div className="text-3xl font-playfair font-bold text-sage" data-testid="stat-recipes">50+</div>
                    <div className="text-sm text-gray-600">Natural Recipes</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-4 shadow-lg">
                  <CardContent className="p-2">
                    <div className="text-3xl font-playfair font-bold text-sage" data-testid="stat-rating">5★</div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Artisan crafting handmade soap" 
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                data-testid="about-image"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-sm text-sage font-medium mb-1">Handcrafted since</div>
                <div className="text-2xl font-playfair font-bold text-forest" data-testid="founding-year">2018</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white" data-testid="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-forest mb-4" data-testid="testimonials-title">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real stories from real people who love our natural soaps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-cream p-8 shadow-lg" data-testid={`testimonial-${testimonial.id}`}>
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed" data-testid={`testimonial-text-${testimonial.id}`}>
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={`${testimonial.name} testimonial`}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      data-testid={`testimonial-avatar-${testimonial.id}`}
                    />
                    <div>
                      <div className="font-semibold text-forest" data-testid={`testimonial-name-${testimonial.id}`}>
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500" data-testid={`testimonial-location-${testimonial.id}`}>
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
