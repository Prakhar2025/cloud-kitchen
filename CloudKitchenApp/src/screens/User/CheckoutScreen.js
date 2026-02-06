import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../styles/colors';
import { placeOrder } from '../../api/order';
import { getAddresses } from '../../api/user';

const CheckoutScreen = ({ navigation, route }) => {
    const { cartItems, subtotal } = route.params;

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [deliveryCharge, setDeliveryCharge] = useState(0);

    // Constants
    const GST_RATE = 0.18; // 18%
    const COD_FEE = 100;
    const ONLINE_FEE = 50;

    // Calculations
    const gstAmount = subtotal * GST_RATE;
    const paymentProcessingFee = paymentMethod === 'cod' ? COD_FEE : paymentMethod === 'online' ? ONLINE_FEE : 0;
    const totalAmount = subtotal + gstAmount + deliveryCharge + paymentProcessingFee;

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        const result = await getAddresses();
        if (result.success && result.data.length > 0) {
            setAddresses(result.data);
            setSelectedAddress(result.data[0].id);
        }
        setLoading(false);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Alert.alert("No Address", "Please add an address in your profile to continue.", [
                { text: "Go to Profile", onPress: () => navigation.navigate('Profile') }
            ]);
            return;
        }

        if (!paymentMethod) {
            Alert.alert("Payment Method Required", "Please select a payment method to continue.");
            return;
        }

        Alert.alert(
            "Confirm Order",
            `Place order for ₹${totalAmount.toFixed(2)}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        setPlacingOrder(true);
                        const result = await placeOrder({
                            address_id: selectedAddress,
                            payment_method: paymentMethod,
                            subtotal: parseFloat(subtotal.toFixed(2)),
                            gst_amount: parseFloat(gstAmount.toFixed(2)),
                            delivery_charge: parseFloat(deliveryCharge.toFixed(2)),
                            payment_processing_fee: parseFloat(paymentProcessingFee.toFixed(2)),
                            total_amount: parseFloat(totalAmount.toFixed(2))
                        });
                        setPlacingOrder(false);

                        if (result.success) {
                            Alert.alert("Success", "Order placed successfully!", [
                                {
                                    text: "OK", onPress: () => {
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Main', params: { screen: 'Orders' } }],
                                        });
                                    }
                                }
                            ]);
                        } else {
                            Alert.alert("Error", result.error || "Failed to place order");
                        }
                    }
                }
            ]
        );
    };

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
                <Text style={styles.headerTitle}>Checkout</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    {cartItems.map((item, index) => (
                        <View key={index} style={styles.orderItem}>
                            <Text style={styles.orderItemName}>
                                {item.food_item?.name} × {item.quantity}
                            </Text>
                            <Text style={styles.orderItemPrice}>
                                ₹{(item.food_item?.price * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Invoice Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Invoice</Text>

                    <View style={styles.invoiceRow}>
                        <Text style={styles.invoiceLabel}>Subtotal</Text>
                        <Text style={styles.invoiceValue}>₹{subtotal.toFixed(2)}</Text>
                    </View>

                    <View style={styles.invoiceRow}>
                        <Text style={styles.invoiceLabel}>GST (18%)</Text>
                        <Text style={styles.invoiceValue}>₹{gstAmount.toFixed(2)}</Text>
                    </View>

                    <View style={styles.invoiceRow}>
                        <Text style={styles.invoiceLabel}>Delivery Charge</Text>
                        <Text style={styles.invoiceValue}>₹{deliveryCharge.toFixed(2)}</Text>
                    </View>

                    {paymentMethod && (
                        <View style={styles.invoiceRow}>
                            <Text style={styles.invoiceLabel}>
                                Payment Processing Fee ({paymentMethod === 'cod' ? 'COD' : 'Online'})
                            </Text>
                            <Text style={styles.invoiceValue}>₹{paymentProcessingFee.toFixed(2)}</Text>
                        </View>
                    )}

                    <View style={[styles.invoiceRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Delivery Charge Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Options</Text>

                    <TouchableOpacity
                        style={[styles.optionCard, deliveryCharge === 0 && styles.selectedOption]}
                        onPress={() => setDeliveryCharge(0)}
                    >
                        <View style={styles.radioButton}>
                            {deliveryCharge === 0 && <View style={styles.radioButtonInner} />}
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Standard Delivery</Text>
                            <Text style={styles.optionSubtitle}>Free • 45-60 mins</Text>
                        </View>
                        <Text style={styles.optionPrice}>Free</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionCard, deliveryCharge === 50 && styles.selectedOption]}
                        onPress={() => setDeliveryCharge(50)}
                    >
                        <View style={styles.radioButton}>
                            {deliveryCharge === 50 && <View style={styles.radioButtonInner} />}
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Express Delivery</Text>
                            <Text style={styles.optionSubtitle}>₹50 • 20-30 mins</Text>
                        </View>
                        <Text style={styles.optionPrice}>₹50</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>

                    <TouchableOpacity
                        style={[styles.optionCard, paymentMethod === 'cod' && styles.selectedOption]}
                        onPress={() => setPaymentMethod('cod')}
                    >
                        <View style={styles.radioButton}>
                            {paymentMethod === 'cod' && <View style={styles.radioButtonInner} />}
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Cash on Delivery</Text>
                            <Text style={styles.optionSubtitle}>Pay when you receive</Text>
                        </View>
                        <Text style={styles.optionFee}>+₹100</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionCard, paymentMethod === 'online' && styles.selectedOption]}
                        onPress={() => setPaymentMethod('online')}
                    >
                        <View style={styles.radioButton}>
                            {paymentMethod === 'online' && <View style={styles.radioButtonInner} />}
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Online Payment</Text>
                            <Text style={styles.optionSubtitle}>UPI, Card, Net Banking</Text>
                        </View>
                        <Text style={styles.optionFee}>+₹50</Text>
                    </TouchableOpacity>
                </View>

                {!selectedAddress && (
                    <View style={styles.warningBox}>
                        <Text style={styles.warningText}>⚠️ Please add an address in your profile first!</Text>
                    </View>
                )}

                {!paymentMethod && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>💡 Select a payment method to proceed</Text>
                    </View>
                )}
            </ScrollView>

            {paymentMethod && selectedAddress && (
                <View style={styles.footer}>
                    <View style={styles.footerTotal}>
                        <Text style={styles.footerTotalLabel}>Total to Pay</Text>
                        <Text style={styles.footerTotalValue}>₹{totalAmount.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.placeOrderButton, placingOrder && { opacity: 0.7 }]}
                        onPress={handlePlaceOrder}
                        disabled={placingOrder}
                    >
                        {placingOrder ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <Text style={styles.placeOrderButtonText}>Place Order</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
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
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: Colors.white,
        padding: 16,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.TEXT?.primary || '#000',
        marginBottom: 12,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderItemName: {
        fontSize: 14,
        color: Colors.TEXT?.secondary || '#666',
        flex: 1,
    },
    orderItemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.TEXT?.primary || '#000',
    },
    invoiceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    invoiceLabel: {
        fontSize: 14,
        color: Colors.TEXT?.secondary || '#666',
    },
    invoiceValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.TEXT?.primary || '#000',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 2,
        borderTopColor: Colors.primary,
        borderBottomWidth: 0,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.TEXT?.primary || '#000',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedOption: {
        borderColor: Colors.primary,
        backgroundColor: Colors.PRIMARY?.light + '10' || '#e3f2fd',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.TEXT?.primary || '#000',
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 13,
        color: Colors.TEXT?.secondary || '#666',
    },
    optionPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    optionFee: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ff9800',
    },
    warningBox: {
        backgroundColor: '#fff3cd',
        padding: 12,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#ff9800',
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
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
    footer: {
        backgroundColor: Colors.white,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    footerTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    footerTotalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.TEXT?.secondary || '#666',
    },
    footerTotalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    placeOrderButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    placeOrderButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CheckoutScreen;
