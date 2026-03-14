/**
 * ============================================================================
 * Checkout Screen - Matches Web Checkout Flow Exactly
 * ============================================================================
 *
 * Web flow: Cart → Select Address → Payment Method (COD only) → Summary → Place Order
 * Mobile: Single screen with all steps, matching web's logic exactly.
 *
 * What this sends to API: { address_id, payment_method }
 * Server calculates total from cart items (same as web).
 */

import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    Modal,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../styles/colors';
import { placeOrder } from '../../api/order';
import { getAddresses, addAddress } from '../../api/user';

const CheckoutScreen = ({ navigation, route }) => {
    const { cartItems, subtotal } = route.params;

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Default COD like web

    // Add address modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        address_line1: '',
        city: '',
        state: '',
        zip_code: ''
    });

    // Total is just the subtotal (sum of item prices × qty) — same as web
    const totalAmount = subtotal;

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        const result = await getAddresses();
        if (result.success && result.data.length > 0) {
            setAddresses(result.data);
            setSelectedAddress(result.data[0]);
        }
        setLoading(false);
    };

    const handleAddNewAddress = async () => {
        if (!newAddress.address_line1 || !newAddress.city || !newAddress.zip_code || !newAddress.name || !newAddress.phone) {
            Alert.alert("Error", "Please fill required fields (Name, Phone, Address, City, Zip)");
            return;
        }

        setSavingAddress(true);
        const result = await addAddress(newAddress);
        setSavingAddress(false);

        if (result.success) {
            Alert.alert("Success", "Address added successfully!");
            // Reset form
            setNewAddress({
                name: '',
                phone: '',
                address_line1: '',
                city: '',
                state: '',
                zip_code: ''
            });
            setShowAddModal(false);
            
            // Refresh addresses and select the new one
            const updatedAddresses = await getAddresses();
            if (updatedAddresses.success) {
                setAddresses(updatedAddresses.data);
                // The new address is usually the last one or we can find it by ID if returned
                // For simplicity, find the one with the ID returned or just use the first if sorted by desc
                const newlyAdded = updatedAddresses.data.find(a => a.id === result.data.id) || updatedAddresses.data[0];
                setSelectedAddress(newlyAdded);
            }
        } else {
            Alert.alert("Error", result.error || "Failed to add address");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Alert.alert(
                'No Address',
                'Please add an address in your profile to continue.',
                [{ text: 'Go to Profile', onPress: () => navigation.navigate('Main', { tabIndex: 4 }) }]
            );
            return;
        }

        Alert.alert(
            'Confirm Order',
            `Place order for ₹${totalAmount.toFixed(2)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Place Order',
                    onPress: async () => {
                        setPlacingOrder(true);

                        // Send only address_id and payment_method
                        // Server calculates total from cart (same as web)
                        const result = await placeOrder({
                            address_id: selectedAddress.id,
                            payment_method: paymentMethod,
                        });

                        setPlacingOrder(false);

                        if (result.success) {
                            navigation.replace('OrderSuccess', {
                                orderId: result.data?.id || 'N/A',
                            });
                        } else {
                            Alert.alert('Error', result.error || 'Failed to place order');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading checkout...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.TEXT.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ============================================================ */}
                {/* Step 1: Delivery Address (matches web's address selection)    */}
                {/* ============================================================ */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.sectionHeaderTitleContainer}>
                            <Ionicons name="location-outline" size={20} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Select Delivery Address</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => setShowAddModal(true)}
                            style={styles.headerAddButton}
                        >
                            <Text style={styles.headerAddButtonText}>+ Add New</Text>
                        </TouchableOpacity>
                    </View>

                    {addresses.length === 0 ? (
                        <View style={styles.warningBox}>
                            <Text style={styles.warningText}>
                                ⚠️ No addresses found. Please add one in your profile.
                            </Text>
                            <TouchableOpacity
                                style={styles.addAddressButton}
                                onPress={() => navigation.navigate('Main', { tabIndex: 4 })}
                            >
                                <Text style={styles.addAddressText}>Go to Profile →</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        addresses.map((addr) => (
                            <TouchableOpacity
                                key={addr.id}
                                style={[
                                    styles.addressCard,
                                    selectedAddress?.id === addr.id && styles.addressCardSelected,
                                ]}
                                onPress={() => setSelectedAddress(addr)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.radioOuter}>
                                    {selectedAddress?.id === addr.id && (
                                        <View style={styles.radioInner} />
                                    )}
                                </View>
                                <View style={styles.addressInfo}>
                                    <Text style={styles.addressLabel}>
                                        {addr.label || 'Address'}
                                    </Text>
                                    <Text style={styles.addressName}>{addr.name}</Text>
                                    <Text style={styles.addressPhone}>{addr.phone}</Text>
                                    <Text style={styles.addressText}>
                                        {[addr.address_line1, addr.city, addr.state, addr.zip_code]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </Text>
                                </View>
                                {selectedAddress?.id === addr.id && (
                                    <View style={styles.deliverBadge}>
                                        <Text style={styles.deliverBadgeText}>Deliver Here</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* ============================================================ */}
                {/* Step 2: Payment Method (matches web — COD only)              */}
                {/* ============================================================ */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Ionicons name="card-outline" size={20} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                    </View>

                    {/* Deliver To summary — same as web */}
                    {selectedAddress && (
                        <View style={styles.deliverToBox}>
                            <Text style={styles.deliverToTitle}>Deliver To</Text>
                            <Text style={styles.deliverToName}>
                                {selectedAddress.name} ({selectedAddress.phone})
                            </Text>
                            <Text style={styles.deliverToAddress}>
                                {[selectedAddress.address_line1, selectedAddress.city, selectedAddress.state, selectedAddress.zip_code]
                                    .filter(Boolean)
                                    .join(', ')}
                            </Text>
                        </View>
                    )}

                    {/* COD Option */}
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionSelected]}
                        onPress={() => setPaymentMethod('cod')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.radioOuter}>
                            {paymentMethod === 'cod' && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.paymentOptionText}>Cash on Delivery</Text>
                    </TouchableOpacity>

                    {/* Online — disabled, same as web */}
                    <View style={[styles.paymentOption, styles.paymentOptionDisabled]}>
                        <View style={[styles.radioOuter, { borderColor: '#D1D5DB' }]} />
                        <Text style={[styles.paymentOptionText, { color: '#9CA3AF' }]}>
                            Online Payment (Coming Soon)
                        </Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            💡 Online payment will be enabled in the next version.
                        </Text>
                    </View>
                </View>

                {/* ============================================================ */}
                {/* Step 3: Order Summary (matches web's summary page)           */}
                {/* ============================================================ */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Order Summary</Text>
                    </View>

                    {/* Delivery Details */}
                    {selectedAddress && (
                        <View style={styles.summaryBlock}>
                            <Text style={styles.summaryBlockTitle}>Delivery Details</Text>
                            <Text style={styles.summaryText}>{selectedAddress.name}</Text>
                            <Text style={styles.summaryText}>{selectedAddress.phone}</Text>
                            <Text style={styles.summaryText}>
                                {[selectedAddress.address_line1, selectedAddress.city, selectedAddress.state, selectedAddress.zip_code]
                                    .filter(Boolean)
                                    .join(', ')}
                            </Text>
                        </View>
                    )}

                    {/* Payment Method */}
                    <View style={styles.summaryBlock}>
                        <Text style={styles.summaryBlockTitle}>Payment Method</Text>
                        <Text style={styles.summaryText}>
                            {paymentMethod === 'cod' ? 'COD' : 'Online'}
                        </Text>
                    </View>

                    {/* Order Items */}
                    <View style={styles.summaryBlock}>
                        <Text style={styles.summaryBlockTitle}>Order Items</Text>
                        {cartItems.map((item, index) => (
                            <Text key={index} style={styles.summaryItemText}>
                                • {item.food_item?.name} × {item.quantity} — ₹{(item.food_item?.price * item.quantity).toFixed(0)}
                            </Text>
                        ))}
                    </View>

                    {/* Total — simple total, same as web */}
                    <View style={styles.totalBlock}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{totalAmount.toFixed(0)}</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom: Place Order Button */}
            {selectedAddress && (
                <View style={styles.footer}>
                    <View style={styles.footerTotal}>
                        <Text style={styles.footerTotalLabel}>Total</Text>
                        <Text style={styles.footerTotalValue}>₹{totalAmount.toFixed(0)}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.placeOrderButton, placingOrder && { opacity: 0.7 }]}
                        onPress={handlePlaceOrder}
                        disabled={placingOrder}
                        activeOpacity={0.8}
                    >
                        {placingOrder ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <Text style={styles.placeOrderButtonText}>Place Order</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
            {/* ============================================================ */}
            {/* Add Address Modal                                           */}
            {/* ============================================================ */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalScrollOverlay}>
                    <ScrollView contentContainerStyle={styles.modalScrollContent}>
                        <View style={styles.modalInnerContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Add New Address</Text>
                                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                    <Ionicons name="close" size={24} color={Colors.TEXT.secondary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.formContainer}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Full Name *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Enter full name"
                                        value={newAddress.name}
                                        onChangeText={t => setNewAddress({ ...newAddress, name: t })}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Phone Number *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Enter 10-digit number"
                                        keyboardType="phone-pad"
                                        value={newAddress.phone}
                                        onChangeText={t => setNewAddress({ ...newAddress, phone: t })}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Address Line 1 *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="House no, Street, Area"
                                        value={newAddress.address_line1}
                                        onChangeText={t => setNewAddress({ ...newAddress, address_line1: t })}
                                    />
                                </View>

                                <View style={styles.rowInputs}>
                                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                        <Text style={styles.inputLabel}>City *</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="City"
                                            value={newAddress.city}
                                            onChangeText={t => setNewAddress({ ...newAddress, city: t })}
                                        />
                                    </View>
                                    <View style={[styles.inputGroup, { flex: 1 }]}>
                                        <Text style={styles.inputLabel}>Zip Code *</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="6-digit PIN"
                                            keyboardType="number-pad"
                                            value={newAddress.zip_code}
                                            onChangeText={t => setNewAddress({ ...newAddress, zip_code: t })}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>State</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="State"
                                        value={newAddress.state}
                                        onChangeText={t => setNewAddress({ ...newAddress, state: t })}
                                    />
                                </View>

                                <TouchableOpacity 
                                    style={[styles.saveAddressButton, savingAddress && { opacity: 0.7 }]} 
                                    onPress={handleAddNewAddress}
                                    disabled={savingAddress}
                                >
                                    {savingAddress ? (
                                        <ActivityIndicator color={Colors.white} />
                                    ) : (
                                        <Text style={styles.saveAddressButtonText}>Save & Select Address</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: Colors.TEXT.secondary,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
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
        fontSize: 18,
        fontWeight: '700',
        color: Colors.TEXT.primary,
    },

    // Content
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 12,
    },

    // Sections
    section: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
            android: { elevation: 2 },
        }),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    sectionHeaderTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerAddButton: {
        backgroundColor: '#FFF7F3',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    headerAddButtonText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.TEXT.primary,
    },

    // Radio buttons
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },

    // Address cards
    addressCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.border,
        marginBottom: 10,
        backgroundColor: Colors.white,
    },
    addressCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: '#FFF7F3',
    },
    addressInfo: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    addressName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },
    addressPhone: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        marginBottom: 2,
    },
    addressText: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        lineHeight: 19,
    },
    deliverBadge: {
        backgroundColor: Colors.primary,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    deliverBadgeText: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: '600',
    },

    // Payment options
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.border,
        marginBottom: 10,
    },
    paymentOptionSelected: {
        borderColor: Colors.primary,
        backgroundColor: '#FFF7F3',
    },
    paymentOptionDisabled: {
        opacity: 0.5,
    },
    paymentOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },

    // Deliver To box
    deliverToBox: {
        backgroundColor: Colors.BACKGROUND.secondary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 14,
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
    },
    deliverToTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 4,
    },
    deliverToName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },
    deliverToAddress: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        lineHeight: 19,
    },

    // Info & Warning
    warningBox: {
        backgroundColor: '#FFF3CD',
        padding: 14,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
    },
    addAddressButton: {
        marginTop: 10,
    },
    addAddressText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    infoBox: {
        backgroundColor: '#E0F7FA',
        padding: 12,
        borderRadius: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#006064',
    },

    // Summary
    summaryBlock: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BACKGROUND.secondary,
    },
    summaryBlockTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 6,
    },
    summaryText: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        lineHeight: 20,
    },
    summaryItemText: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        lineHeight: 22,
    },

    // Total
    totalBlock: {
        paddingTop: 14,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.primary,
    },

    // Footer
    footer: {
        backgroundColor: Colors.white,
        padding: 16,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 5 },
            android: { elevation: 10 },
        }),
    },
    footerTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    footerTotalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.TEXT.secondary,
    },
    footerTotalValue: {
        fontSize: 24,
        fontWeight: '800',
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
        fontSize: 17,
        fontWeight: '700',
    },

    // Modal Styles
    modalScrollOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    modalScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    modalInnerContent: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.TEXT.primary,
    },
    formContainer: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.TEXT.secondary,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: Colors.BACKGROUND.secondary,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        color: Colors.TEXT.primary,
    },
    rowInputs: {
        flexDirection: 'row',
    },
    saveAddressButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    saveAddressButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default CheckoutScreen;
