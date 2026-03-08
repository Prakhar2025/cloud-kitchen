import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getHistory } from '../../api/delivery';
import Colors from '../../styles/colors';

const DeliveryHistoryScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = async () => {
        try {
            const result = await getHistory();
            if (result.success) {
                setOrders(result.data.orders);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadHistory();
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.label}>Customer: <Text style={styles.value}>{item.address?.name || 'N/A'}</Text></Text>
                <Text style={styles.label}>Address: <Text style={styles.value}>{item.address?.address_line_1}, {item.address?.city}</Text></Text>
                <Text style={styles.label}>Total: <Text style={styles.value}>₹{item.total_amount}</Text></Text>
                <Text style={[styles.status, { color: item.status === 'delivered' ? '#4CAF50' : Colors.primary }]}>
                    Status: {item.status.toUpperCase()}
                </Text>
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
                <Text style={styles.headerTitle}>Delivery History</Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>You haven't delivered any orders yet.</Text>
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
    list: { padding: 15 },
    card: { backgroundColor: Colors.white, borderRadius: 10, padding: 15, marginBottom: 15, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    orderId: { fontSize: 18, fontWeight: 'bold' },
    date: { color: '#888', fontSize: 12 },
    cardBody: { marginBottom: 5 },
    label: { fontSize: 14, color: '#666', marginBottom: 5 },
    value: { color: '#333', fontWeight: 'bold' },
    status: { fontSize: 14, fontWeight: 'bold', marginTop: 10 },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { marginTop: 15, fontSize: 16, color: '#999' }
});

export default DeliveryHistoryScreen;
