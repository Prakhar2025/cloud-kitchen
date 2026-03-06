import React, { useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../styles/colors';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getAddresses } from '../../api/user';
import GuestPrompt from '../../components/GuestPrompt';

const CartScreen = ({ navigation }) => {
    const { cartItems, subtotal, loading, increaseItem, decreaseItem, removeItem, refreshCart } = useCart();
    const { isGuest } = useAuth();
    const [defaultAddressId, setDefaultAddressId] = React.useState(null);

    const fetchAddress = async () => {
        const result = await getAddresses();
        if (result.success && result.data.length > 0) {
            setDefaultAddressId(result.data[0].id);
        }
    };

    // ALL hooks must be called unconditionally (Rules of Hooks)
    // Guest check is done AFTER all hooks below
    useFocusEffect(
        useCallback(() => {
            if (isGuest) return; // skip fetch for guests
            fetchAddress();
            refreshCart();
        }, [isGuest])
    );

    // Early return AFTER all hooks
    if (isGuest) return <GuestPrompt feature="cart" />;

    const handleIncrease = (item) => increaseItem(item);
    const handleDecrease = (item) => decreaseItem(item);
    const handleRemove = (item) => removeItem(item);

    const handleProceedToCheckout = () => {
        if (!defaultAddressId) {
            Alert.alert("No Address", "Please add an address in your profile to continue.", [
                { text: "Go to Profile", onPress: () => navigation.navigate('Main', { tabIndex: 4 }) }
            ]);
            return;
        }

        if (cartItems.length === 0) {
            Alert.alert("Empty Cart", "Please add items to your cart first.");
            return;
        }

        navigation.navigate('CartConfirmation');
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: item.food_item?.image_url || 'https://via.placeholder.com/100' }}
                style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.food_item?.name || 'Unknown Item'}</Text>
                <Text style={styles.itemPrice}>₹{item.food_item?.price}</Text>
            </View>
            <View style={styles.quantityControls}>
                <TouchableOpacity onPress={() => handleDecrease(item)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => handleIncrease(item)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading && cartItems.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart</Text>
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Your cart is empty 🛒</Text>
                    <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('Main', { tabIndex: 0 })}>
                        <Text style={styles.browseButtonText}>Browse Menu</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                    />

                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Subtotal:</Text>
                            <Text style={styles.totalValue}>₹{subtotal}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={handleProceedToCheckout}
                        >
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                        {!defaultAddressId && (
                            <Text style={styles.addressWarning}>Please add an address first!</Text>
                        )}
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: Colors.white,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.TEXT.primary,
    },
    listContent: {
        padding: 16,
    },
    cartItem: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginBottom: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },
    itemPrice: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
        marginTop: 4,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.BACKGROUND.secondary,
        borderRadius: 8,
    },
    qtyBtn: {
        padding: 8,
        paddingHorizontal: 12,
    },
    qtyBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    qtyText: {
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 8,
    },
    footer: {
        backgroundColor: Colors.white,
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 5,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        color: Colors.TEXT.secondary,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    checkoutButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 20,
        color: Colors.TEXT.secondary,
        marginBottom: 20,
    },
    browseButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    browseButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    addressWarning: {
        color: 'red',
        textAlign: 'center',
        marginTop: 8,
        fontSize: 12,
    }
});

export default CartScreen;
