/**
 * ============================================================================
 * Cloud Kitchen Mobile App - Entry Point
 * ============================================================================
 * 
 * Main application entry point with:
 * - AuthProvider for global authentication state
 * - Navigation setup (Stack + Bottom Tabs)
 * - Conditional rendering based on auth status
 */

import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import MenuScreen from './src/screens/User/MenuScreen';
import CartScreen from './src/screens/User/CartScreen';
import OrdersScreen from './src/screens/User/OrdersScreen';
import ProfileScreen from './src/screens/User/ProfileScreen';

// Styles
import Colors from './src/styles/colors';

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
// User Tab Navigator
// =============================================================================

const UserTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Menu') {
                        iconName = focused ? 'restaurant' : 'restaurant-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Orders') {
                        iconName = focused ? 'receipt' : 'receipt-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Menu" component={MenuScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Orders" component={OrdersScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
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
                    <Stack.Screen name="Main" component={UserTabs} />
                </>
            ) : (
                // Unauthenticated routes
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
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
        backgroundColor: Colors.PRIMARY ? Colors.PRIMARY.light + '20' : '#ffebee', // Fallback safety
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
        color: Colors.TEXT ? Colors.TEXT.primary : '#000',
        marginBottom: 24,
    },
    loadingSpinner: {
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 14,
        color: Colors.TEXT ? Colors.TEXT.secondary : '#666',
    },
});
