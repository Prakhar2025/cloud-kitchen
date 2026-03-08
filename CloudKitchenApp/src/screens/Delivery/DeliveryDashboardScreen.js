import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDashboardInfo, updateOrderStatus } from '../../api/delivery';
import Colors from '../../styles/colors';

const DeliveryDashboardScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [totalDelivered, setTotalDelivered] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadDashboard = async () => {
        try {
            const result = await getDashboardInfo();
            if (result.success) {
                setOrders(result.data.active_orders);
                setTotalDelivered(result.data.total_delivered);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboard();
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setLoading(true);
            const result = await updateOrderStatus(orderId, newStatus);
            if (result.success) {
                Alert.alert('Success', result.message);
                loadDashboard();
            }
        } catch (error) {
            Alert.alert('Error', error.message);
            setLoading(false);
        }
    };

    const StatusButton = ({ title, status, orderId, color }) => (
        <TouchableOpacity
            style={[styles.statusBtn, { backgroundColor: color }]}
            onPress={() => handleUpdateStatus(orderId, status)}
        >
            <Text style={styles.statusBtnText}>{title}</Text>
        </TouchableOpacity>
    );

    const renderOrderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.label}>Customer: <Text style={styles.value}>{item.address?.name || 'N/A'}</Text></Text>
                <Text style={styles.label}>Phone: <Text style={styles.value}>{item.address?.phone || 'N/A'}</Text></Text>
                <Text style={styles.label}>Address: <Text style={styles.value}>{item.address?.address_line_1}, {item.address?.city}</Text></Text>
                <Text style={styles.label}>Total: <Text style={styles.value}>₹{item.total_amount}</Text> ({item.payment_method.toUpperCase()})</Text>
            </View>

            <View style={styles.cardActions}>
                {item.status !== 'out_for_delivery' && (
                    <StatusButton title="Mark Out for Delivery" status="out_for_delivery" orderId={item.id} color={Colors.primary} />
                )}
                <StatusButton title="Mark Delivered" status="delivered" orderId={item.id} color="#4CAF50" />
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Delivery Dashboard</Text>
                <Text style={styles.statText}>Total Delivered: {totalDelivered}</Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="bicycle-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No active orders assigned to you.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: Colors.white, elevation: 2, marginBottom: 10 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
    statText: { fontSize: 16, color: '#666', marginTop: 5 },
    list: { padding: 15 },
    card: { backgroundColor: Colors.white, borderRadius: 10, padding: 15, marginBottom: 15, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    orderId: { fontSize: 18, fontWeight: 'bold' },
    badge: { backgroundColor: '#e3f2fd', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
    badgeText: { color: '#1976d2', fontSize: 12, fontWeight: 'bold' },
    cardBody: { marginBottom: 15 },
    label: { fontSize: 14, color: '#666', marginBottom: 3 },
    value: { color: '#333', fontWeight: 'bold' },
    cardActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    statusBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
    statusBtnText: { color: Colors.white, fontWeight: 'bold', fontSize: 14 },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { marginTop: 15, fontSize: 16, color: '#999' }
});

export default DeliveryDashboardScreen;
