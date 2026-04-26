# BookEase Client Website

A modern, responsive client website for the BookEase booking platform built with React, Tailwind CSS, and Vite.

## Features

- **Responsive Design**: Fully responsive design that works on all devices
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Service Booking**: Complete booking flow with business selection, service selection, and appointment scheduling
- **Business Directory**: Browse and search through available businesses and their services
- **Real-time Availability**: Check available time slots for appointments
- **Contact Forms**: Contact forms with validation and toast notifications
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server
- **React DatePicker**: Date selection component
- **React Hot Toast**: Toast notifications
- **Lucide React**: Modern icon library

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Navbar.jsx
│       └── Footer.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── ServicesPage.jsx
│   ├── BookingPage.jsx
│   ├── ContactPage.jsx
│   └── AboutPage.jsx
├── hooks/
│   └── useApi.js
├── lib/
│   └── api.js
├── utils/
│   └── index.js
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the web directory:
   ```bash
   cd apps/web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Integration

The client website integrates with the BookEase backend API. The API client is configured in `src/lib/api.js` and includes:

- Business listing and details
- Service management
- Staff information
- Booking creation
- Available time slots

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Key Components

### Pages

- **HomePage**: Landing page with hero section, features, and business showcase
- **ServicesPage**: Business and service browsing with search functionality
- **BookingPage**: Complete booking flow with form validation
- **ContactPage**: Contact form and company information
- **AboutPage**: Company story, values, and team information

### Layout Components

- **Navbar**: Responsive navigation with mobile menu
- **Footer**: Company information and links

### Hooks

- **useBusinesses**: Fetch and manage business data
- **useServices**: Fetch services for a specific business
- **useStaff**: Fetch staff for a specific business
- **useAvailableSlots**: Get available time slots for booking

### Utilities

- Currency formatting
- Date and time formatting
- Form validation helpers
- Debounce function

## Responsive Design

The website is fully responsive and optimized for:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and structure
2. Use meaningful commit messages
3. Test on multiple devices and browsers
4. Ensure responsive design works correctly

## License

This project is part of the BookEase platform. See the main project README for licensing information.