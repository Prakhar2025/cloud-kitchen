/**
 * ============================================================================
 * Form Validation Utilities
 * ============================================================================
 * 
 * Comprehensive validation helpers for authentication forms.
 * Provides real-time validation feedback for a better user experience.
 */

import { REGEX, APP_CONFIG } from './constants';

// =============================================================================
// Email Validation
// =============================================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {{isValid: boolean, error: string|null}}
 */
export const validateEmail = (email) => {
    if (!email || email.trim() === '') {
        return {
            isValid: false,
            error: 'Email address is required',
        };
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!REGEX.EMAIL.test(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Please enter a valid email address',
        };
    }

    return {
        isValid: true,
        error: null,
    };
};

// =============================================================================
// Password Validation
// =============================================================================

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {boolean} requireStrong - Whether to enforce strong password rules
 * @returns {{isValid: boolean, error: string|null, strength: string}}
 */
export const validatePassword = (password, requireStrong = true) => {
    if (!password || password === '') {
        return {
            isValid: false,
            error: 'Password is required',
            strength: 'none',
        };
    }

    if (password.length < APP_CONFIG.MIN_PASSWORD_LENGTH) {
        return {
            isValid: false,
            error: `Password must be at least ${APP_CONFIG.MIN_PASSWORD_LENGTH} characters`,
            strength: 'weak',
        };
    }

    // Check for strong password requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Calculate strength
    let strengthScore = 0;
    if (password.length >= 8) strengthScore++;
    if (password.length >= 12) strengthScore++;
    if (hasUpperCase) strengthScore++;
    if (hasLowerCase) strengthScore++;
    if (hasNumbers) strengthScore++;
    if (hasSpecialChar) strengthScore++;

    let strength = 'weak';
    if (strengthScore >= 5) strength = 'strong';
    else if (strengthScore >= 3) strength = 'medium';

    if (requireStrong) {
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            return {
                isValid: false,
                error: 'Password must contain uppercase, lowercase, and numbers',
                strength,
            };
        }
    }

    return {
        isValid: true,
        error: null,
        strength,
    };
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {{isValid: boolean, error: string|null}}
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
    if (!confirmPassword || confirmPassword === '') {
        return {
            isValid: false,
            error: 'Please confirm your password',
        };
    }

    if (password !== confirmPassword) {
        return {
            isValid: false,
            error: 'Passwords do not match',
        };
    }

    return {
        isValid: true,
        error: null,
    };
};

// =============================================================================
// Name Validation
// =============================================================================

/**
 * Validate user name
 * @param {string} name - Name to validate
 * @returns {{isValid: boolean, error: string|null}}
 */
export const validateName = (name) => {
    if (!name || name.trim() === '') {
        return {
            isValid: false,
            error: 'Name is required',
        };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
        return {
            isValid: false,
            error: 'Name must be at least 2 characters',
        };
    }

    if (trimmedName.length > APP_CONFIG.MAX_NAME_LENGTH) {
        return {
            isValid: false,
            error: `Name cannot exceed ${APP_CONFIG.MAX_NAME_LENGTH} characters`,
        };
    }

    return {
        isValid: true,
        error: null,
    };
};

// =============================================================================
// Form Validators
// =============================================================================

/**
 * Validate login form
 * @param {Object} data - Form data with email and password
 * @returns {{isValid: boolean, errors: Object}}
 */
export const validateLoginForm = (data) => {
    const errors = {};

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error;
    }

    const passwordValidation = validatePassword(data.password, false);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate registration form
 * @param {Object} data - Form data with name, email, password, confirmPassword
 * @returns {{isValid: boolean, errors: Object}}
 */
export const validateRegistrationForm = (data) => {
    const errors = {};

    const nameValidation = validateName(data.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.error;
    }

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error;
    }

    const passwordValidation = validatePassword(data.password, true);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error;
    }

    if (passwordValidation.isValid) {
        const confirmValidation = validatePasswordConfirmation(
            data.password,
            data.confirmPassword
        );
        if (!confirmValidation.isValid) {
            errors.confirmPassword = confirmValidation.error;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export default {
    validateEmail,
    validatePassword,
    validatePasswordConfirmation,
    validateName,
    validateLoginForm,
    validateRegistrationForm,
};
