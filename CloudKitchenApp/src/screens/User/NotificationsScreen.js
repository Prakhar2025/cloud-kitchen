import React, { useState, useCallback } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    RefreshControl,
    TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../styles/colors';
import { getNotifications } from '../../api/notification';

const NotificationsScreen = () => {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        const result = await getNotifications();
        if (result.success) {
            setNotifications(result.data);
        }
        setLoading(false);
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity 
            style={[
                styles.notificationCard,
                !item.is_read && styles.unreadCard
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.notificationContent}>
                <View style={styles.iconContainer}>
                    <View style={[
                        styles.iconCircle,
                        { backgroundColor: !item.is_read ? Colors.primary : '#F3F4F6' }
                    ]}>
                        <Text style={styles.iconText}>🔔</Text>
                    </View>
                </View>
                
                <View style={styles.textContainer}>
                    <Text style={[
                        styles.notificationMessage,
                        !item.is_read && styles.unreadText
                    ]}>
                        {item.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                        {formatDate(item.created_at)}
                    </Text>
                </View>

                {!item.is_read && (
                    <View style={styles.unreadDot} />
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading && notifications.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                {notifications.some(n => !n.is_read) && (
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {notifications.filter(n => !n.is_read).length}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                        tintColor={Colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🔕</Text>
                        <Text style={styles.emptyTitle}>No Notifications</Text>
                        <Text style={styles.emptyText}>
                            You're all caught up! We'll notify you when something important happens.
                        </Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.TEXT.primary,
    },
    badgeContainer: {
        marginLeft: 8,
    },
    badge: {
        backgroundColor: '#EF4444',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    notificationCard: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
        backgroundColor: '#FFF5F5',
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        marginRight: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
    },
    textContainer: {
        flex: 1,
        paddingRight: 8,
    },
    notificationMessage: {
        fontSize: 15,
        lineHeight: 20,
        color: Colors.TEXT.secondary,
        marginBottom: 6,
    },
    unreadText: {
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },
    notificationTime: {
        fontSize: 12,
        color: Colors.TEXT.tertiary || '#999',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 100,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 15,
        color: Colors.TEXT.tertiary || '#999',
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default NotificationsScreen;
