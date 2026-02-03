# Cloud Kitchen System

A comprehensive food delivery platform featuring a Laravel Backend API and a React Native Mobile App.

## 📂 Project Structure

- **`cloud_kitchen_project/`** - Laravel 10 Backend API & Web Panel
- **`CloudKitchenApp/`** - React Native (Expo) Mobile Application

---

## 🚀 Quick Start Guide

### 1. Backend Setup (Laravel)

The backend must be running for the mobile app to work.

```powershell
cd cloud_kitchen_project
# Install dependencies (if not already installed)
composer install

# Run the server accessible to your network
php artisan serve --host=0.0.0.0
```

> **IMPORTANT:** usage of `--host=0.0.0.0` is critical! It allows the mobile app running on a physical device to access the API via your computer's IP address. Standard `localhost` will NOT work for the mobile app on a real phone.

### 2. Mobile App Setup (React Native / Expo)

```powershell
cd CloudKitchenApp
# Install dependencies
npm install

# Start the Expo development server
npx expo start --clear
```

Scan the QR code with the **Expo Go** app on your Android/iOS device.

---

## ⚠️ Troubleshooting & Known Issues

During development, we encountered and resolved the following issues. Reference this if you face similar problems.

### 1. "Network Error" on Physical Device
- **Issue:** Phone cannot connect to `localhost` or `127.0.0.1`.
- **Solution:**
    1. Update `src/utils/constants.js` to use your computer's local IP (e.g., `192.168.x.x`).
    2. Run Laravel with `php artisan serve --host=0.0.0.0`.
    3. Ensure both devices are on the same WiFi.

### 2. Expo SDK Windows Path Error (`mkdir 'node:sea'`)
- **Issue:** Expo SDK 50/51 has a bug on Windows where it tries to create a folder with a colon (`:`) in the name, which fails.
- **Solution:** We upgraded the project to **Expo SDK 54**, which fixes this issue.

### 3. OneDrive Permission / SSL Errors
- **Issue:** `EPERM` errors when running `npm install` inside a OneDrive-synced folder, or SSL cipher errors on some networks.
- **Solution:**
    - Use `npm config set strict-ssl false` if sticking with OneDrive.
    - Ideally, move the project folder outside of OneDrive (e.g., `C:\Projects`) to avoid file locking issues.

### 4. "Invalid Credentials" (401 Error)
- **Issue:** Logging in with a plain-text password failed because Laravel hashes passwords.
- **Solution:** Ensure you use a valid user from the local database. If manually creating a user in DB, ensure the password is bcrypt hashed.

---

## 📱 Mobile App Features
- **User Authentication** (Login, Logout, Auto-login)
- **Secure Token Storage** (Sanctum + AsyncStorage)
- **Error Handling** (Global API interceptors)
- **Premium UI** (Animations, Loading states, Food delivery theme)

## 🔧 Backend Features
- **API Versioning** (`/api/v1`)
- **Sanctum Authentication**
- **Mobile-friendly CORS** configuration
- **Shared Database** for Web and Mobile

---

## 👨‍💻 Developer Notes
This repository was initialized to consolidate the entire system.
- **Remote:** `https://github.com/kd-26-08-04/Cloud-Kitchen`
- **Branch:** `main`

To push updates:
```powershell
git add .
git commit -m "Update description"
git push
```
