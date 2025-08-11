import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-cream" data-testid="about-page">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-sage/10 to-earth/10" data-testid="about-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-playfair font-bold text-forest mb-6" data-testid="about-title">
              About MRIDULOTA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" data-testid="about-subtitle">
              মৃদুলতা - Where Ancient Wisdom Meets Modern Skincare
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white" data-testid="our-story">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-playfair font-bold text-forest mb-6" data-testid="story-title">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed" data-testid="story-paragraph-1">
                Born from the rich tradition of Bengali heritage and a deep love for natural skincare, MRIDULOTA began as a dream to bring the purest, most gentle care to modern lives. Our name, মৃদুলতা, means "gentleness" in Bengali - a perfect reflection of our approach to skincare.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed" data-testid="story-paragraph-2">
                Founded in 2018, we started with a simple mission: to create handmade soaps using time-honored recipes passed down through generations of Bengali women. Each bar is crafted with love, patience, and the finest natural ingredients sourced from local farmers and trusted suppliers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed" data-testid="story-paragraph-3">
                What began in a small kitchen has grown into a trusted brand, but we never forget our roots. Every product we make honors the traditional methods while meeting the highest standards of quality and purity.
              </p>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Traditional soap making process" 
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
                data-testid="story-image"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-sm text-sage font-medium mb-1">Handcrafting since</div>
                <div className="text-3xl font-playfair font-bold text-forest" data-testid="founding-year">2018</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-gradient-to-br from-sage/10 to-cream" data-testid="our-mission">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-forest mb-6" data-testid="mission-title">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" data-testid="mission-description">
              To bring the gentleness of nature to your daily skincare routine through handcrafted products that honor tradition while embracing sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="mission-card-1">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-forest">100% Natural</h3>
                <p className="text-gray-600">
                  We use only the finest natural ingredients, free from harsh chemicals and artificial additives.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="mission-card-2">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤲</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-forest">Handcrafted</h3>
                <p className="text-gray-600">
                  Every product is lovingly handmade in small batches to ensure the highest quality and freshness.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="mission-card-3">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-forest">Sustainable</h3>
                <p className="text-gray-600">
                  We're committed to eco-friendly practices, from sourcing to packaging, protecting our planet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white" data-testid="our-values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Natural ingredients used in soap making" 
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                data-testid="values-image"
              />
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-4xl font-playfair font-bold text-forest mb-6" data-testid="values-title">Our Values</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-sage pl-6" data-testid="value-1">
                  <h3 className="text-xl font-semibold text-forest mb-2">Purity First</h3>
                  <p className="text-gray-600">
                    We believe in the power of pure, natural ingredients. No compromises, no shortcuts - just nature's best.
                  </p>
                </div>

                <div className="border-l-4 border-sage pl-6" data-testid="value-2">
                  <h3 className="text-xl font-semibold text-forest mb-2">Traditional Wisdom</h3>
                  <p className="text-gray-600">
                    Our recipes honor centuries-old Bengali traditions, combining ancient knowledge with modern safety standards.
                  </p>
                </div>

                <div className="border-l-4 border-sage pl-6" data-testid="value-3">
                  <h3 className="text-xl font-semibold text-forest mb-2">Community Care</h3>
                  <p className="text-gray-600">
                    We support local farmers and artisans, building stronger communities while creating exceptional products.
                  </p>
                </div>

                <div className="border-l-4 border-sage pl-6" data-testid="value-4">
                  <h3 className="text-xl font-semibold text-forest mb-2">Environmental Responsibility</h3>
                  <p className="text-gray-600">
                    From biodegradable packaging to sustainable sourcing, we're committed to protecting our planet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-forest text-white" data-testid="statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-4" data-testid="stats-title">Our Impact</h2>
            <p className="text-lg text-sage">
              Numbers that reflect our commitment to natural skincare
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-customers">
              <div className="text-4xl font-playfair font-bold text-sage mb-2">500+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div data-testid="stat-products">
              <div className="text-4xl font-playfair font-bold text-sage mb-2">50+</div>
              <div className="text-sm">Natural Recipes</div>
            </div>
            <div data-testid="stat-ingredients">
              <div className="text-4xl font-playfair font-bold text-sage mb-2">100%</div>
              <div className="text-sm">Natural Ingredients</div>
            </div>
            <div data-testid="stat-rating">
              <div className="text-4xl font-playfair font-bold text-sage mb-2">5★</div>
              <div className="text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
