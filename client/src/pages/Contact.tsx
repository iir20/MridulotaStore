import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const submitContact = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest('POST', '/api/contacts', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate(formData);
  };

  const updateFormData = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="contact-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-sage/10 to-earth/10" data-testid="contact-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-playfair font-bold text-forest mb-6" data-testid="contact-title">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" data-testid="contact-subtitle">
              Have questions about our natural products? We'd love to hear from you. 
              Reach out and let's talk about natural skincare!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white" data-testid="contact-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8" data-testid="contact-info">
              <div>
                <h2 className="text-4xl font-playfair font-bold text-forest mb-4" data-testid="contact-info-title">
                  Contact Information
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We're here to help with any questions about our handmade natural products. 
                  Reach out through any of these channels.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4" data-testid="contact-phone">
                  <div className="bg-sage/10 p-3 rounded-full">
                    <Phone className="text-sage" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-forest">Phone</div>
                    <div className="text-gray-600">+880 1XXX-XXXXXX</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4" data-testid="contact-email">
                  <div className="bg-sage/10 p-3 rounded-full">
                    <Mail className="text-sage" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-forest">Email</div>
                    <div className="text-gray-600">hello@mridulota.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4" data-testid="contact-address">
                  <div className="bg-sage/10 p-3 rounded-full">
                    <MapPin className="text-sage" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-forest">Address</div>
                    <div className="text-gray-600">Dhaka, Bangladesh</div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <h3 className="font-semibold text-forest mb-4">Follow Us</h3>
                <div className="flex space-x-4" data-testid="social-links">
                  <a 
                    href="#" 
                    className="bg-sage/10 hover:bg-sage hover:text-white text-sage p-3 rounded-full transition-colors duration-200"
                    data-testid="social-facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="bg-sage/10 hover:bg-sage hover:text-white text-sage p-3 rounded-full transition-colors duration-200"
                    data-testid="social-instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="bg-sage/10 hover:bg-sage hover:text-white text-sage p-3 rounded-full transition-colors duration-200"
                    data-testid="social-whatsapp"
                  >
                    <MessageCircle size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-cream shadow-xl" data-testid="contact-form-card">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-forest">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-forest font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        className="mt-2 px-4 py-3 rounded-lg border border-gray-200 focus:border-sage focus:ring-1 focus:ring-sage focus:outline-none transition-colors"
                        required
                        data-testid="first-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-forest font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        className="mt-2 px-4 py-3 rounded-lg border border-gray-200 focus:border-sage focus:ring-1 focus:ring-sage focus:outline-none transition-colors"
                        required
                        data-testid="last-name-input"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-forest font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="mt-2 px-4 py-3 rounded-lg border border-gray-200 focus:border-sage focus:ring-1 focus:ring-sage focus:outline-none transition-colors"
                      required
                      data-testid="email-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-forest font-medium">
                      Phone (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="mt-2 px-4 py-3 rounded-lg border border-gray-200 focus:border-sage focus:ring-1 focus:ring-sage focus:outline-none transition-colors"
                      data-testid="phone-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-forest font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => updateFormData('message', e.target.value)}
                      className="mt-2 px-4 py-3 rounded-lg border border-gray-200 focus:border-sage focus:ring-1 focus:ring-sage focus:outline-none transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                      required
                      data-testid="message-input"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="w-full bg-sage hover:bg-forest text-white py-3 rounded-lg font-medium transition-colors duration-200"
                    data-testid="send-message-button"
                  >
                    {submitContact.isPending ? 'Sending Message...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
