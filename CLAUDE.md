# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Build for production 
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Installation
- `npm i` - Install dependencies

## Architecture Overview

This is a **banking transfer simulation application** built with React, TypeScript, and Supabase. It simulates various banking interfaces for transfers and financial reporting.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components + Tailwind CSS
- **Backend**: Supabase (authentication, database)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM

### Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── SecurityBadge.tsx   # Security indicator component
│   └── PasswordStrengthIndicator.tsx
├── hooks/
│   ├── useAuth.tsx         # Authentication context and hooks
│   ├── useTransferHistory.tsx  # Transfer history management
│   └── use-mobile.tsx
├── pages/                  # Route components
│   ├── Index.tsx           # Main transfer form page
│   ├── Auth.tsx           # Login/registration page
│   ├── TransferHistory.tsx # Transfer history page
│   ├── TransferLoading.tsx # Transfer progress simulation
│   ├── MaybankTransfer.tsx # Maybank-specific interface
│   ├── CTOSReport.tsx     # Credit reporting interface
│   └── NotFound.tsx
├── integrations/supabase/  # Supabase client and types
├── utils/                  # Utility functions (security, sanitization)
└── lib/                   # Shared utilities
```

### Key Application Features

**Transfer Simulation**: The core feature allows users to simulate bank transfers with various Malaysian banks, including:
- Form-based transfer creation with bank selection
- Real-time transfer progress simulation 
- Transfer history tracking
- Bank-specific interfaces (Maybank)

**Authentication System**: 
- Built with Supabase Auth
- Email/password registration and login
- Session persistence and state management
- User profile management

**Security Focus**:
- Input sanitization utilities in `src/utils/`
- Password strength validation
- Security configuration management
- CSRF protection considerations

### Database Schema

The application uses Supabase with the following key entities:
- `profiles` - User profile information
- Transfer history and transaction records (managed through React Query)

### Component Architecture

- **UI Components**: shadcn/ui provides the component library foundation
- **Custom Components**: Security-focused components like `SecurityBadge` and `PasswordStrengthIndicator`
- **Page Components**: Each route is handled by a dedicated page component
- **Hooks**: Custom hooks manage authentication state and transfer history

### Development Notes

- **Path Aliases**: `@/` maps to `src/` directory 
- **TypeScript Configuration**: Relaxed settings (no strict null checks, no unused parameters warnings)
- **Vite Configuration**: Development server runs on port 8080, includes Lovable tagger for development mode
- **Supabase Integration**: Pre-configured client with localStorage session persistence

### Security Considerations

This application includes several security utilities and components:
- Input sanitization functions
- Security configuration management  
- Authentication state protection
- Secure session handling

The codebase demonstrates security-conscious development practices with dedicated utilities for input validation and sanitization.