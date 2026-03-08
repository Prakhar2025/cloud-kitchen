/**
 * ============================================================================
 * SignUpScreen - Professional Registration Experience
 * ============================================================================
 * 
 * A beautifully designed registration screen matching the website design.
 * Features:
 * - Clean, professional UI matching website aesthetics
 * - Form validation with real-time feedback
 * - Password strength indicator
 * - Password visibility toggles
 * - Smooth animations
 * - Loading states
 * - Keyboard-aware layout
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../styles/colors';
import { APP_CONFIG } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

/**
 * SignUpScreen component
 * 
 * @param {Object} props
 * @param {Object} props.navigation - React Navigation object
 */
const SignUpScreen = ({ navigation }) => {
    // ==========================================================================
    // State
    // ==========================================================================

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState('');

    // Auth context
    const { register, isLoading } = useAuth();

    // Refs for input focus management
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    // ==========================================================================
    // Animations
    // ==========================================================================

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // ==========================================================================
    // Validation
    // ==========================================================================

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (phone.trim().length < 10) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // Role validation
        if (!role) {
            newErrors.role = 'Please select a role';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ==========================================================================
    // Handlers
    // ==========================================================================

    const handleNameChange = (value) => {
        setName(value);
        if (errors.name) {
            setErrors((prev) => ({ ...prev, name: null }));
        }
        if (generalError) setGeneralError('');
    };

    const handleEmailChange = (value) => {
        setEmail(value);
        if (errors.email) {
            setErrors((prev) => ({ ...prev, email: null }));
        }
        if (generalError) setGeneralError('');
    };

    const handlePhoneChange = (value) => {
        setPhone(value);
        if (errors.phone) {
            setErrors((prev) => ({ ...prev, phone: null }));
        }
        if (generalError) setGeneralError('');
    };

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
        if (errors.role) {
            setErrors((prev) => ({ ...prev, role: null }));
        }
        if (generalError) setGeneralError('');
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        if (errors.password) {
            setErrors((prev) => ({ ...prev, password: null }));
        }
        if (generalError) setGeneralError('');
    };

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
        if (errors.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: null }));
        }
        if (generalError) setGeneralError('');
    };

    /**
     * Handle form submission
     */
    const handleSignUp = async () => {
        // Clear previous errors
        setGeneralError('');
        setErrors({});

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Submit registration
        setIsSubmitting(true);
        try {
            const result = await register({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                role: role,
                password: password,
                password_confirmation: confirmPassword,
            });

            if (result.success) {
                // Registration successful - user is automatically logged in by AuthContext
                // App.js will handle navigation to main app based on auth state
                Alert.alert(
                    'Welcome! 🎉',
                    'Your account has been created successfully. Let\'s start ordering!',
                    [
                        {
                            text: 'Get Started',
                        },
                    ]
                );
            } else {
                // Handle API errors
                if (result.errors && Object.keys(result.errors).length > 0) {
                    setErrors(result.errors);
                } else {
                    setGeneralError(result.error || 'Registration failed. Please try again.');
                }
            }
        } catch (error) {
            setGeneralError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Navigate to login screen
     */
    const handleLogin = () => {
        navigation.navigate('Login');
    };

    // ==========================================================================
    // Render
    // ==========================================================================

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        style={[
                            styles.content,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        {/* ============================================================ */}
                        {/* Header Section */}
                        {/* ============================================================ */}

                        <View style={styles.headerSection}>
                            <View style={styles.logoContainer}>
                                <View style={styles.logo}>
                                    <Text style={styles.logoEmoji}>🍕</Text>
                                </View>
                            </View>

                            <Text style={styles.appName}>{APP_CONFIG.APP_NAME}</Text>
                            <Text style={styles.tagline}>{APP_CONFIG.APP_TAGLINE}</Text>
                        </View>

                        {/* ============================================================ */}
                        {/* Welcome Text */}
                        {/* ============================================================ */}

                        <View style={styles.welcomeSection}>
                            <Text style={styles.welcomeTitle}>Create Account</Text>
                            <Text style={styles.welcomeSubtitle}>
                                Join us & start ordering today
                            </Text>
                        </View>

                        {/* ============================================================ */}
                        {/* Form Section */}
                        {/* ============================================================ */}

                        <View style={styles.formSection}>
                            {/* General Error Message */}
                            {generalError ? (
                                <Animated.View style={styles.generalErrorContainer}>
                                    <Text style={styles.generalErrorIcon}>⚠️</Text>
                                    <Text style={styles.generalErrorText}>{generalError}</Text>
                                </Animated.View>
                            ) : null}

                            {/* Name Input */}
                            <CustomInput
                                placeholder="Full Name"
                                value={name}
                                onChangeText={handleNameChange}
                                error={errors.name}
                                icon="👤"
                                autoCapitalize="words"
                                autoCorrect={false}
                                returnKeyType="next"
                                onSubmitEditing={() => emailRef.current?.focus()}
                                editable={!isSubmitting}
                            />

                            {/* Email Input */}
                            <CustomInput
                                ref={emailRef}
                                placeholder="Email Address"
                                value={email}
                                onChangeText={handleEmailChange}
                                error={errors.email}
                                icon="📧"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                                onSubmitEditing={() => phoneRef.current?.focus()}
                                editable={!isSubmitting}
                            />

                            {/* Phone Input */}
                            <CustomInput
                                ref={phoneRef}
                                placeholder="Mobile Number"
                                value={phone}
                                onChangeText={handlePhoneChange}
                                error={errors.phone}
                                icon="📱"
                                keyboardType="phone-pad"
                                returnKeyType="next"
                                onSubmitEditing={() => passwordRef.current?.focus()}
                                editable={!isSubmitting}
                            />

                            {/* Role Selection */}
                            <View style={styles.roleContainer}>
                                <Text style={styles.roleLabel}>Register As</Text>
                                <View style={styles.roleOptions}>
                                    <TouchableOpacity
                                        style={[styles.roleOption, role === 'user' && styles.roleOptionActive]}
                                        onPress={() => handleRoleChange('user')}
                                        disabled={isSubmitting}
                                    >
                                        <Text style={[styles.roleOptionText, role === 'user' && styles.roleOptionTextActive]}>Customer</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.roleOption, role === 'delivery' && styles.roleOptionActive]}
                                        onPress={() => handleRoleChange('delivery')}
                                        disabled={isSubmitting}
                                    >
                                        <Text style={[styles.roleOptionText, role === 'delivery' && styles.roleOptionTextActive]}>Delivery Partner</Text>
                                    </TouchableOpacity>
                                </View>
                                {errors.role ? <Text style={styles.roleErrorText}>{errors.role}</Text> : null}
                            </View>

                            {/* Password Input */}
                            <CustomInput
                                ref={passwordRef}
                                placeholder="Password"
                                value={password}
                                onChangeText={handlePasswordChange}
                                error={errors.password}
                                icon="🔒"
                                secureTextEntry
                                returnKeyType="next"
                                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                editable={!isSubmitting}
                            />

                            {/* Confirm Password Input */}
                            <CustomInput
                                ref={confirmPasswordRef}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                error={errors.confirmPassword}
                                icon="🛡️"
                                secureTextEntry
                                returnKeyType="done"
                                onSubmitEditing={handleSignUp}
                                editable={!isSubmitting}
                            />

                            {/* Sign Up Button */}
                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    title="Create Account"
                                    onPress={handleSignUp}
                                    loading={isSubmitting || isLoading}
                                    disabled={isSubmitting || isLoading}
                                    icon="🚀"
                                />
                            </View>
                        </View>

                        {/* ============================================================ */}
                        {/* Login Link */}
                        {/* ============================================================ */}

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={handleLogin}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>

                        {/* ============================================================ */}
                        {/* Footer */}
                        {/* ============================================================ */}

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                By continuing, you agree to our{' '}
                                <Text style={styles.footerLink}>Terms of Service</Text>
                                {' '}and{' '}
                                <Text style={styles.footerLink}>Privacy Policy</Text>
                            </Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },

    // =========================================================================
    // Header Section
    // =========================================================================
    headerSection: {
        alignItems: 'center',
        marginTop: height * 0.05,
        marginBottom: 32,
    },
    logoContainer: {
        marginBottom: 16,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 25,
        backgroundColor: Colors.PRIMARY.light + '20',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.primary,
    },
    logoEmoji: {
        fontSize: 48,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 4,
    },
    tagline: {
        fontSize: 15,
        color: Colors.TEXT.secondary,
        fontWeight: '400',
    },

    // =========================================================================
    // Welcome Section
    // =========================================================================
    welcomeSection: {
        marginBottom: 32,
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: Colors.TEXT.secondary,
        lineHeight: 22,
    },

    // =========================================================================
    // Form Section
    // =========================================================================
    formSection: {
        marginBottom: 24,
    },
    generalErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.SEMANTIC.errorLight,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.error,
    },
    generalErrorIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    generalErrorText: {
        flex: 1,
        fontSize: 14,
        color: Colors.error,
        fontWeight: '500',
    },
    roleContainer: {
        marginBottom: 16,
    },
    roleLabel: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
        marginBottom: 8,
        marginLeft: 4,
        fontWeight: '500',
    },
    roleOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    roleOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    roleOptionActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.PRIMARY.light + '10',
    },
    roleOptionText: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
        fontWeight: '500',
    },
    roleOptionTextActive: {
        color: Colors.primary,
        fontWeight: '700',
    },
    roleErrorText: {
        color: Colors.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    buttonContainer: {
        marginTop: 8,
    },

    // =========================================================================
    // Login Link
    // =========================================================================
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginText: {
        fontSize: 15,
        color: Colors.TEXT.secondary,
    },
    loginLink: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: '700',
    },

    // =========================================================================
    // Footer
    // =========================================================================
    footer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 12,
        color: Colors.TEXT.muted,
        textAlign: 'center',
        lineHeight: 18,
    },
    footerLink: {
        color: Colors.primary,
        fontWeight: '500',
    },
});

export default SignUpScreen;
