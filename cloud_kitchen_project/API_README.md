# Cloud Kitchen API - Backend Setup Guide

> Production-grade API authentication for mobile applications using Laravel Sanctum.

## Overview

This API layer enables the existing Laravel web application to serve **both web and mobile clients** using the same database and backend infrastructure.

**Base URL:** `http://your-server:8000/api/v1`

---

## Prerequisites

- PHP 8.1+
- Composer
- MySQL with `food-ordering` database
- Laravel 10.x (already installed)
- Laravel Sanctum (already installed)

---

## Quick Start

### 1. Start the Laravel Server

```powershell
cd c:\Users\prakh\OneDrive\Desktop\cloud_kitchen_project\cloud_kitchen_project
php artisan serve
```

Server will run at: `http://127.0.0.1:8000`

### 2. Verify API is Running

```powershell
curl http://127.0.0.1:8000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-03T10:00:00.000000Z",
  "version": "v1"
}
```

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/v1/register` | ❌ No | Register new user |
| `POST` | `/api/v1/login` | ❌ No | Login and get token |
| `POST` | `/api/v1/logout` | ✅ Yes | Logout (revoke token) |
| `POST` | `/api/v1/logout-all` | ✅ Yes | Logout all devices |
| `GET` | `/api/v1/user` | ✅ Yes | Get authenticated user |

---

## Example Requests

### Register a New User

```bash
curl -X POST http://127.0.0.1:8000/api/v1/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "password_confirmation": "SecurePass123"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-02-03T10:00:00.000000Z"
    },
    "token": "1|abc123xyz...",
    "token_type": "Bearer"
  }
}
```

### Login

```bash
curl -X POST http://127.0.0.1:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "is_admin": false,
      "email_verified_at": null,
      "created_at": "2026-02-03T10:00:00.000000Z"
    },
    "token": "2|xyz789abc...",
    "token_type": "Bearer"
  }
}
```

### Get Authenticated User

```bash
curl -X GET http://127.0.0.1:8000/api/v1/user \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Logout

```bash
curl -X POST http://127.0.0.1:8000/api/v1/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Error Responses

### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["Password must be at least 8 characters."]
  }
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Invalid credentials. Please check your email and password."
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "An error occurred. Please try again later."
}
```

---

## Mobile App Configuration

For React Native / Expo apps connecting to this API:

### Android Emulator
```javascript
const API_BASE_URL = 'http://10.0.2.2:8000';
```

### iOS Simulator
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

### Physical Device (same network)
```javascript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000';
```

Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

---

## Files Created/Modified

### New Files
- `app/Http/Controllers/Api/AuthController.php` - API authentication controller

### Modified Files
- `routes/api.php` - API routes with v1 prefix
- `config/cors.php` - Mobile-friendly CORS configuration

### Unchanged (Backward Compatibility)
- `routes/web.php` ✅ Not touched
- `app/Models/User.php` ✅ Not changed
- All existing controllers ✅ Not modified
- Database schema ✅ No migrations needed

---

## Security Features

- ✅ Password hashing with bcrypt
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ Rate limiting (60 requests/minute)
- ✅ CORS configured for mobile
- ✅ Token-based authentication (Sanctum)
- ✅ Input validation on all endpoints

---

## Testing

### Run Laravel Tests
```powershell
php artisan test
```

### Clear Caches (if needed)
```powershell
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

---

## Support

For issues with the API, check:
1. Laravel logs: `storage/logs/laravel.log`
2. Correct headers: `Accept: application/json`
3. Token format: `Authorization: Bearer <token>`
