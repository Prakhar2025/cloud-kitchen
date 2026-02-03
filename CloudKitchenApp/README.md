# Cloud Kitchen Mobile App

> React Native mobile application for the Cloud Kitchen food delivery platform.

## Overview

This mobile app connects to the Laravel backend API to provide a seamless food ordering experience on iOS and Android devices.

## Tech Stack

- **React Native** with Expo
- **React Navigation** for routing
- **Axios** for API requests
- **AsyncStorage** for local data persistence
- **React Context** for state management

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)

### Installation

```bash
cd CloudKitchenApp
npm install
```

### Running the App

```bash
# Start development server
npx expo start

# For Android
npx expo start --android

# For iOS
npx expo start --ios
```

### Connecting to Backend

1. Start the Laravel server:
   ```bash
   cd ../cloud_kitchen_project
   php artisan serve
   ```

2. Update `src/utils/constants.js` with your API URL:
   - **Android Emulator:** `http://10.0.2.2:8000`
   - **iOS Simulator:** `http://localhost:8000`
   - **Physical Device:** `http://YOUR_COMPUTER_IP:8000`

---

## Project Structure

```
CloudKitchenApp/
├── App.js                  # App entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── src/
│   ├── api/
│   │   ├── client.js      # Axios instance
│   │   └── auth.js        # Auth API functions
│   ├── components/
│   │   ├── CustomInput.js # Reusable input
│   │   └── CustomButton.js# Reusable button
│   ├── context/
│   │   └── AuthContext.js # Auth state management
│   ├── screens/
│   │   └── Auth/
│   │       └── LoginScreen.js
│   ├── styles/
│   │   └── colors.js      # Color palette
│   └── utils/
│       ├── constants.js   # App config
│       ├── storage.js     # AsyncStorage wrapper
│       └── validation.js  # Form validation
```

---

## Features Implemented

### Authentication
- ✅ User login with email/password
- ✅ Secure token storage
- ✅ Auto-login on app restart
- ✅ Logout functionality

### UI/UX
- ✅ Premium login screen design
- ✅ Form validation with feedback
- ✅ Loading states
- ✅ Error handling
- ✅ Animations
- ✅ Password visibility toggle

---

## Upcoming Features

- [ ] User registration screen
- [ ] Forgot password flow
- [ ] Menu browsing
- [ ] Cart management
- [ ] Order placement
- [ ] Order tracking

---

## Troubleshooting

### Network Error on Physical Device
- Ensure phone and computer are on same WiFi
- Use computer's IP instead of localhost
- Check Windows Firewall allows port 8000

### Metro Bundler Issues
```bash
npx expo start --clear
```

### Dependencies Issues
```bash
rm -rf node_modules
npm install
```

---

## Development

### Color Palette

The app uses a warm, food-themed color palette:
- **Primary:** `#FF6B35` (Orange)
- **Success:** `#10B981` (Green)
- **Error:** `#EF4444` (Red)

See `src/styles/colors.js` for full palette.

### Adding New Screens

1. Create screen in `src/screens/`
2. Add to navigation in `App.js`
3. Use `useAuth()` hook for auth state

---

## License

MIT
