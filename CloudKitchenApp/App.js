/**
 * ============================================================================
 * Cloud Kitchen Mobile App - Entry Point
 * ============================================================================
 * 
 * Main application entry point with:
 * - AuthProvider for global authentication state
 * - Navigation setup
 * - Conditional rendering based on auth status
 */

import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/Auth/LoginScreen';

// Styles
import Colors from './src/styles/colors';

// Create navigation stack
const Stack = createNativeStackNavigator();

// =============================================================================
// Loading Screen Component
// =============================================================================

const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
        <View style={styles.loadingLogo}>
            <Text style={styles.loadingEmoji}>🍳</Text>
        </View>
        <Text style={styles.loadingTitle}>Cloud Kitchen</Text>
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>Loading your delicious experience...</Text>
    </View>
);

// =============================================================================
// Home Screen Placeholder (Post-Login)
// =============================================================================

const HomeScreen = () => {
    const { user, logout } = useAuth();

    return (
        <View style={styles.homeContainer}>
            <View style={styles.homeContent}>
                <Text style={styles.homeEmoji}>🎉</Text>
                <Text style={styles.homeTitle}>Welcome, {user?.name}!</Text>
                <Text style={styles.homeSubtitle}>You are successfully logged in.</Text>

                <View style={styles.userCard}>
                    <Text style={styles.userCardTitle}>Your Account</Text>
                    <Text style={styles.userCardItem}>📧 {user?.email}</Text>
                    <Text style={styles.userCardItem}>👤 {user?.name}</Text>
                    {user?.is_admin && (
                        <Text style={styles.userCardItem}>⭐ Admin Account</Text>
                    )}
                </View>

                <Text style={styles.homeNote}>
                    The menu, cart, and ordering features will be available in future updates!
                </Text>

                <View style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText} onPress={logout}>
                        🚪 Logout
                    </Text>
                </View>
            </View>
        </View>
    );
};

// =============================================================================
// App Navigator - Handles Auth-Based Routing
// =============================================================================

const AppNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading screen while checking auth status
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.white },
                animation: 'fade',
            }}
        >
            {isAuthenticated ? (
                // Authenticated routes
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                </>
            ) : (
                // Unauthenticated routes
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    {/* Future: Register, ForgotPassword screens */}
                </>
            )}
        </Stack.Navigator>
    );
};

// =============================================================================
// Main App Component
// =============================================================================

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <NavigationContainer>
                    <StatusBar style="dark" />
                    <AppNavigator />
                </NavigationContainer>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
    // Loading Screen
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 24,
    },
    loadingLogo: {
        width: 100,
        height: 100,
        borderRadius: 25,
        backgroundColor: Colors.PRIMARY.light + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: Colors.primary,
    },
    loadingEmoji: {
        fontSize: 48,
    },
    loadingTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 24,
    },
    loadingSpinner: {
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
    },

    // Home Screen
    homeContainer: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    homeContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    homeEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    homeTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    homeSubtitle: {
        fontSize: 16,
        color: Colors.TEXT.secondary,
        marginBottom: 32,
        textAlign: 'center',
    },
    userCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        width: '100%',
        shadowColor: Colors.SHADOW.default,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 24,
    },
    userCardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.TEXT.primary,
        marginBottom: 12,
    },
    userCardItem: {
        fontSize: 15,
        color: Colors.TEXT.secondary,
        marginBottom: 8,
    },
    homeNote: {
        fontSize: 14,
        color: Colors.TEXT.muted,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 24,
    },
    logoutButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
});
