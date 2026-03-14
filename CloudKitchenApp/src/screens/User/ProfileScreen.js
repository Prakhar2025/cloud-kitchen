import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { getAddresses, addAddress, deleteAddress } from '../../api/user';
import { useFocusEffect } from '@react-navigation/native';
import TabBar from '../../components/TabBar';
import GuestPrompt from '../../components/GuestPrompt';

const PROFILE_TABS = [
    { key: 'profile', label: 'Profile' },
    { key: 'addresses', label: 'My Addresses' },
];

const ProfileScreen = ({ navigation }) => {
    const { user, logout, isGuest } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        address_line1: '',
        city: '',
        state: '',
        zip_code: ''
    });

    const fetchAddresses = async () => {
        const result = await getAddresses();
        if (result.success) {
            setAddresses(result.data);
        }
    };

    // useFocusEffect MUST be before early return (Rules of Hooks)
    useFocusEffect(
        useCallback(() => {
            if (isGuest) return;
            fetchAddresses();
        }, [isGuest])
    );

    // Early return AFTER ALL hooks
    if (isGuest) return <GuestPrompt feature="profile" />;

    const handleAddAddress = async () => {
        if (!newAddress.address_line1 || !newAddress.city || !newAddress.zip_code) {
            Alert.alert("Error", "Please fill required fields");
            return;
        }

        const result = await addAddress(newAddress);
        if (result.success) {
            Alert.alert("Success", "Address added");
            setNewAddress({ ...newAddress, address_line1: '', city: '', state: '', zip_code: '' });
            setShowAddAddress(false);
            fetchAddresses();
        } else {
            Alert.alert("Error", result.error);
        }
    };

    const handleDeleteAddress = async (id) => {
        const result = await deleteAddress(id);
        if (result.success) fetchAddresses();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Account</Text>
            </View>

            {/* WhatsApp-style tab bar */}
            <TabBar
                tabs={PROFILE_TABS}
                activeTab={activeTab}
                onTabPress={setActiveTab}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* ── Profile Tab ── */}
                {activeTab === 'profile' && (
                    <View style={styles.profileHeader}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.name}>{user?.name}</Text>
                        <Text style={styles.email}>{user?.email}</Text>
                        
                        <TouchableOpacity 
                            style={styles.editProfileBtn} 
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* ── Addresses Tab ── */}
                {activeTab === 'addresses' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>My Addresses</Text>
                            <TouchableOpacity onPress={() => setShowAddAddress(!showAddAddress)}>
                                <Text style={styles.addText}>{showAddAddress ? 'Cancel' : '+ Add New'}</Text>
                            </TouchableOpacity>
                        </View>

                        {showAddAddress && (
                            <View style={styles.form}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    value={newAddress.name}
                                    onChangeText={t => setNewAddress({ ...newAddress, name: t })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone"
                                    value={newAddress.phone}
                                    onChangeText={t => setNewAddress({ ...newAddress, phone: t })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Address Line 1"
                                    value={newAddress.address_line1}
                                    onChangeText={t => setNewAddress({ ...newAddress, address_line1: t })}
                                />
                                <View style={styles.row}>
                                    <TextInput
                                        style={[styles.input, { flex: 1, marginRight: 8 }]}
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChangeText={t => setNewAddress({ ...newAddress, city: t })}
                                    />
                                    <TextInput
                                        style={[styles.input, { flex: 1 }]}
                                        placeholder="Zip Code"
                                        value={newAddress.zip_code}
                                        onChangeText={t => setNewAddress({ ...newAddress, zip_code: t })}
                                    />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="State"
                                    value={newAddress.state}
                                    onChangeText={t => setNewAddress({ ...newAddress, state: t })}
                                />
                                <TouchableOpacity style={styles.saveBtn} onPress={handleAddAddress}>
                                    <Text style={styles.saveBtnText}>Save Address</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {addresses.length === 0 && !showAddAddress && (
                            <View style={styles.emptyAddresses}>
                                <Text style={styles.emptyAddressText}>No addresses saved yet.</Text>
                                <TouchableOpacity onPress={() => setShowAddAddress(true)}>
                                    <Text style={styles.addText}>+ Add your first address</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {addresses.map(addr => (
                            <View key={addr.id} style={styles.addressCard}>
                                <View>
                                    <Text style={styles.addrName}>{addr.name}</Text>
                                    <Text style={styles.addrText}>{addr.address_line1}, {addr.city} {addr.zip_code}</Text>
                                    <Text style={styles.addrText}>Phone: {addr.phone}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDeleteAddress(addr.id)}>
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND.secondary,
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
    content: {
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.PRIMARY.light,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.white,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.TEXT.primary,
    },
    email: {
        fontSize: 16,
        color: Colors.TEXT.secondary,
        marginBottom: 16,
    },
    editProfileBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 12,
    },
    editProfileText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    logoutBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#fee',
        borderRadius: 20,
    },
    logoutText: {
        color: 'red',
        fontWeight: '600',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.TEXT.primary,
    },
    addText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    form: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    input: {
        backgroundColor: Colors.BACKGROUND.secondary,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveBtnText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    addressCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addrName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    addrText: {
        color: Colors.TEXT.secondary,
        fontSize: 14,
    },
    deleteText: {
        color: 'red',
        fontSize: 12,
    },
    emptyAddresses: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyAddressText: {
        color: Colors.TEXT.secondary,
        fontSize: 15,
        marginBottom: 12,
    },
});

export default ProfileScreen;
