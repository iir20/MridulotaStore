import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const subscribeToNewsletter = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest('POST', '/api/newsletter', { email });
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeToNewsletter.mutate(email);
  };

  return (
    <section className="py-20 bg-forest text-white" data-testid="newsletter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-playfair font-bold mb-4">Stay Connected with Nature</h2>
        <p className="text-lg mb-8 text-sage opacity-90">
          Subscribe to receive skincare tips, new product launches, and exclusive offers
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto" data-testid="newsletter-form">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-full text-charcoal focus:outline-none focus:ring-2 focus:ring-sage"
              required
              data-testid="newsletter-email-input"
            />
            <Button 
              type="submit"
              disabled={subscribeToNewsletter.isPending}
              className="bg-sage hover:bg-cream hover:text-forest text-white px-8 py-4 rounded-full font-medium transition-colors duration-200"
              data-testid="newsletter-submit"
            >
              {subscribeToNewsletter.isPending ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
        </form>

        <p className="text-sm text-sage opacity-70 mt-4">
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
