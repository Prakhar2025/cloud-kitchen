# 🍳 Cloud Kitchen — Complete Developer Handoff

> **Purpose:** If the original developers are no longer available, this document gives any new developer everything they need to understand, run, maintain, and extend this project from zero.

---

## 📁 Repository Structure

```
cloud_kitchen_project/              ← Root repo (GitHub: kd-26-08-04/Cloud-Kitchen)
├── cloud_kitchen_project/          ← Laravel 10 Backend (PHP)
│   ├── app/
│   │   ├── Http/Controllers/Api/   ← All API controllers
│   │   ├── Models/                 ← Eloquent models
│   │   └── Notifications/          ← Email notifications
│   ├── database/migrations/        ← 25 migration files
│   ├── routes/
│   │   ├── api.php                 ← ALL mobile API routes (prefix: /api/v1)
│   │   └── web.php                 ← Admin/web routes
│   ├── resources/views/            ← Blade templates (admin panel)
│   ├── .env                        ← Environment config (DB, mail, etc.)
│   └── food-ordering (3).sql       ← Full database dump (use to restore DB)
│
└── CloudKitchenApp/                ← React Native + Expo Mobile App
    ├── App.js                      ← Main entry, navigation setup
    ├── app.json                    ← Expo config (package name, icons)
    ├── src/
    │   ├── api/                    ← All API call functions
    │   ├── context/                ← Global state (Auth, Cart)
    │   ├── screens/                ← All screens (Auth, User, Delivery)
    │   ├── components/             ← Reusable UI components
    │   └── styles/                 ← Colors, global styles
    └── assets/                     ← App icon, splash screen images
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 10, PHP 8.x |
| Auth | Laravel Sanctum (token-based) |
| Database | MySQL |
| Email | Gmail SMTP (via Laravel Mail) |
| Mobile App | React Native + Expo (SDK 51) |
| Navigation | React Navigation v6 (Stack + custom PagerView tabs) |
| HTTP Client | Axios (custom `apiClient` with interceptors) |
| Icons | Expo Vector Icons (Ionicons) |

---

## ⚙️ Local Development Setup

### Backend (Laravel)

**Requirements:** PHP 8.x, Composer, MySQL, XAMPP/WAMP

```bash
# 1. Navigate to backend folder
cd cloud_kitchen_project/cloud_kitchen_project

# 2. Install PHP dependencies
composer install

# 3. Copy and configure environment
cp .env.example .env

# 4. Generate app key
php artisan key:generate

# 5. Configure .env (see .env section below)

# 6. Run migrations
php artisan migrate

# 7. (Optional) Import existing data from SQL dump
#    Import: cloud_kitchen_project/food-ordering (3).sql
#    via phpMyAdmin or: mysql -u root food-ordering < "food-ordering (3).sql"

# 8. Start backend server
php artisan serve
# Runs at: http://127.0.0.1:8000
```

### Mobile App (React Native + Expo)

**Requirements:** Node.js 18+, npm, Expo Go app on phone

```bash
# 1. Navigate to mobile folder
cd cloud_kitchen_project/CloudKitchenApp

# 2. Install dependencies
npm install

# 3. Start Expo dev server
npx expo start

# 4. Scan QR code with Expo Go app
#    Make sure phone and PC are on SAME WiFi network
```

---

## 🔧 Environment File (`.env`)

Located at: `cloud_kitchen_project/cloud_kitchen_project/.env`

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:yF0ELxI/KxwZktySeMHdidV9nsgPTp+ABptuoB7PaMs=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=food-ordering
DB_USERNAME=root
DB_PASSWORD=

# Email (Gmail SMTP) — see SMTP section below
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD="xxxx xxxx xxxx xxxx"   ← 16-char Gmail App Password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="Cloud Kitchen"
```

> ⚠️ After any `.env` change, run: `php artisan config:clear`

---

## 📧 Gmail SMTP Setup (Forgot Password Emails)

The app sends password reset emails via Gmail SMTP.

### How to get a Gmail App Password:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. **Security** → enable **2-Step Verification** (mandatory)
3. Search **"App Passwords"** in the search bar
4. Select: App = **Mail**, Device = **Other** → name it "Cloud Kitchen"
5. Click **Generate** → copy the 16-character password
6. Paste it in `.env` as `MAIL_PASSWORD="abcd efgh ijkl mnop"`
7. Run `php artisan config:clear`

> 💡 If using a college email (Google Workspace), App Passwords may be disabled by the IT admin. Use a personal @gmail.com instead.

---

## 🗄️ Database

**Database name:** `food-ordering`  
**Migration files:** `cloud_kitchen_project/database/migrations/`

### Schema Overview

| Table | Purpose |
|-------|---------|
| `users` | Users with role (user/delivery), phone, is_approved, is_admin |
| `categories` | Food categories with image |
| `food_items` | Food items with price, type (veg/non-veg), is_available |
| `carts` | Cart items per user (food_item_id, quantity) |
| `orders` | Orders with status, payment info, address, delivery_boy_id |
| `order_items` | Line items for each order |
| `user_addresses` | Saved delivery addresses per user |
| `notifications` | User notifications |
| `ratings` | Food item ratings per order |
| `festival_banners` | Homepage hero banner images with date ranges |
| `category_special_banners` | Category-level banners |
| `personal_access_tokens` | Sanctum API tokens |
| `password_reset_tokens` | Laravel password reset tokens |

### Run all migrations fresh:
```bash
php artisan migrate
# or reset everything:
php artisan migrate:fresh
```

### Create Admin User (via Tinker):
```bash
php artisan tinker
# Then:
App\Models\User::where('email', 'your@email.com')->update(['role' => 'admin', 'is_admin' => true]);
```

---

## 🌐 API Endpoints

**Base URL:** `http://<PC_IP>:8000/api/v1`

> The mobile app auto-detects the IP using `Constants.expoConfig.hostUri`

### Public Endpoints (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login → returns Bearer token |
| POST | `/forgot-password` | Send password reset link to email |
| GET | `/user/menu` | Get menu (banners + categories + food items) — guests can access |
| GET | `/health` | API health check |

### Protected Endpoints (require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user` | Get current user profile |
| POST | `/logout` | Logout current device |
| POST | `/logout-all` | Logout all devices |
| GET | `/user/cart` | Get cart items |
| POST | `/user/cart/{id}/add` | Add food item to cart |
| POST | `/user/cart/{id}/decrease` | Decrease qty in cart |
| DELETE | `/user/cart/{id}` | Remove item from cart |
| GET | `/user/orders` | Get order history |
| POST | `/user/orders/place` | Place an order |
| POST | `/user/orders/{order}/cancel` | Cancel an order |
| POST | `/user/orders/{order}/rate` | Rate a food item in an order |
| GET | `/user/addresses` | Get saved addresses |
| POST | `/user/addresses` | Add new address |
| PUT | `/user/addresses/{address}` | Update address |
| DELETE | `/user/addresses/{address}` | Delete address |
| GET | `/user/notifications` | Get notifications |
| POST | `/user/notifications/mark-read` | Mark notifications as read |
| POST | `/user/profile/update` | Update profile name/phone |
| GET | `/delivery/dashboard` | Delivery boy dashboard |
| GET | `/delivery/history` | Delivery boy history |
| POST | `/delivery/orders/{id}/status` | Update order delivery status |
| POST | `/delivery/location` | Update delivery boy location |

### Registration Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "phone": "9876543210",
  "role": "user"
}
```
> `role` can be `"user"` or `"delivery"`. Delivery accounts need admin approval.

---

## 📱 Mobile App Screens

### Navigation Structure

```
App.js (NavigationContainer)
└── Stack Navigator
    ├── Main (UserTabs — PagerView swipe tabs)
    │   ├── Tab 0: MenuScreen        ← Homepage, banners, categories, food list
    │   ├── Tab 1: CartScreen        ← Cart items, total
    │   ├── Tab 2: OrdersScreen      ← Order history + live status
    │   ├── Tab 3: NotificationsScreen
    │   └── Tab 4: ProfileScreen     ← Profile info, addresses
    ├── Login                        ← Login form
    ├── SignUp                       ← Registration
    ├── ForgotPassword               ← Email input → sends reset link
    ├── CartConfirmation             ← Order review before checkout
    ├── Checkout                     ← Address selection + place order
    ├── Invoice                      ← Order invoice/receipt
    ├── OrderSuccess                 ← Post-order success screen
    ├── Category                     ← Food items in a category
    └── DeliveryMain (DeliveryTabs)  ← Only for role=delivery
        ├── Dashboard
        ├── History
        └── Profile
```

### Navigation Tip for Tabs (important!):
Tabs are inside a PagerView — navigate to a tab like this:
```js
navigation.navigate('Main', { tabIndex: 4 }); // Goes to Profile tab
```

### Guest Mode:
- App opens directly to Menu (no login required)
- Guests can browse food items and categories
- Guest tries to add to cart → alert prompts to login
- Visiting Cart, Orders, Profile, Notifications shows a `GuestPrompt` component

---

## 🗂️ Mobile App — Key Files

### API Functions (`src/api/`)

| File | Functions |
|------|-----------|
| `auth.js` | `login`, `register`, `logout`, `getUser`, `forgotPassword` |
| `user.js` | `getAddresses`, `addAddress`, `updateAddress`, `deleteAddress`, `updateProfile` |
| `menu.js` | `getMenu` — supports `?type=veg/non-veg` and `?search=` query params |
| `order.js` | `placeOrder`, `getOrders`, `cancelOrder`, `rateItem` |
| `cart.js` | `getCart`, `addToCart`, `decreaseItem`, `removeFromCart` |
| `client.js` | Axios instance — auto-adds Bearer token, logs all requests |

### Global State (`src/context/`)

| File | What it manages |
|------|----------------|
| `AuthContext.js` | `isAuthenticated`, `isGuest`, `user`, `token`, `login()`, `logout()`, `isLoading` |
| `CartContext.js` | `cartItems`, `cartCount`, `addItem()`, `removeItem()`, `toastMessage` |

### Important Notes:
- **Auto IP detection**: The API base URL is auto-set from `Constants.expoConfig.hostUri` (the Expo dev server IP). No manual IP changes needed.
- **Token storage**: Auth token is stored in `AsyncStorage` — persists across app restarts.
- **Cart toast**: Adding to cart shows a brief toast overlay (`toastMessage` in CartContext).

---

## 🎨 App Features (What Has Been Built)

### User Features
- ✅ Guest mode — browse menu without login
- ✅ Register / Login / Logout
- ✅ Forgot Password — sends reset link to email (opens in browser)
- ✅ Browse menu with festival banners carousel
- ✅ Veg / Non-Veg filter on menu (pill buttons)
- ✅ Category-based food browsing
- ✅ Search food items
- ✅ Food detail modal (photo, description, rating)
- ✅ Add to cart / Decrease / Remove
- ✅ Checkout with saved addresses
- ✅ Place order (COD)
- ✅ Order history with live status
- ✅ Cancel orders
- ✅ Rate food items per order
- ✅ Invoice screen
- ✅ Saved addresses (add, edit, delete)
- ✅ Edit profile (name, phone)
- ✅ Notifications

### Delivery Person Features
- ✅ Delivery Dashboard with assigned orders
- ✅ Update order delivery status
- ✅ Delivery history
- ✅ Location update endpoint

### Admin (Web Panel)
- ✅ Admin login at `/login`
- ✅ Manage orders
- ✅ Manage delivery requests / approvals
- ✅ Standard admin dashboard (Blade views)

---

## 📸 App Assets

| Asset | Location |
|-------|----------|
| App Icon | `CloudKitchenApp/assets/icon.png` |
| Splash Screen | `CloudKitchenApp/assets/splash.png` |
| Adaptive Icon | `CloudKitchenApp/assets/adaptive-icon.png` |
| App Config | `CloudKitchenApp/app.json` |

### App Identity (`app.json`):
```json
{
  "name": "CloudKitchenApp",
  "slug": "CloudKitchenApp",
  "android": {
    "package": "com.cloudkitchen.app"
  }
}
```

---

## 🔐 User Roles

| Role | Access |
|------|--------|
| `user` | Menu, Cart, Orders, Profile, Addresses |
| `delivery` | Delivery Dashboard — needs `is_approved = true` by admin |
| `admin` | Web admin panel (`is_admin = true` in DB) |

---

## 🚀 Building for Production (APK)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview

# OR build locally (requires Android Studio):
npx expo run:android --variant release
```

> ⚠️ Deep links (`cloudkitchen://`) only work in a real APK build, NOT in Expo Go.

---

## 🐛 Known Issues & Fixes Applied

| Issue | Root Cause | Fix Applied |
|-------|-----------|-------------|
| Address delete 500 error | Foreign key on `orders.address_id` → `user_addresses` | `AddressController::destroy()` now nullifies order references before delete |
| Admin login goes to user menu | Company's code defaulted all users `role = 'user'` | Use Tinker to manually set admin role |
| Missing role migration | Company shipped code without migration | Created `2026_03_06_170013_add_role_to_users_table.php` |
| Hooks error in AppNavigator | `useAuth()` called twice — second time inside JSX | Destructured `user` at top of component |
| "Profile" navigate error | Profile is a tab (PagerView), not a root Stack screen | Changed to `navigate('Main', { tabIndex: 4 })` |

---

## 🤝 Knowledge Transfer Contacts

| Person | Role | Contributed |
|--------|------|-------------|
| Prakhar Shukla | React Native Dev | Mobile app (all screens, guest mode, auth, cart, orders, delivery) |
| Other Dev | Backend Dev | Laravel API, admin panel, delivery dashboard |
| Anishree Technologies | Company | Backend updates (18 files — delivery, roles, approval system) |

---

## 📋 Git History — Key Commits

```
feat: forgot password (email reset link) + fix address delete 500 error
feat: add veg/non-veg filter pills to menu screen
fix: Rules of Hooks — remove duplicate useAuth() call in AppNavigator
fix: Profile navigation — use tabIndex instead of screen name
feat: guest mode — app opens to menu without login
```

---

## ❓ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| API 404 errors | Make sure `php artisan serve` is running |
| Mobile can't connect to backend | Phone and PC must be on same WiFi. Check IP in Expo console |
| Email not sending | Check `.env` MAIL_PASSWORD is a Gmail App Password (not login password). Run `php artisan config:clear` |
| DB column not found error | Run `php artisan migrate` to apply missing migrations |
| Login goes to wrong screen | Check user's `role` in DB. Fix with Tinker: `User::find(1)->update(['role'=>'user'])` |
| Expo "Something went wrong" | Press `r` to reload, or restart `npx expo start` |
| Cart badge not updating | Use `addItem()` from `CartContext`, not direct API call |
