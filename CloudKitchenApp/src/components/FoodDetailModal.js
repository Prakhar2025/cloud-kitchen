/**
 * ============================================================================
 * Food Detail Modal - Bottom Sheet Style
 * ============================================================================
 *
 * Displays detailed food information when a user taps a food card.
 * Features:
 * - Full-width food image
 * - Veg/Non-veg badge
 * - Food name, price, description
 * - Add to Cart button
 * - Close (X) button
 * - Animated slide-up with backdrop
 *
 * Props:
 *   visible: boolean
 *   food: object | null
 *   onClose: () => void
 *   onAddToCart: (foodId) => void
 */

import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../styles/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FoodDetailModal = ({ visible, food, onClose, onAddToCart }) => {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (visible) {
            // Slide up + fade in backdrop
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 65,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Reset position
            slideAnim.setValue(SCREEN_HEIGHT);
            backdropOpacity.setValue(0);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    const handleAddToCart = async () => {
        if (!food || adding) return;
        setAdding(true);
        await onAddToCart(food.id);
        setAdding(false);
        handleClose();
    };

    if (!food) return null;

    const isVeg = food.type === 'veg';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            {/* Backdrop */}
            <Animated.View
                style={[styles.backdrop, { opacity: backdropOpacity }]}
            >
                <TouchableOpacity
                    style={styles.backdropTouchable}
                    activeOpacity={1}
                    onPress={handleClose}
                />
            </Animated.View>

            {/* Bottom Sheet */}
            <Animated.View
                style={[
                    styles.sheetContainer,
                    { transform: [{ translateY: slideAnim }] },
                ]}
            >
                <View style={styles.sheet}>
                    {/* Drag Handle */}
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleClose}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={22} color={Colors.TEXT.primary} />
                    </TouchableOpacity>

                    {/* Food Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: food.image_url || 'https://via.placeholder.com/400x250' }}
                            style={styles.foodImage}
                            resizeMode="cover"
                        />
                        {/* Veg/Non-veg Badge on image */}
                        <View style={[
                            styles.typeBadgeOnImage,
                            { backgroundColor: isVeg ? '#E8F5E9' : '#FFEBEE' }
                        ]}>
                            <View style={[
                                styles.typeDot,
                                { backgroundColor: isVeg ? '#4CAF50' : '#F44336' }
                            ]} />
                            <Text style={[
                                styles.typeBadgeText,
                                { color: isVeg ? '#2E7D32' : '#C62828' }
                            ]}>
                                {isVeg ? 'Veg' : 'Non-Veg'}
                            </Text>
                        </View>
                    </View>

                    {/* Food Details */}
                    <View style={styles.detailsContainer}>
                        {/* Name + Price Row */}
                        <View style={styles.nameRow}>
                            <Text style={styles.foodName} numberOfLines={2}>
                                {food.name}
                            </Text>
                            <Text style={styles.foodPrice}>₹{food.price}</Text>
                        </View>

                        {/* Description */}
                        {food.description ? (
                            <Text style={styles.foodDescription}>
                                {food.description}
                            </Text>
                        ) : null}

                        {/* Add to Cart Button */}
                        <TouchableOpacity
                            style={[styles.addToCartButton, adding && styles.addToCartButtonDisabled]}
                            onPress={handleAddToCart}
                            disabled={adding}
                            activeOpacity={0.8}
                        >
                            {adding ? (
                                <ActivityIndicator color={Colors.white} size="small" />
                            ) : (
                                <>
                                    <Ionicons name="cart-outline" size={20} color={Colors.white} />
                                    <Text style={styles.addToCartText}>Add to Cart</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </Modal>
    );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
    // Backdrop
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backdropTouchable: {
        flex: 1,
    },

    // Sheet
    sheetContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    sheet: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 20,
            },
        }),
    },

    // Drag Handle
    dragHandleContainer: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 4,
    },
    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },

    // Close Button
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.BACKGROUND.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: { elevation: 3 },
        }),
    },

    // Image
    imageContainer: {
        width: '100%',
        height: 220,
        position: 'relative',
    },
    foodImage: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    typeBadgeOnImage: {
        position: 'absolute',
        bottom: 12,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
            },
            android: { elevation: 3 },
        }),
    },
    typeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    typeBadgeText: {
        fontSize: 12,
        fontWeight: '700',
    },

    // Details
    detailsContainer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    foodName: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.TEXT.primary,
        flex: 1,
        marginRight: 12,
        letterSpacing: 0.3,
    },
    foodPrice: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.primary,
    },
    foodDescription: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
        lineHeight: 22,
        marginBottom: 20,
    },

    // Add to Cart Button
    addToCartButton: {
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
            android: { elevation: 6 },
        }),
    },
    addToCartButtonDisabled: {
        opacity: 0.7,
    },
    addToCartText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default FoodDetailModal;
