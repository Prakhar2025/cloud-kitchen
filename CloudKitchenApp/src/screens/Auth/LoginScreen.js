/**
 * ============================================================================
 * LoginScreen - Premium Food Delivery Login Experience
 * ============================================================================
 * 
 * A beautifully designed login screen for the Cloud Kitchen mobile app.
 * Features:
 * - Modern, clean, professional UI
 * - Food delivery app aesthetic (warm colors, appetizing design)
 * - Smooth animations and transitions
 * - Loading states during API calls
 * - Comprehensive error handling
 * - Form validation with real-time feedback
 * - Password visibility toggle
 * - Keyboard-aware scroll view
 * - Safe area handling
 * - Responsive design
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
import { validateLoginForm } from '../../utils/validation';
import Colors from '../../styles/colors';
import { APP_CONFIG } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

/**
 * LoginScreen component
 * 
 * @param {Object} props
 * @param {Object} props.navigation - React Navigation object
 */
const LoginScreen = ({ navigation }) => {
    // ==========================================================================
    // State
    // ==========================================================================

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState('');

    // Auth context
    const { login, isLoading } = useAuth();

    // Refs for input focus management
    const passwordRef = useRef(null);

    // ==========================================================================
    // Animations
    // ==========================================================================

    // Fade in animation for the screen
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Logo bounce animation
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start entrance animations
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
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Subtle logo animation loop
        const rotateAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(logoRotate, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(logoRotate, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );
        rotateAnimation.start();

        return () => rotateAnimation.stop();
    }, []);

    const logoRotateInterpolate = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['-3deg', '3deg'],
    });

    // ==========================================================================
    // Handlers
    // ==========================================================================

    /**
     * Clear field error when user starts typing
     */
    const handleEmailChange = (value) => {
        setEmail(value);
        if (errors.email) {
            setErrors((prev) => ({ ...prev, email: null }));
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

    /**
     * Handle form submission
     */
    const handleLogin = async () => {
        // Clear previous errors
        setGeneralError('');
        setErrors({});

        // Validate form
        const validation = validateLoginForm({ email, password });
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Submit login
        setIsSubmitting(true);
        try {
            const result = await login(email, password);

            if (result.success) {
                // Navigate back to main tabs after login
                // (works whether coming from GuestPrompt or cold launch)
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
                return { success: true };
            } else {
                // Handle API errors
                if (result.errors && Object.keys(result.errors).length > 0) {
                    setErrors(result.errors);
                } else {
                    setGeneralError(result.error || 'Login failed. Please try again.');
                }
            }
        } catch (error) {
            setGeneralError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Navigate to registration screen
     */
    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    /**
     * Handle forgot password
     */
    const handleForgotPassword = () => {
        Alert.alert(
            'Forgot Password',
            'Password reset will be available in the next update!',
            [{ text: 'OK' }]
        );
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
                        {/* Header Section - Logo & Tagline */}
                        {/* ============================================================ */}

                        <View style={styles.headerSection}>
                            <Animated.View
                                style={[
                                    styles.logoContainer,
                                    {
                                        transform: [
                                            { scale: logoScale },
                                            { rotate: logoRotateInterpolate },
                                        ],
                                    },
                                ]}
                            >
                                <View style={styles.logo}>
                                    <Text style={styles.logoEmoji}>🍳</Text>
                                </View>
                                <View style={styles.logoAccent} />
                            </Animated.View>

                            <Text style={styles.appName}>{APP_CONFIG.APP_NAME}</Text>
                            <Text style={styles.tagline}>{APP_CONFIG.APP_TAGLINE}</Text>
                        </View>

                        {/* ============================================================ */}
                        {/* Welcome Text */}
                        {/* ============================================================ */}

                        <View style={styles.welcomeSection}>
                            <Text style={styles.welcomeTitle}>Welcome Back! 👋</Text>
                            <Text style={styles.welcomeSubtitle}>
                                Sign in to continue ordering your favorite meals
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

                            {/* Email Input */}
                            <CustomInput
                                placeholder="Email address"
                                value={email}
                                onChangeText={handleEmailChange}
                                error={errors.email}
                                icon="📧"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                                onSubmitEditing={() => passwordRef.current?.focus()}
                                editable={!isSubmitting}
                            />

                            {/* Password Input */}
                            <CustomInput
                                ref={passwordRef}
                                placeholder="Password"
                                value={password}
                                onChangeText={handlePasswordChange}
                                error={errors.password}
                                icon="🔒"
                                secureTextEntry
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                                editable={!isSubmitting}
                            />

                            {/* Forgot Password Link */}
                            <TouchableOpacity
                                style={styles.forgotPasswordContainer}
                                onPress={handleForgotPassword}
                            >
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    title="Sign In"
                                    onPress={handleLogin}
                                    loading={isSubmitting || isLoading}
                                    disabled={isSubmitting || isLoading}
                                    icon="🚀"
                                />
                            </View>
                        </View>

                        {/* ============================================================ */}
                        {/* Sign Up Link */}
                        {/* ============================================================ */}

                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={handleSignUp}>
                                <Text style={styles.signUpLink}>Sign Up</Text>
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
        position: 'relative',
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
    logoAccent: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.SEMANTIC.success,
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
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: -8,
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 8,
    },

    // =========================================================================
    // Divider
    // =========================================================================
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.BORDER.light,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 13,
        color: Colors.TEXT.muted,
        fontWeight: '500',
    },

    // =========================================================================
    // Social Login
    // =========================================================================
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BACKGROUND.secondary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: Colors.BORDER.light,
        minWidth: width * 0.38,
    },
    socialIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    socialText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },

    // =========================================================================
    // Sign Up
    // =========================================================================
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    signUpText: {
        fontSize: 15,
        color: Colors.TEXT.secondary,
    },
    signUpLink: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: '700',
    },

    // =========================================================================
    // Guest Browse
    // =========================================================================
    guestContainer: {
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 16,
    },
    guestText: {
        fontSize: 14,
        color: Colors.TEXT?.secondary || '#888',
        textDecorationLine: 'underline',
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

export default LoginScreen;
