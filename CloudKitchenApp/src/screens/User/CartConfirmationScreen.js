import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../styles/colors';
import { getCart } from '../../api/cart';

const CartConfirmationScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        const result = await getCart();
        if (result.success) {
            setCartItems(result.data.items);
            setSubtotal(result.data.subtotal);
        }
        setLoading(false);
    };

    const handleProceedToCheckout = () => {
        navigation.navigate('Checkout', {
            cartItems: cartItems,
            subtotal: subtotal
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: item.food_item?.image_url || 'https://via.placeholder.com/100' }}
                style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.food_item?.name || 'Unknown Item'}</Text>
                <Text style={styles.itemPrice}>₹{item.food_item?.price} × {item.quantity}</Text>
                <Text style={styles.itemTotal}>Total: ₹{(item.food_item?.price * item.quantity).toFixed(2)}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm Your Order</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>Please review your items before proceeding to checkout.</Text>
            </View>

            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.footer}>
                <View style={styles.subtotalContainer}>
                    <Text style={styles.subtotalLabel}>Subtotal ({cartItems.length} items):</Text>
                    <Text style={styles.subtotalValue}>₹{subtotal.toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.editButtonText}>Edit Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.proceedButton}
                    onPress={handleProceedToCheckout}
                >
                    <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND?.secondary || '#f5f5f5',
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
    },
    backButton: {
        marginBottom: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.TEXT?.primary || '#000',
    },
    infoBox: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    infoText: {
        fontSize: 14,
        color: '#1565c0',
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
        width: 70,
        height: 70,
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
        color: Colors.TEXT?.primary || '#000',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: Colors.TEXT?.secondary || '#666',
        marginBottom: 4,
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
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
    subtotalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    subtotalLabel: {
        fontSize: 16,
        color: Colors.TEXT?.secondary || '#666',
    },
    subtotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.TEXT?.primary || '#000',
    },
    editButton: {
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    editButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    proceedButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    proceedButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CartConfirmationScreen;
