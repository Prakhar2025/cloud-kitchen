# Cloud Kitchen - Project Documentation

## 1. Project Overview
Cloud Kitchen is a comprehensive food ordering and management system featuring a centralized Laravel-based backend and multiple front-end applications. The project is divided into three main components:
1. **Admin Panel (Laravel Blade)**
2. **Web App (Laravel Blade)**
3. **Mobile App (React Native / Expo)**

---

## 2. Component Clarification

### 🍔 Web App (User Facing)
- Built using Laravel Blade templating.
- Allows users to browse categories, view food items, add items to the cart, manage addresses, and checkout.
- Accessible via the root URL (`/`) on the backend server.

### 🛡️ Admin Panel
- Built using Laravel Blade templating.
- Accessible by authenticated administrators via `/admin/dashboard`.
- **Features:** 
  - Manage Food Categories and Food Items (CRUD operations).
  - Manage customer Orders and update statuses.
  - Manage Festival Banners displayed on the user interfaces.
  - Generate Weekly, Monthly, and Yearly Reports and download them as PDFs.

### 📱 Mobile App (React Native / Expo)
- Built using React Native and Expo (`CloudKitchenApp` folder).
- Connects to the Laravel Backend using REST APIs.
- Features bottom-tab navigation with swipeable tabs (WhatsApp style).
- **Features:**
  - Guest access to browse the Menu without logging in.
  - Authentication (Login / Register).
  - Cart management, Order placement, Order tracking, Notifications, and Profile management.

---

## 3. Execution Commands

### Backend (Laravel) - `cloud_kitchen_project`
Navigate to the `cloud_kitchen_project` directory before running these:
```bash
# 1. Install dependencies (if setting up fresh)
composer install
npm install && npm run build

# 2. Set up environment
cp .env.example .env
php artisan key:generate

# 3. Database & Storage
php artisan migrate --seed
php artisan storage:link

# 4. Start the Server (Important: accessible to mobile app via local network)
php artisan serve --host=0.0.0.0

# 5. Clear Cache (if you encounter issues)
php artisan optimize:clear
```

### Mobile App (Expo) - `CloudKitchenApp`
Navigate to the `CloudKitchenApp` directory before running these:
```bash
# 1. Install dependencies
npm install

# 2. Start the Expo development server
npx expo start
```

---

## 4. Mobile App Build Commands

To build the React Native / Expo application for production or sharing, you must have the **EAS CLI** installed globally (`npm install -g eas-cli`).

```bash
# Login to your Expo account
eas login

# Configure EAS (if not already done)
eas build:configure

# 📦 Build APK File (For direct installation on Android devices)
# Make sure your eas.json has a "preview" profile with "buildType": "apk"
eas build -p android --profile preview

# 🎯 Build AAB File (For Google Play Store submission)
eas build -p android

# 💻 Local Development Build (Requires Android Studio and Java installed locally)
npx expo run:android
```

---

## 5. API Reference Guide

All API routes use the `/api/v1` prefix. Accessing protected endpoints requires passing a Bearer token in the `Authorization` header (`Authorization: Bearer <token>`).

### Public Routes (No Auth Required)
| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/register` | `POST` | Create a new user account. |
| `/api/v1/login` | `POST` | Authenticate and retrieve access token. |
| `/api/v1/user/menu` | `GET` | Fetch all categories, food items, and banners for the home screen. |
| `/api/health` | `GET` | API health check ping. Returns status 'ok'. |

### Protected Routes (Auth Required)
| Endpoint | Method | Description |
|---|---|---|
| **Authentication & Profile** | | |
| `/api/v1/user` | `GET` | Get current authenticated user details. |
| `/api/v1/logout` | `POST` | Revoke the current access token. |
| `/api/v1/logout-all` | `POST` | Revoke tokens from all logged-in devices. |
| `/api/v1/user/profile/update` | `POST` | Update user profile details (Name, etc). |
| **Cart** | | |
| `/api/v1/user/cart` | `GET` | Fetch items currently in the user's cart. |
| `/api/v1/user/cart/{id}/add` | `POST` | Add item or increase quantity in the cart. |
| `/api/v1/user/cart/{id}/decrease`| `POST` | Decrease quantity of an item. |
| `/api/v1/user/cart/{id}` | `DELETE`| Remove a food item completely from cart. |
| **Orders** | | |
| `/api/v1/user/orders` | `GET` | Fetch user's order history. |
| `/api/v1/user/orders/place` | `POST` | Checkout and place a new order. |
| `/api/v1/user/orders/{order}/cancel`| `POST` | Cancel a pending order. |
| `/api/v1/user/orders/{order}/rate` | `POST` | Rate a completed order. |
| **Addresses** | | |
| `/api/v1/user/addresses` | `GET` | Get saved delivery addresses. |
| `/api/v1/user/addresses` | `POST` | Save a new delivery address. |
| `/api/v1/user/addresses/{address}`| `PUT` | Update an existing delivery address. |
| `/api/v1/user/addresses/{address}`| `DELETE`| Delete a saved delivery address. |
| **Notifications** | | |
| `/api/v1/user/notifications` | `GET` | Get user notifications (e.g., order status). |
| `/api/v1/user/notifications/mark-read`| `POST` | Mark notifications as read. |

--- 

*Generated comprehensively to cover backend, web, admin, API, and mobile app architecture.*
