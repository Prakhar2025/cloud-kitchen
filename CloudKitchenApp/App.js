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
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import MenuScreen from './src/screens/User/MenuScreen';
import CartScreen from './src/screens/User/CartScreen';
import CartConfirmationScreen from './src/screens/User/CartConfirmationScreen';
import CheckoutScreen from './src/screens/User/CheckoutScreen';
import OrdersScreen from './src/screens/User/OrdersScreen';
import ProfileScreen from './src/screens/User/ProfileScreen';
import NotificationsScreen from './src/screens/User/NotificationsScreen';
import InvoiceScreen from './src/screens/User/InvoiceScreen';
import OrderSuccessScreen from './src/screens/User/OrderSuccessScreen';
import CategoryScreen from './src/screens/User/CategoryScreen';

// Styles
import Colors from './src/styles/colors';

// Create navigators
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
// User Tab Navigator
// =============================================================================

// Tab definitions — single source of truth for icons + labels
const TAB_CONFIG = [
    { name: 'Menu', icon: 'restaurant', iconOff: 'restaurant-outline', component: MenuScreen },
    { name: 'Cart', icon: 'cart', iconOff: 'cart-outline', component: CartScreen },
    { name: 'Orders', icon: 'receipt', iconOff: 'receipt-outline', component: OrdersScreen },
    { name: 'Notifications', icon: 'notifications', iconOff: 'notifications-outline', component: NotificationsScreen },
    { name: 'Profile', icon: 'person', iconOff: 'person-outline', component: ProfileScreen },
];

// =============================================================================
// User Tab Navigator — WhatsApp-style swipe between tabs
// =============================================================================

const UserTabs = ({ navigation }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const pagerRef = React.useRef(null);

    const goToTab = (index) => {
        pagerRef.current?.setPage(index);
        setActiveIndex(index);
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Swipeable page content */}
            <PagerView
                ref={pagerRef}
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
                overdrag={false}
            >
                {TAB_CONFIG.map((tab, index) => {
                    const Screen = tab.component;
                    return (
                        <View key={tab.name} style={{ flex: 1 }}>
                            <Screen navigation={navigation} route={{ name: tab.name, params: {} }} />
                        </View>
                    );
                })}
            </PagerView>

            {/* Custom bottom tab bar — stays in sync with swipe */}
            <View style={tabStyles.tabBar}>
                {TAB_CONFIG.map((tab, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={tabStyles.tabItem}
                            onPress={() => goToTab(index)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isActive ? tab.icon : tab.iconOff}
                                size={24}
                                color={isActive ? Colors.primary : '#9e9e9e'}
                            />
                            <Text style={[tabStyles.tabLabel, isActive && tabStyles.tabLabelActive]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const tabStyles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        height: 60,
        paddingBottom: 5,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 10,
        marginTop: 2,
        color: '#9e9e9e',
        fontWeight: '500',
    },
    tabLabelActive: {
        color: Colors.primary,
        fontWeight: '700',
    },
});


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
                    <Stack.Screen
                        name="CartConfirmation"
                        component={CartConfirmationScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Checkout"
                        component={CheckoutScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Invoice"
                        component={InvoiceScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="OrderSuccess"
                        component={OrderSuccessScreen}
                        options={{ headerShown: false, gestureEnabled: false }}
                    />
                    <Stack.Screen
                        name="Category"
                        component={CategoryScreen}
                        options={{ headerShown: false }}
                    />
                </>) : (
                // Unauthenticated routes
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
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
