import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../styles/colors';
import { getMenu } from '../../api/menu';
import { addToCart } from '../../api/cart';

const MenuScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchMenu = async () => {
        setLoading(true);
        const result = await getMenu({ search: searchText });
        if (result.success) {
            setCategories(result.data);
            if (result.data.length > 0 && !selectedCategory) {
                // setSelectedCategory(result.data[0].id);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleAddToCart = async (foodId) => {
        const result = await addToCart(foodId);
        if (result.success) {
            alert(result.message); // Simple feedback for now
        } else {
            alert(result.error);
        }
    };

    const renderFoodItem = ({ item }) => (
        <View style={styles.foodCard}>
            <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
                style={styles.foodImage}
            />
            <View style={styles.foodInfo}>
                <View style={styles.foodHeader}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <View style={[styles.vegBadge, { borderColor: item.type === 'veg' ? 'green' : 'red' }]}>
                        <View style={[styles.vegDot, { backgroundColor: item.type === 'veg' ? 'green' : 'red' }]} />
                    </View>
                </View>
                <Text style={styles.foodDescription} numberOfLines={2}>{item.description}</Text>
                <View style={styles.foodFooter}>
                    <Text style={styles.foodPrice}>₹{item.price}</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(item.id)}
                    >
                        <Text style={styles.addButtonText}>ADD</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderCategory = ({ item }) => (
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{item.name}</Text>
            <FlatList
                data={item.food_items}
                renderItem={renderFoodItem}
                keyExtractor={food => food.id.toString()}
                scrollEnabled={false}
            />
        </View>
    );

    if (loading && categories.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search food..."
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={fetchMenu}
                />
            </View>

            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={fetchMenu}
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
    },
    header: {
        backgroundColor: Colors.white,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.TEXT.primary,
    },
    searchContainer: {
        padding: 16,
        backgroundColor: Colors.white,
    },
    searchInput: {
        backgroundColor: Colors.BACKGROUND.secondary,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    listContent: {
        padding: 16,
    },
    categoryContainer: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: Colors.TEXT.primary,
    },
    foodCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: 'row',
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    foodImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    foodInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    foodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    foodName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.TEXT.primary,
        flex: 1,
    },
    vegBadge: {
        width: 16,
        height: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    foodDescription: {
        fontSize: 12,
        color: Colors.TEXT.secondary,
        marginVertical: 4,
    },
    foodFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    foodPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.TEXT.primary,
    },
    addButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 6,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
    },
    addButtonText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default MenuScreen;
