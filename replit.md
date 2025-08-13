# MRIDULOTA - Natural Handmade Soaps & Skincare E-commerce

## Overview

MRIDULOTA is a production-ready full-stack e-commerce web application for selling natural handmade soaps and skincare products. The application showcases Bengali heritage and traditional skincare wisdom through a modern, responsive web interface. Built as a React SPA with an Express backend, it provides a complete shopping experience with enterprise-grade features including JWT authentication, comprehensive admin dashboard, phone verification for cash-on-delivery orders, professional logging, and deployment readiness across multiple platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA with TypeScript**: Single-page application using React 18 with full TypeScript support
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **State Management**: 
  - React Query (TanStack Query) for server state management and API caching
  - Context API for cart state management
  - Local component state for UI interactions
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent, accessible design
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

### Backend Architecture
- **Express.js REST API**: Production-ready Node.js server with comprehensive RESTful endpoints
- **JWT Authentication System**: Secure token-based authentication with session management
- **Database Storage**: Drizzle ORM with PostgreSQL for production data persistence
- **Security Middleware**: Helmet protection, rate limiting, compression, and request validation
- **Professional Logging**: Structured logging with security and business event tracking
- **Phone Verification**: SMS-based verification system for cash-on-delivery orders

### Data Layer
- **Schema Definition**: Centralized schema using Drizzle ORM with Zod validation
- **Database Tables**: Users, products, orders, contacts, and newsletter subscriptions
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Storage Abstraction**: IStorage interface allows switching between in-memory and database storage

### Build and Development
- **Vite Build System**: Fast development server with HMR and optimized production builds
- **TypeScript Configuration**: Strict type checking with path aliases for clean imports
- **Development Tools**: Replit integration with runtime error overlays and development banners
- **Asset Management**: Static asset serving with proper caching and optimization

### Styling and Design
- **Design System**: Custom color palette reflecting natural/organic brand identity
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Typography**: Google Fonts integration (Playfair Display for headings, Inter for body)
- **Component Library**: Comprehensive UI components from shadcn/ui with custom theming

### E-commerce Features
- **Product Management**: Full CRUD operations with admin dashboard for comprehensive product management
- **Shopping Cart**: Persistent cart state with real-time synchronization
- **Order Processing**: Advanced order management with phone verification for cash-on-delivery
- **Admin Dashboard**: Comprehensive administrative interface with role-based access control
- **Security Features**: Rate limiting, authentication middleware, and security event logging
- **Phone Verification**: Automated SMS verification for cash-on-delivery orders
- **Real-time Updates**: Optimized state management with minimal UI animations

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for frontend framework and state management
- **Express.js**: Web application framework for Node.js backend API
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Build tool and development server with HMR capabilities

### Database and ORM
- **Drizzle ORM**: Type-safe SQL toolkit and query builder
- **@neondatabase/serverless**: Serverless PostgreSQL driver for production deployment
- **drizzle-zod**: Integration between Drizzle and Zod for schema validation

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Headless UI component primitives for accessibility
- **shadcn/ui**: Pre-built accessible component library
- **Lucide React**: Icon library for consistent iconography

### Form and Validation
- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Development and Tooling
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **@replit/vite-plugin-***: Replit-specific development tools and integrations

### Production Services
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Connect PG Simple**: PostgreSQL session store for Express sessions
- **Date-fns**: Date manipulation and formatting utilities

### Optional Integrations
- **Social Media APIs**: Ready for Facebook, Instagram, WhatsApp integration
- **Payment Processing**: Architecture supports Stripe, PayPal, or local payment gateways
- **Email Services**: Prepared for transactional email integration (SendGrid, Mailgun)
- **Image Storage**: Can integrate with Cloudinary or AWS S3 for product images