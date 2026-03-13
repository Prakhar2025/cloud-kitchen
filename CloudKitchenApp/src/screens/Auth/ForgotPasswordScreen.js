/**
 * ============================================================================
 * Forgot Password Screen
 * ============================================================================
 * 
 * Allows users to request a password reset link via email.
 * The link opens in the browser where they can set a new password.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/CustomInput';
import Colors from '../../styles/colors';
import { forgotPassword } from '../../api/auth';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.trim());
    };

    const handleSendLink = async () => {
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setEmailSent(true);
            } else {
                setError(result.error || 'Something went wrong. Please try again.');
            }
        } catch (e) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // =========================================================================
    // Success State — Email Sent
    // =========================================================================
    if (emailSent) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
                <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                        <Ionicons name="mail-open" size={64} color={Colors.primary} />
                    </View>
                    <Text style={styles.successTitle}>Check your email</Text>
                    <Text style={styles.successText}>
                        We've sent a password reset link to{'\n'}
                        <Text style={styles.emailHighlight}>{email.trim().toLowerCase()}</Text>
                    </Text>
                    <Text style={styles.successHint}>
                        Tap the link in the email to open a page in your browser where you can set a new password.
                    </Text>
                    <Text style={styles.spamHint}>
                        Don't see it? Check your spam folder.
                    </Text>
                    <TouchableOpacity
                        style={styles.backToLoginButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.backToLoginText}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // =========================================================================
    // Form State — Enter Email
    // =========================================================================
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>

                    <View style={styles.headerSection}>
                        <View style={styles.lockIcon}>
                            <Ionicons name="lock-closed" size={48} color={Colors.primary} />
                        </View>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            No worries! Enter your email and we'll send you a link to reset your password.
                        </Text>
                    </View>

                    {/* Email Input */}
                    <View style={styles.formSection}>
                        <CustomInput
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (error) setError('');
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={16} color="#E53E3E" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.sendButton, isSubmitting && styles.sendButtonDisabled]}
                            onPress={handleSendLink}
                            disabled={isSubmitting}
                            activeOpacity={0.8}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.sendButtonText}>Send Reset Link</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.rememberPassword}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.rememberText}>
                                Remember your password?{' '}
                                <Text style={styles.loginLink}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        paddingTop: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    lockIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    formSection: {
        width: '100%',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 4,
    },
    errorText: {
        color: '#E53E3E',
        fontSize: 13,
        marginLeft: 8,
        flex: 1,
    },
    sendButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    sendButtonDisabled: {
        opacity: 0.7,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    rememberPassword: {
        alignItems: 'center',
        marginTop: 24,
    },
    rememberText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        color: Colors.primary,
        fontWeight: '600',
    },

    // Success screen
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    successTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 16,
    },
    successText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 12,
    },
    emailHighlight: {
        fontWeight: '700',
        color: Colors.text,
    },
    successHint: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 8,
        paddingHorizontal: 10,
    },
    spamHint: {
        fontSize: 12,
        color: '#bbb',
        textAlign: 'center',
        marginBottom: 32,
    },
    backToLoginButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 48,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    backToLoginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ForgotPasswordScreen;
