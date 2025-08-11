# MRIDULOTA - Natural Handmade Soaps & Skincare E-commerce

## Overview

MRIDULOTA is a full-stack e-commerce web application for selling natural handmade soaps and skincare products. The application showcases Bengali heritage and traditional skincare wisdom through a modern, responsive web interface. Built as a React SPA with an Express backend, it provides a complete shopping experience including product catalog, cart functionality, order management, and administrative features.

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
- **Express.js REST API**: Node.js server providing RESTful endpoints for products, orders, contacts, and newsletter
- **In-Memory Storage**: MemStorage class implementing IStorage interface for development/demo purposes
- **Database Ready**: Drizzle ORM configured with PostgreSQL schema, ready for production database integration
- **Middleware Stack**: JSON parsing, URL encoding, request logging, and error handling

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
- **Product Management**: Full CRUD operations for products with categories, images, and metadata
- **Shopping Cart**: Persistent cart state with add/remove/update quantity functionality  
- **Order Processing**: Customer order creation with form validation and email notifications
- **Content Management**: Newsletter subscriptions and contact form submissions
- **Admin Interface**: Administrative dashboard for managing products, orders, and customer communications

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