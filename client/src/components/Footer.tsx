import { Link } from 'wouter';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-playfair font-bold">MRIDULOTA</h3>
              <p className="text-sm text-sage">মৃদুলতা</p>
            </div>
            <p className="text-sage text-sm">
              Handcrafted natural soaps made with love, tradition, and the finest organic ingredients from Bangladesh.
            </p>
            <div className="text-xs text-sage">
              ১০০% প্রাকৃতিক • হাতে তৈরি • পরিবেশবান্ধব
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sage">
              <li><Link href="/" className="hover:text-white transition-colors" data-testid="footer-home">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors" data-testid="footer-shop">Shop</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors" data-testid="footer-about">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors" data-testid="footer-contact">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sage">
              <li><Link href="/shop?category=soaps" className="hover:text-white transition-colors" data-testid="footer-soaps">Natural Soaps</Link></li>
              <li><Link href="/shop?category=scrubs" className="hover:text-white transition-colors" data-testid="footer-scrubs">Body Scrubs</Link></li>
              <li><Link href="/shop?category=oils" className="hover:text-white transition-colors" data-testid="footer-oils">Essential Oils</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-2 text-sage text-sm">
              <p data-testid="footer-email">hello@mridulota.com</p>
              <p data-testid="footer-phone">+880 1XXX-XXXXXX</p>
              <p data-testid="footer-address">Dhaka, Bangladesh</p>
            </div>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="bg-sage/20 hover:bg-sage text-sage hover:text-white p-2 rounded-full transition-all duration-200" data-testid="social-facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="bg-sage/20 hover:bg-sage text-sage hover:text-white p-2 rounded-full transition-all duration-200" data-testid="social-instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="bg-sage/20 hover:bg-sage text-sage hover:text-white p-2 rounded-full transition-all duration-200" data-testid="social-whatsapp">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-sage/30 mt-12 pt-8 text-center text-sage text-sm">
          <p>&copy; 2024 MRIDULOTA. All rights reserved. | Made with ❤️ for natural skincare lovers.</p>
        </div>
      </div>
    </footer>
  );
}
