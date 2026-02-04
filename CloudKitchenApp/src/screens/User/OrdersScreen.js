import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../styles/colors';
import { getOrders, cancelOrder } from '../../api/order';

const OrdersScreen = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        const result = await getOrders();
        if (result.success) {
            setOrders(result.data);
        }
        setLoading(false);
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const handleCancel = async (orderId) => {
        const result = await cancelOrder(orderId);
        if (result.success) {
            alert("Order Cancelled");
            fetchOrders();
        } else {
            alert(result.error);
        }
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
                    <Text key={index} style={styles.orderItemText}>
                        {orderItem.quantity}x {orderItem.food_item?.name || 'Item'}
                    </Text>
                ))}
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.totalAmount}>Total: ₹{item.total_amount}</Text>
                {item.status === 'pending' && (
                    <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                )}
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Orders</Text>
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No orders found</Text>
                    </View>
                }
            />
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
    },
    emptyText: {
        color: Colors.TEXT.secondary,
        fontSize: 16,
    }
});

export default OrdersScreen;
