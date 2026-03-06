/**
 * ============================================================================
 * Category Screen
 * ============================================================================
 *
 * Shows food items filtered by a specific category.
 * Receives { categoryId, categoryName } via route.params.
 *
 * Since the API doesn't support category_id filtering, we fetch all
 * categories and extract the matching one client-side.
 *
 * Features:
 * - Header with back button + category name title
 * - Food item grid (same card style as MenuScreen)
 * - Tap food card → FoodDetailModal (same as MenuScreen)
 * - ADD button → quick add to cart directly
 * - Loading, empty, and error states
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../styles/colors';
import { getMenu } from '../../api/menu';
import FoodDetailModal from '../../components/FoodDetailModal';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// =============================================================================
// Main Component
// =============================================================================

const CategoryScreen = ({ navigation, route }) => {
    const { categoryId, categoryName } = route.params;
    const { isGuest } = useAuth();
    const { addItem, toastMessage } = useCart();

    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // -------------------------------------------------------------------------
    // Data Fetching
    // -------------------------------------------------------------------------

    const fetchCategoryItems = useCallback(async () => {
        setLoading(true);
        setError(null);

        const result = await getMenu();
        if (result.success) {
            const categories = Array.isArray(result.data)
                ? result.data
                : result.data.categories || [];

            const matched = categories.find(cat => cat.id === categoryId);
            setFoodItems(matched?.food_items || []);
        } else {
            setError('Failed to load items. Please try again.');
        }
        setLoading(false);
    }, [categoryId]);

    useEffect(() => {
        fetchCategoryItems();
    }, [fetchCategoryItems]);

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------

    const handleAddToCart = async (foodOrItem) => {
        if (isGuest) {
            Alert.alert(
                '🔒 Login Required',
                'Please log in to add items to your cart.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => navigation.navigate('Login') },
                ]
            );
            return;
        }
        // Always pass full food object to addItem (same as MenuScreen)
        // ADD button passes item directly; FoodDetailModal passes food object
        const foodItem = typeof foodOrItem === 'object' ? foodOrItem : foodItems.find(f => f.id === foodOrItem);
        if (foodItem) addItem(foodItem);
    };

    const handleOpenModal = (food) => {
        setSelectedFood(food);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedFood(null);
        setModalVisible(false);
    };

    // -------------------------------------------------------------------------
    // Render Helpers
    // -------------------------------------------------------------------------

    const renderFoodCard = ({ item }) => (
        <TouchableOpacity
            style={styles.foodCard}
            onPress={() => handleOpenModal(item)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
                style={styles.foodImage}
            />
            <View style={styles.foodInfo}>
                {/* Name + Veg Badge */}
                <View style={styles.foodHeader}>
                    <Text style={styles.foodName} numberOfLines={2}>
                        {item.name}
                    </Text>
                    <View style={[
                        styles.vegBadge,
                        { borderColor: item.type === 'veg' ? '#4CAF50' : '#F44336' }
                    ]}>
                        <View style={[
                            styles.vegDot,
                            { backgroundColor: item.type === 'veg' ? '#4CAF50' : '#F44336' }
                        ]} />
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.foodDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                {/* Price + ADD */}
                <View style={styles.foodFooter}>
                    <Text style={styles.foodPrice}>₹{item.price}</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(item)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>ADD</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>No items available</Text>
            <Text style={styles.emptySubtitle}>
                This category has no items right now.
            </Text>
        </View>
    );

    const renderError = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>⚠️</Text>
            <Text style={styles.emptyTitle}>Something went wrong</Text>
            <Text style={styles.emptySubtitle}>{error}</Text>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchCategoryItems}
            >
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    // -------------------------------------------------------------------------
    // UI
    // -------------------------------------------------------------------------

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.TEXT.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {categoryName}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading {categoryName}...</Text>
                </View>
            ) : error ? (
                renderError()
            ) : (
                <FlatList
                    data={foodItems}
                    renderItem={renderFoodCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={[
                        styles.listContent,
                        foodItems.length === 0 && styles.listContentEmpty,
                    ]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmpty}
                    ListHeaderComponent={
                        <Text style={styles.itemCount}>
                            {foodItems.length} {foodItems.length === 1 ? 'item' : 'items'}
                        </Text>
                    }
                    refreshing={loading}
                    onRefresh={fetchCategoryItems}
                />
            )}

            {/* Food Detail Modal */}
            <FoodDetailModal
                visible={modalVisible}
                food={selectedFood}
                onClose={handleCloseModal}
                onAddToCart={handleAddToCart}
            />

            {/* Cart Toast — same as MenuScreen */}
            {!!toastMessage && (
                <View style={styles.toast} pointerEvents="none">
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND.secondary,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: { elevation: 2 },
        }),
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.BACKGROUND.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginHorizontal: 8,
    },
    headerSpacer: {
        width: 40,
    },

    // Loading / Centered
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
    },

    // List
    listContent: {
        padding: 16,
    },
    listContentEmpty: {
        flexGrow: 1,
    },
    itemCount: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        marginBottom: 12,
        fontWeight: '500',
    },

    // Food Card — identical to MenuScreen
    foodCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: 'row',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    foodImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    foodInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    foodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    foodName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.TEXT.primary,
        flex: 1,
        lineHeight: 22,
    },
    vegBadge: {
        width: 16,
        height: 16,
        borderWidth: 1.5,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
        marginTop: 2,
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    foodDescription: {
        fontSize: 12,
        color: Colors.TEXT.secondary,
        marginVertical: 4,
        lineHeight: 18,
    },
    foodFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    foodPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.TEXT.primary,
    },
    addButton: {
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    addButtonText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 12,
    },

    // Empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 60,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },

    // Retry button
    retryButton: {
        marginTop: 20,
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
    },
    retryButtonText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: 14,
    },

    // Toast overlay — matches MenuScreen
    toast: {
        position: 'absolute',
        bottom: 24,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.78)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        zIndex: 999,
    },
    toastText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default CategoryScreen;
