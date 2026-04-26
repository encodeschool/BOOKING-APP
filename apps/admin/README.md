# Admin App

Responsive React + Tailwind admin UI for the booking platform.

## Run

1. Install dependencies with `npm install`
2. Start the app with `npm run dev`
3. Optionally create `.env` from `.env.example`

## API Base URL

Default:

`http://localhost:8080`

Override with:

`VITE_API_BASE_URL`

## Backend Endpoints

- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/businesses`
- `POST /api/businesses`
- `GET /api/services/business/{businessId}`
- `POST /api/services`
- `GET /api/staff/business/{businessId}`
- `POST /api/staff`
- `GET /api/working-hours/{businessId}`
- `POST /api/working-hours`
- `GET /api/bookings/business/{businessId}`
- `PATCH /api/bookings/{bookingId}/status`
