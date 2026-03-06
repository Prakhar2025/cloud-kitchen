import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Colors from '../styles/colors';

/**
 * GuestPrompt
 *
 * Shown inside Cart / Orders / Profile / Notifications when the user
 * is browsing as a guest. Prompts them to log in or sign up.
 *
 * @param {string} feature  - e.g. "cart", "orders", "profile", "notifications"
 */
const FEATURE_COPY = {
    cart: {
        icon: '🛒',
        title: 'Your Cart is Waiting',
        subtitle: 'Log in to add items and place your order.',
    },
    orders: {
        icon: '📦',
        title: 'Track Your Orders',
        subtitle: 'Log in to view your order history and track deliveries.',
    },
    profile: {
        icon: '👤',
        title: 'Your Profile',
        subtitle: 'Log in to manage your account, addresses, and preferences.',
    },
    notifications: {
        icon: '🔔',
        title: 'Stay Updated',
        subtitle: 'Log in to receive order updates and special offers.',
    },
};

const GuestPrompt = ({ feature = 'cart' }) => {
    const navigation = useNavigation();

    const copy = FEATURE_COPY[feature] || FEATURE_COPY.cart;

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{copy.icon}</Text>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
                <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp} activeOpacity={0.85}>
                <Text style={styles.signupBtnText}>Create Account</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
                You can continue browsing the menu as a guest.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: Colors.white,
    },
    icon: {
        fontSize: 72,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.TEXT?.primary || '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: Colors.TEXT?.secondary || '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 36,
    },
    loginBtn: {
        backgroundColor: Colors.primary || '#FF6B35',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 48,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: Colors.primary || '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    signupBtn: {
        backgroundColor: 'transparent',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 48,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary || '#FF6B35',
        marginBottom: 24,
    },
    signupBtnText: {
        color: Colors.primary || '#FF6B35',
        fontSize: 16,
        fontWeight: '600',
    },
    hint: {
        fontSize: 13,
        color: Colors.TEXT?.secondary || '#999',
        textAlign: 'center',
    },
});

export default GuestPrompt;
