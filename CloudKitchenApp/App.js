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
import { CartProvider, useCart } from './src/context/CartContext';

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
import ForgotPasswordScreen from './src/screens/Auth/ForgotPasswordScreen';
import EditProfileScreen from './src/screens/Profile/EditProfileScreen';

// Delivery Screens
import DeliveryDashboardScreen from './src/screens/Delivery/DeliveryDashboardScreen';
import DeliveryHistoryScreen from './src/screens/Delivery/DeliveryHistoryScreen';
import DeliveryProfileScreen from './src/screens/Delivery/DeliveryProfileScreen';

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

const UserTabs = ({ navigation, route }) => {
    const initialIndex = route?.params?.tabIndex ?? 0;
    const [activeIndex, setActiveIndex] = React.useState(initialIndex);
    const pagerRef = React.useRef(null);
    const { cartCount } = useCart();

    // Jump to requested tab whenever params.tabIndex changes (e.g. after reset/navigate)
    React.useEffect(() => {
        const idx = route?.params?.tabIndex;
        if (idx !== undefined && idx !== activeIndex) {
            pagerRef.current?.setPage(idx);
            setActiveIndex(idx);
        }
    }, [route?.params?.tabIndex]);

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
                            <View>
                                <Ionicons
                                    name={isActive ? tab.icon : tab.iconOff}
                                    size={24}
                                    color={isActive ? Colors.primary : '#9e9e9e'}
                                />
                                {/* Cart badge */}
                                {tab.name === 'Cart' && cartCount > 0 && (
                                    <View style={tabStyles.badge}>
                                        <Text style={tabStyles.badgeText}>
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
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

// =============================================================================
// Delivery Tab Navigator
// =============================================================================

const DELIVERY_TAB_CONFIG = [
    { name: 'Dashboard', icon: 'bicycle', iconOff: 'bicycle-outline', component: DeliveryDashboardScreen },
    { name: 'History', icon: 'list', iconOff: 'list-outline', component: DeliveryHistoryScreen },
    { name: 'Profile', icon: 'person', iconOff: 'person-outline', component: DeliveryProfileScreen },
];

const DeliveryTabs = ({ navigation, route }) => {
    const initialIndex = route?.params?.tabIndex ?? 0;
    const [activeIndex, setActiveIndex] = React.useState(initialIndex);
    const pagerRef = React.useRef(null);

    React.useEffect(() => {
        const idx = route?.params?.tabIndex;
        if (idx !== undefined && idx !== activeIndex) {
            pagerRef.current?.setPage(idx);
            setActiveIndex(idx);
        }
    }, [route?.params?.tabIndex]);

    const goToTab = (index) => {
        pagerRef.current?.setPage(index);
        setActiveIndex(index);
    };

    return (
        <View style={{ flex: 1 }}>
            <PagerView
                ref={pagerRef}
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
                overdrag={false}
            >
                {DELIVERY_TAB_CONFIG.map((tab) => {
                    const Screen = tab.component;
                    return (
                        <View key={tab.name} style={{ flex: 1 }}>
                            <Screen navigation={navigation} route={{ name: tab.name, params: {} }} />
                        </View>
                    );
                })}
            </PagerView>

            <View style={tabStyles.tabBar}>
                {DELIVERY_TAB_CONFIG.map((tab, index) => {
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
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '700',
    },
});


// =============================================================================
// App Navigator - Handles Auth-Based Routing
// =============================================================================

const AppNavigator = () => {
    const { isAuthenticated, isGuest, isLoading, user } = useAuth();

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
            {(isAuthenticated || isGuest) ? (
                // Role-based routing
                user?.role === 'delivery' ? (
                    // Delivery Stack
                    <>
                        <Stack.Screen name="DeliveryMain" component={DeliveryTabs} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: 'slide_from_bottom' }} />
                    </>
                ) : (
                    // Normal User Stack
                    <>
                        <Stack.Screen name="Main" component={UserTabs} />
                        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_bottom' }} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ animation: 'slide_from_bottom' }} />
                        <Stack.Screen name="CartConfirmation" component={CartConfirmationScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Invoice" component={InvoiceScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false, gestureEnabled: false }} />
                        <Stack.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false, animation: 'slide_from_bottom' }} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: 'slide_from_bottom' }} />
                    </>
                )
            ) : (
                // Fallback — only reached during initial app load (isLoading=true covers this)
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false, animation: 'slide_from_bottom' }} />
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
                <CartProvider>
                    <NavigationContainer>
                        <StatusBar style="dark" />
                        <AppNavigator />
                    </NavigationContainer>
                </CartProvider>
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
