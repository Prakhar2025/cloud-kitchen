import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../styles/colors';

const DeliveryProfileScreen = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => logout(), style: 'destructive' }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={40} color={Colors.white} />
                </View>
                <Text style={styles.name}>{user?.name || 'Delivery Partner'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>DELIVERY</Text>
                </View>
            </View>

            <View style={styles.menuSection}>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <View style={styles.menuIconContainer}>
                        <Ionicons name="log-out-outline" size={24} color="#F44336" />
                    </View>
                    <Text style={[styles.menuText, { color: '#F44336' }]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 20, backgroundColor: Colors.white, elevation: 2 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
    profileSection: { backgroundColor: Colors.white, padding: 30, alignItems: 'center', marginTop: 2, marginBottom: 20 },
    avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    email: { fontSize: 16, color: '#666', marginBottom: 10 },
    roleBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    roleText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 12 },
    menuSection: { backgroundColor: Colors.white, paddingVertical: 10 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    menuIconContainer: { width: 40, alignItems: 'center', marginRight: 15 },
    menuText: { fontSize: 16, color: '#333', fontWeight: '500' }
});

export default DeliveryProfileScreen;
