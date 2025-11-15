# Appointment Booking System - React Native

A cross-platform mobile application for booking appointments with hair salons, spas, and tutors.

## Features

### Customer Features
- User registration and authentication
- Browse services by category (Hair, Spa, Tutors)
- View provider details, ratings, and reviews
- Book appointments with multi-step flow (Service → Date → Time → Confirm)
- Manage bookings (view upcoming/past, cancel, rebook)
- Rate and review providers after appointments

### Provider Features
- Provider registration and profile management
- Manage services (create, edit, deactivate)
- Set availability (working days, blocked dates/times)
- View and manage bookings
- Accept/decline/complete bookings
- Dashboard with today's appointments

### Admin Features
- View all users, providers, and bookings
- Activate/deactivate users and providers
- Monitor system activity

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Date Handling**: date-fns

## Project Structure

```
appointment-booking-rn/
├── src/
│   ├── navigation/       # Navigation setup
│   ├── screens/          # All screen components
│   │   ├── auth/         # Login, Register, ForgotPassword
│   │   ├── customer/     # Customer-specific screens
│   │   ├── provider/     # Provider-specific screens
│   │   ├── admin/        # Admin screens
│   │   └── common/       # Shared screens (Profile, Splash)
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Basic UI components
│   │   ├── layout/       # Layout components
│   │   └── booking/      # Booking-specific components
│   ├── context/          # Context providers (Auth, User, Booking)
│   ├── services/         # API services
│   ├── models/           # TypeScript interfaces/types
│   ├── config/           # Configuration (theme, env)
│   ├── utils/            # Utility functions
│   └── hooks/            # Custom hooks
├── App.tsx               # Main app component
└── package.json
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure API base URL**:
   - Edit `src/config/env.ts` and update `apiBaseURL` with your backend URL

3. **Run the app**:
   ```bash
   npm start
   # Then press 'a' for Android or 'i' for iOS
   ```

## Configuration

### API Configuration
Update the base URL in `src/config/env.ts`:
```typescript
export const env = {
  apiBaseURL: 'http://your-backend-url/api',
  // ...
};
```

### Theme Customization
Modify colors, typography, and spacing in `src/config/theme.ts`.

## Backend Integration

The app is structured to work with a REST API backend. All API calls are centralized in the `src/services/` directory:

- `authApi.ts` - Authentication endpoints
- `bookingApi.ts` - Booking operations
- `providerApi.ts` - Provider data and services
- `adminApi.ts` - Admin operations

Currently, the API services use mock data. To connect to a real backend:

1. Update the API base URL in `src/config/env.ts`
2. Replace mock implementations in service files with actual API calls
3. Ensure your backend follows the expected request/response formats (see model files in `src/models/`)

## User Roles

- **CUSTOMER**: Can browse, book appointments, manage their bookings
- **PROVIDER**: Can manage services, availability, and bookings
- **ADMIN**: Can manage users, providers, and view all bookings

## Development Notes

- All API calls currently return mock data for development
- Form validation is handled by React Hook Form + Yup
- Navigation is type-safe using TypeScript
- The app uses React Context for state management
- Error handling and loading states are implemented throughout

## TODO

- [ ] Connect to real backend API
- [ ] Implement image upload for provider photos
- [ ] Add push notifications
- [ ] Implement reviews and ratings UI
- [ ] Add search functionality
- [ ] Add filters for providers
- [ ] Implement localization
- [ ] Add analytics
- [ ] Write unit tests

## License

Private project

