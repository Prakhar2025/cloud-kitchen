/**
 * ============================================================================
 * Order Success Screen - Post-Checkout Confirmation
 * ============================================================================
 *
 * Displayed after a successful order placement.
 * Features:
 * - Animated green checkmark with scale + fade-in
 * - Order ID display
 * - Estimated delivery time
 * - Navigation to Orders tab or Menu tab
 *
 * Receives `orderId` via navigation route.params
 */

import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../styles/colors';

// =============================================================================
// Main Component
// =============================================================================

const OrderSuccessScreen = ({ navigation, route }) => {
    const { orderId } = route.params;

    // Animation values
    const checkmarkScale = useRef(new Animated.Value(0)).current;
    const checkmarkOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(40)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const buttonsTranslateY = useRef(new Animated.Value(30)).current;
    const buttonsOpacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Sequence: checkmark → content → buttons → pulse loop
        Animated.sequence([
            // 1. Checkmark bounces in
            Animated.parallel([
                Animated.spring(checkmarkScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(checkmarkOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
            // 2. Content slides up
            Animated.parallel([
                Animated.timing(contentTranslateY, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // 3. Buttons slide up
            Animated.parallel([
                Animated.timing(buttonsTranslateY, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonsOpacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            // 4. Start subtle pulse loop on checkmark
            startPulse();
        });
    }, []);

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.08,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    /**
     * Navigate to Orders tab via stack reset
     */
    const handleTrackOrder = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main', params: { screen: 'Orders' } }],
        });
    };

    /**
     * Navigate to Menu tab via stack reset
     */
    const handleBackToMenu = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main', params: { screen: 'Menu' } }],
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>
                {/* ========================================================== */}
                {/* Animated Checkmark                                          */}
                {/* ========================================================== */}
                <Animated.View
                    style={[
                        styles.checkmarkContainer,
                        {
                            transform: [
                                { scale: Animated.multiply(checkmarkScale, pulseAnim) },
                            ],
                            opacity: checkmarkOpacity,
                        },
                    ]}
                >
                    <View style={styles.checkmarkOuter}>
                        <View style={styles.checkmarkInner}>
                            <Ionicons name="checkmark" size={56} color={Colors.white} />
                        </View>
                    </View>
                </Animated.View>

                {/* ========================================================== */}
                {/* Success Message                                             */}
                {/* ========================================================== */}
                <Animated.View
                    style={[
                        styles.messageContainer,
                        {
                            transform: [{ translateY: contentTranslateY }],
                            opacity: contentOpacity,
                        },
                    ]}
                >
                    <Text style={styles.successTitle}>Order Placed Successfully!</Text>
                    <Text style={styles.successSubtitle}>
                        Your food is being prepared 🍳
                    </Text>

                    {/* Order Info Card */}
                    <View style={styles.orderInfoCard}>
                        <View style={styles.orderInfoRow}>
                            <View style={styles.orderInfoItem}>
                                <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
                                <Text style={styles.orderInfoLabel}>Order ID</Text>
                                <Text style={styles.orderInfoValue}>#{orderId}</Text>
                            </View>
                            <View style={styles.orderInfoDivider} />
                            <View style={styles.orderInfoItem}>
                                <Ionicons name="time-outline" size={20} color={Colors.primary} />
                                <Text style={styles.orderInfoLabel}>Estimated Time</Text>
                                <Text style={styles.orderInfoValue}>30-45 mins</Text>
                            </View>
                        </View>
                    </View>

                    {/* Status Steps */}
                    <View style={styles.statusContainer}>
                        <View style={styles.statusStep}>
                            <View style={[styles.statusDot, styles.statusDotActive]} />
                            <Text style={[styles.statusText, styles.statusTextActive]}>
                                Order Confirmed
                            </Text>
                        </View>
                        <View style={styles.statusLine} />
                        <View style={styles.statusStep}>
                            <View style={[styles.statusDot, styles.statusDotPending]} />
                            <Text style={styles.statusText}>Preparing</Text>
                        </View>
                        <View style={styles.statusLine} />
                        <View style={styles.statusStep}>
                            <View style={[styles.statusDot, styles.statusDotPending]} />
                            <Text style={styles.statusText}>Out for Delivery</Text>
                        </View>
                        <View style={styles.statusLine} />
                        <View style={styles.statusStep}>
                            <View style={[styles.statusDot, styles.statusDotPending]} />
                            <Text style={styles.statusText}>Delivered</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* ========================================================== */}
                {/* Action Buttons                                              */}
                {/* ========================================================== */}
                <Animated.View
                    style={[
                        styles.buttonsContainer,
                        {
                            transform: [{ translateY: buttonsTranslateY }],
                            opacity: buttonsOpacity,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.trackButton}
                        onPress={handleTrackOrder}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="location-outline" size={20} color={Colors.white} />
                        <Text style={styles.trackButtonText}>Track Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={handleBackToMenu}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="restaurant-outline" size={20} color={Colors.primary} />
                        <Text style={styles.menuButtonText}>Back to Menu</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    // Checkmark
    checkmarkContainer: {
        marginBottom: 28,
    },
    checkmarkOuter: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    checkmarkInner: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Message
    messageContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 32,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.TEXT.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        color: Colors.TEXT.secondary,
        textAlign: 'center',
        marginBottom: 24,
    },

    // Order Info Card
    orderInfoCard: {
        width: '100%',
        backgroundColor: Colors.BACKGROUND.secondary,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    orderInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderInfoItem: {
        flex: 1,
        alignItems: 'center',
    },
    orderInfoDivider: {
        width: 1,
        height: 50,
        backgroundColor: Colors.border,
    },
    orderInfoLabel: {
        fontSize: 12,
        color: Colors.TEXT.secondary,
        marginTop: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    orderInfoValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginTop: 2,
    },

    // Status Steps
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    statusStep: {
        alignItems: 'center',
        width: 70,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginBottom: 6,
    },
    statusDotActive: {
        backgroundColor: '#10B981',
    },
    statusDotPending: {
        backgroundColor: '#D1D5DB',
    },
    statusLine: {
        width: 20,
        height: 2,
        backgroundColor: '#D1D5DB',
        marginBottom: 18,
    },
    statusText: {
        fontSize: 10,
        color: Colors.TEXT.secondary,
        textAlign: 'center',
    },
    statusTextActive: {
        color: '#10B981',
        fontWeight: '700',
    },

    // Buttons
    buttonsContainer: {
        width: '100%',
        gap: 12,
    },
    trackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 14,
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    trackButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 16,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Colors.primary,
        gap: 8,
    },
    menuButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default OrderSuccessScreen;
