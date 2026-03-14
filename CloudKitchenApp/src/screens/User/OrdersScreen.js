import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../styles/colors';
import { getOrders, cancelOrder, rateOrder } from '../../api/order';
import TabBar from '../../components/TabBar';
import { useAuth } from '../../context/AuthContext';
import GuestPrompt from '../../components/GuestPrompt';

// Tab definitions for order status filter
const ORDER_TABS = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
];

const OrdersScreen = ({ navigation }) => {
    const { isGuest } = useAuth();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [ratingModalVisible, setRatingModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);

    const fetchOrders = async () => {
        const result = await getOrders();
        if (result.success) {
            setOrders(result.data);
        }
        setLoading(false);
        setRefreshing(false);
    };

    // useFocusEffect MUST be before early return (Rules of Hooks)
    useFocusEffect(
        useCallback(() => {
            if (isGuest) return;
            fetchOrders();
        }, [isGuest])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    // Early return AFTER ALL hooks
    if (isGuest) return <GuestPrompt feature="orders" />;

    const handleCancel = async (orderId) => {
        const result = await cancelOrder(orderId);
        if (result.success) {
            Alert.alert("Success", "Order cancelled successfully");
            fetchOrders();
        } else {
            Alert.alert("Error", result.error);
        }
    };

    const openRatingModal = (order) => {
        setSelectedOrder(order);
        setRating(0);
        setReview('');
        setRatingModalVisible(true);
    };

    const closeRatingModal = () => {
        setRatingModalVisible(false);
        setSelectedOrder(null);
        setRating(0);
        setReview('');
    };

    const handleSubmitRating = async () => {
        if (rating === 0) {
            Alert.alert("Rating Required", "Please select a rating before submitting");
            return;
        }

        setSubmittingRating(true);
        const result = await rateOrder(selectedOrder.id, {
            stars: rating,
            review: review.trim() || null
        });
        setSubmittingRating(false);

        if (result.success) {
            Alert.alert("Success", result.message || "Thank you for rating!");
            closeRatingModal();
            fetchOrders();
        } else {
            Alert.alert("Error", result.error);
        }
    };

    const renderStars = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        style={styles.starButton}
                    >
                        <Text style={[
                            styles.starIcon,
                            star <= rating && styles.starIconActive
                        ]}>
                            {star <= rating ? '★' : '☆'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>
            <Text style={styles.orderDate}>{new Date(item.created_at).toDateString()}</Text>

            <View style={styles.itemsList}>
                {item.items && item.items.map((orderItem, index) => (
                    <View key={index} style={styles.orderItemCard}>
                        {orderItem.food_item?.image && (
                            <Image
                                source={{ uri: orderItem.food_item.image_url }}
                                style={styles.orderItemImage}
                            />
                        )}
                        <View style={styles.orderItemInfo}>
                            <View style={styles.orderItemHeader}>
                                <Text style={styles.orderItemName} numberOfLines={1}>
                                    {orderItem.food_name}
                                </Text>
                                <View style={[styles.vegBadgeItem, { borderColor: orderItem.food_item?.type === 'veg' ? 'green' : 'red' }]}>
                                    <View style={[styles.vegDotItem, { backgroundColor: orderItem.food_item?.type === 'veg' ? 'green' : 'red' }]} />
                                </View>
                            </View>
                            <Text style={styles.orderItemDetails}>
                                {orderItem.quantity} x ₹{orderItem.price}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {item.delivery_boy ? (
                <View style={styles.deliveryPartnerBox}>
                    <View style={styles.deliveryPartnerHeader}>
                        <Text style={styles.deliveryPartnerTitle}>🚚 Delivery Partner</Text>
                    </View>
                    <View style={styles.deliveryPartnerInfo}>
                        <View style={styles.deliveryPartnerDetails}>
                            <Text style={styles.deliveryPartnerName}>{item.delivery_boy.name}</Text>
                            {item.delivery_boy.phone && (
                                <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.delivery_boy.phone}`)}>
                                    <Text style={styles.deliveryPartnerPhone}>{item.delivery_boy.phone}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {item.delivery_boy.phone && (
                            <TouchableOpacity
                                style={styles.callButton}
                                onPress={() => Linking.openURL(`tel:${item.delivery_boy.phone}`)}
                            >
                                <Ionicons name="call" size={18} color={Colors.white} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ) : (
                item.status !== 'cancelled' && item.status !== 'delivered' && (
                    <View style={styles.assignedSoonBox}>
                        <Text style={styles.assignedSoonText}>🚚 Delivery partner will be assigned soon.</Text>
                    </View>
                )
            )}

            <View style={styles.orderFooter}>
                <Text style={styles.totalAmount}>Total: ₹{item.total_amount}</Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Invoice', { order: item })}
                        style={styles.invoiceButton}
                    >
                        <Text style={styles.invoiceButtonText}>📄 Invoice</Text>
                    </TouchableOpacity>
                    
                    {item.delivery_boy ? (
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert("Track Order", "Live tracking feature coming soon!");
                            }}
                            style={styles.trackButton}
                        >
                            <Text style={styles.trackButtonText}>📍 Track</Text>
                        </TouchableOpacity>
                    ) : null}
                    {item.status === 'pending' && (
                        <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                    {item.status === 'delivered' && (
                        item.is_rated ? (
                            <View style={styles.ratedBadge}>
                                <Text style={styles.ratedBadgeText}>✓ Rated</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => openRatingModal(item)}
                                style={styles.rateButton}
                            >
                                <Text style={styles.rateButtonText}>⭐ Rate</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>
            </View>
        </View>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'confirmed': return 'blue';
            case 'delivered': return 'green';
            case 'cancelled': return 'red';
            default: return 'gray';
        }
    };

    if (loading && orders.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Filter orders by active tab (client-side)
    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(o => o.status === activeTab);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Orders</Text>
            </View>

            {/* WhatsApp-style horizontal tab bar */}
            <TabBar
                tabs={ORDER_TABS}
                activeTab={activeTab}
                onTabPress={setActiveTab}
            />

            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>
                            {activeTab === 'all' ? 'No orders yet' : `No ${activeTab} orders`}
                        </Text>
                    </View>
                }
            />

            {/* Rating Modal */}
            <Modal
                visible={ratingModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeRatingModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rate Your Order</Text>
                        <Text style={styles.modalSubtitle}>
                            Order #{selectedOrder?.id}
                        </Text>

                        {renderStars()}

                        <TextInput
                            style={styles.reviewInput}
                            placeholder="Share your experience (optional)"
                            placeholderTextColor={Colors.TEXT.tertiary || '#999'}
                            value={review}
                            onChangeText={setReview}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            maxLength={500}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={closeRatingModal}
                                style={[styles.modalButton, styles.cancelModalButton]}
                                disabled={submittingRating}
                            >
                                <Text style={styles.cancelModalButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSubmitRating}
                                style={[styles.modalButton, styles.submitButton]}
                                disabled={submittingRating}
                            >
                                {submittingRating ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit Rating</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    centered: {
        padding: 50,
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
    orderCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.TEXT.primary,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    statusText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    orderDate: {
        fontSize: 12,
        color: Colors.TEXT.secondary,
        marginBottom: 12,
    },
    itemsList: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    orderItemText: {
        fontSize: 14,
        color: Colors.TEXT.primary,
        marginBottom: 4,
    },
    orderItemCard: {
        flexDirection: 'row',
        backgroundColor: Colors.BACKGROUND.secondary,
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    orderItemImage: {
        width: 45,
        height: 45,
        borderRadius: 6,
        backgroundColor: '#eee',
    },
    orderItemInfo: {
        flex: 1,
        marginLeft: 10,
    },
    orderItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderItemName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.TEXT.primary,
        flex: 1,
    },
    orderItemDetails: {
        fontSize: 12,
        color: Colors.TEXT.secondary,
        marginTop: 2,
    },
    vegBadgeItem: {
        width: 14,
        height: 14,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    vegDotItem: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    deliveryPartnerBox: {
        backgroundColor: '#F0F9FF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    deliveryPartnerHeader: {
        marginBottom: 8,
    },
    deliveryPartnerTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0369A1',
    },
    deliveryPartnerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deliveryPartnerDetails: {
        flex: 1,
    },
    deliveryPartnerName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },
    deliveryPartnerPhone: {
        fontSize: 14,
        color: '#0369A1',
        marginTop: 2,
        textDecorationLine: 'underline',
    },
    callButton: {
        backgroundColor: '#10B981',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    assignedSoonBox: {
        backgroundColor: Colors.BACKGROUND.secondary,
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
    },
    assignedSoonText: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: 'red',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    cancelButtonText: {
        color: 'red',
        fontSize: 12,
        fontWeight: '600',
    },
    invoiceButton: {
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    invoiceButtonText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    trackButton: {
        borderWidth: 1,
        borderColor: '#10B981',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 4,
    },
    trackButtonText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '600',
    },
    rateButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    rateButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    ratedBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#E8F5E9',
        borderWidth: 1,
        borderColor: '#2E7D32',
    },
    ratedBadgeText: {
        color: '#2E7D32',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyText: {
        color: Colors.TEXT.secondary,
        fontSize: 16,
    },
    // Rating Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 4,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
        marginBottom: 20,
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    starButton: {
        padding: 8,
    },
    starIcon: {
        fontSize: 36,
        color: '#ccc',
    },
    starIconActive: {
        color: '#FFD700',
    },
    reviewInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: Colors.TEXT.primary,
        minHeight: 100,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    cancelModalButton: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelModalButtonText: {
        color: Colors.TEXT.secondary,
        fontSize: 15,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: Colors.primary,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default OrdersScreen;
