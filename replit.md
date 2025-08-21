# Overview

This project is a reverse auction marketplace platform called "AppelsPro" built with React, Express.js, and TypeScript. The platform allows clients to post projects/missions and service providers to submit competitive bids. The core concept is an inverted bidding system where clients describe their needs and providers compete by offering their prices and services in response.

The application supports both individuals and businesses as clients, with service providers able to browse and bid on available projects. Key features include mission creation, bid submission, user authentication, and a comprehensive marketplace interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui components for consistent design
- **Styling**: TailwindCSS with CSS variables for theming and responsive design
- **Authentication**: Context-based auth provider with localStorage persistence

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured error handling
- **Session Management**: Express middleware for request logging and error handling
- **Development**: Hot reload with Vite integration for seamless development experience

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Session Storage**: PostgreSQL-based session store with connect-pg-simple

## Authentication and Authorization
- **Strategy**: Simple email/password authentication with server-side validation
- **User Types**: Role-based system supporting 'client' and 'provider' user types
- **Session Management**: JWT-less approach using server sessions and localStorage
- **Security**: Password validation and email uniqueness constraints

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Schema validation integration
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router

### UI and Design
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe CSS class variance management

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **tsx**: TypeScript execution for server development

### Form Management
- **react-hook-form**: Performant form handling
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library

The architecture follows a modern full-stack pattern with clear separation between client and server concerns, using established libraries for reliability and developer experience.