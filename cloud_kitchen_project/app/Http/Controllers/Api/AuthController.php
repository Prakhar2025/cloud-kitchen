<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

/**
 * ============================================================================
 * API Authentication Controller
 * ============================================================================
 * 
 * Production-grade authentication controller for mobile applications.
 * Uses Laravel Sanctum for token-based authentication.
 * 
 * Features:
 * - Secure user registration with validation
 * - Token-based login (Sanctum personal access tokens)
 * - Token revocation on logout
 * - Authenticated user retrieval
 * 
 * Security Considerations:
 * - All passwords are hashed using bcrypt (Hash::make)
 * - SQL injection prevented via Eloquent ORM
 * - Rate limiting applied via route middleware
 * - Input validation on all endpoints
 * 
 * @author Cloud Kitchen Development Team
 * @version 1.0.0
 */
class AuthController extends Controller
{
    /**
     * ========================================================================
     * Register a new user
     * ========================================================================
     * 
     * Creates a new user account and returns an authentication token.
     * The token can be used immediately for authenticated API requests.
     * 
     * @endpoint POST /api/v1/register
     * @param Request $request
     * @return JsonResponse
     * 
     * Request Body:
     * {
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "password": "SecurePass123!",
     *   "password_confirmation": "SecurePass123!"
     * }
     * 
     * Success Response (201):
     * {
     *   "success": true,
     *   "message": "User registered successfully",
     *   "data": {
     *     "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
     *     "token": "1|abc123...",
     *     "token_type": "Bearer"
     *   }
     * }
     * 
     * Error Response (422):
     * {
     *   "success": false,
     *   "message": "Validation failed",
     *   "errors": { "email": ["The email has already been taken."] }
     * }
     */
    public function register(Request $request): JsonResponse
    {
        // ====================================================================
        // Step 1: Validate incoming request data
        // ====================================================================
        // Using Laravel's Validator for comprehensive validation with custom messages
        
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                'min:2',  // Minimum 2 characters for a valid name
            ],
            'email' => [
                'required',
                'string',
                'email:rfc,dns',  // Strict email validation (RFC + DNS check)
                'max:255',
                'unique:users,email',  // Must be unique in users table
            ],
            'password' => [
                'required',
                'string',
                'confirmed',  // Requires password_confirmation field
                Password::min(8)  // Minimum 8 characters
                    ->mixedCase()  // Requires upper and lowercase
                    ->numbers(),    // Requires at least one number
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
            ],
            'role' => [
                'required',
                'string',
                'in:user,delivery',
            ],
        ], [
            // Custom error messages for better user experience
            'name.required' => 'Please provide your full name.',
            'name.min' => 'Name must be at least 2 characters.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered. Try logging in.',
            'password.required' => 'Password is required.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.min' => 'Password must be at least 8 characters.',
            'phone.required' => 'Phone number is required.',
            'role.required' => 'Please select a role.',
            'role.in' => 'Invalid role selected.',
        ]);

        // Return validation errors if validation fails
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422); // 422 Unprocessable Entity
        }

        // ====================================================================
        // Step 2: Create the user in the database
        // ====================================================================
        // Password is automatically hashed using bcrypt via Hash::make
        
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => strtolower($request->email), // Normalize email to lowercase
                'phone' => $request->phone,
                'role' => $request->role,
                'password' => Hash::make($request->password),
            ]);
        } catch (\Exception $e) {
            // Log the error for debugging (in production)
            \Log::error('User registration failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again later.',
            ], 500); // 500 Internal Server Error
        }

        // ====================================================================
        // Step 3: Generate Sanctum personal access token
        // ====================================================================
        // Token name includes device info for easy management in user settings
        
        $tokenName = 'mobile_app_' . now()->timestamp;
        $token = $user->createToken($tokenName)->plainTextToken;

        // ====================================================================
        // Step 4: Return success response with user data and token
        // ====================================================================
        
        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at->toISOString(),
                ],
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ], 201); // 201 Created
    }

    /**
     * ========================================================================
     * Authenticate user and issue token
     * ========================================================================
     * 
     * Validates credentials and returns a Sanctum personal access token.
     * The token should be included in subsequent requests as:
     * Authorization: Bearer <token>
     * 
     * @endpoint POST /api/v1/login
     * @param Request $request
     * @return JsonResponse
     * 
     * Request Body:
     * {
     *   "email": "john@example.com",
     *   "password": "SecurePass123!"
     * }
     * 
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Login successful",
     *   "data": {
     *     "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
     *     "token": "2|xyz789...",
     *     "token_type": "Bearer"
     *   }
     * }
     * 
     * Error Response (401):
     * {
     *   "success": false,
     *   "message": "Invalid credentials"
     * }
     */
    public function login(Request $request): JsonResponse
    {
        // ====================================================================
        // Step 1: Validate login credentials format
        // ====================================================================
        
        $validator = Validator::make($request->all(), [
            'email' => [
                'required',
                'string',
                'email',
            ],
            'password' => [
                'required',
                'string',
            ],
        ], [
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'password.required' => 'Password is required.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // ====================================================================
        // Step 2: Find user by email (case-insensitive)
        // ====================================================================
        
        $user = User::where('email', strtolower($request->email))->first();

        // ====================================================================
        // Step 3: Verify password
        // ====================================================================
        // Using Hash::check for secure password comparison (timing-safe)
        
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials. Please check your email and password.',
            ], 401); // 401 Unauthorized
        }

        // ====================================================================
        // Step 4: Generate new token for this login session
        // ====================================================================
        // Each login creates a new token, allowing multiple device sessions
        
        $tokenName = 'mobile_app_' . now()->timestamp;
        $token = $user->createToken($tokenName)->plainTextToken;

        // ====================================================================
        // Step 5: Return success response
        // ====================================================================
        
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_admin' => (bool) $user->is_admin,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at->toISOString(),
                ],
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ], 200);
    }

    /**
     * ========================================================================
     * Logout user and revoke token
     * ========================================================================
     * 
     * Revokes the current access token, invalidating it for future requests.
     * This only revokes the token used to make this request (single-device logout).
     * 
     * @endpoint POST /api/v1/logout
     * @authenticated
     * @param Request $request
     * @return JsonResponse
     * 
     * Headers Required:
     * Authorization: Bearer <token>
     * 
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Successfully logged out"
     * }
     */
    public function logout(Request $request): JsonResponse
    {
        // ====================================================================
        // Revoke the current token
        // ====================================================================
        // currentAccessToken() returns the token used to authenticate this request
        // delete() removes it from the personal_access_tokens table
        
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Logout failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Logout failed. Please try again.',
            ], 500);
        }
    }

    /**
     * ========================================================================
     * Get authenticated user profile
     * ========================================================================
     * 
     * Returns the currently authenticated user's profile information.
     * Useful for checking auth status and populating user profile screens.
     * 
     * @endpoint GET /api/v1/user
     * @authenticated
     * @param Request $request
     * @return JsonResponse
     * 
     * Headers Required:
     * Authorization: Bearer <token>
     * 
     * Success Response (200):
     * {
     *   "success": true,
     *   "data": {
     *     "user": {
     *       "id": 1,
     *       "name": "John Doe",
     *       "email": "john@example.com",
     *       "is_admin": false,
     *       "email_verified_at": null,
     *       "created_at": "2026-02-03T10:00:00.000000Z",
     *       "addresses": [...],
     *       "orders_count": 5
     *     }
     *   }
     * }
     */
    public function user(Request $request): JsonResponse
    {
        // ====================================================================
        // Get authenticated user with related data
        // ====================================================================
        // Load addresses relationship for profile completeness
        
        $user = $request->user();
        
        // Load user's addresses for profile display
        $user->load('addresses');
        
        // Get orders count for user statistics
        $ordersCount = $user->orders()->count();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_admin' => (bool) $user->is_admin,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at->toISOString(),
                    'addresses' => $user->addresses,
                    'orders_count' => $ordersCount,
                ],
            ],
        ], 200);
    }

    /**
     * ========================================================================
     * Revoke all tokens (logout from all devices)
     * ========================================================================
     * 
     * Revokes ALL tokens for the current user, effectively logging them out
     * from all devices/sessions.
     * 
     * @endpoint POST /api/v1/logout-all
     * @authenticated
     * @param Request $request
     * @return JsonResponse
     * 
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Logged out from all devices"
     * }
     */
    public function logoutAll(Request $request): JsonResponse
    {
        try {
            // Delete all tokens for this user
            $request->user()->tokens()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out from all devices',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Logout all failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Logout failed. Please try again.',
            ], 500);
        }
    }
}
