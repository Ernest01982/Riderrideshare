# RideFlow - Ride Sharing App Frontend

A modern, accessible ride-sharing and package delivery web application built with React, TypeScript, and Tailwind CSS.

## Features

- **Ride Booking**: Request rides with real-time driver tracking
- **Package Delivery**: Send packages with size options and contact details
- **Real-time Updates**: Live trip status and driver location updates
- **Google Maps Integration**: Accurate distance and ETA calculations
- **Supabase Backend**: Real-time database and edge functions

## Code Quality & Standards

This application follows modern web development best practices:

### ✅ **Accessibility (WCAG 2.1 AA)**
- Screen reader support with proper ARIA labels
- Keyboard navigation for all interactive elements
- High contrast mode support
- Reduced motion preferences respected
- Semantic HTML structure

### ✅ **Performance Optimizations**
- Request timeout handling (10s for API calls)
- Debounced user inputs (300ms)
- Memory leak prevention with cleanup functions
- Error boundaries for graceful error handling
- Efficient re-rendering with proper dependencies

### ✅ **Security Features**
- Environment variable validation
- XSS prevention through React's built-in escaping
- Secure API calls through Supabase Edge Functions
- Input sanitization and validation

### ✅ **Error Handling**
- Global error boundaries
- Network request timeouts
- Graceful API failure handling
- User-friendly error messages
- Comprehensive logging for debugging

### ✅ **Mobile Responsiveness**
- Mobile-first design approach
- Touch-friendly interface elements
- Responsive breakpoints for all screen sizes
- Optimized for both portrait and landscape modes

## Environment Setup

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_browser_api_key
VITE_USE_DEV_DISTANCE_JS=false
```

## Google Maps Integration

The app supports both server-side (via Supabase Edge Functions) and client-side Google Maps integration:

1. **Server-side (Recommended)**: Uses Supabase Edge Functions for secure API calls
2. **Client-side (Development)**: Uncomment the Google Maps script in `index.html` and set `VITE_USE_DEV_DISTANCE_JS=true`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables in `.env`

3. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database + Edge Functions + Real-time)
- **Maps**: Google Maps API (Distance Matrix + Places Autocomplete)
- **State Management**: React Context for quote management
- **Real-time**: Supabase real-time subscriptions
