import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../styles/colors';
import { getMenu } from '../../api/menu';
import { addToCart } from '../../api/cart';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32; // Screen width minus horizontal padding

const MenuScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);
    const animationRef = useRef(null);
    const isPaused = useRef(false);

    const fetchMenu = async () => {
        setLoading(true);
        const result = await getMenu({ search: searchText });
        if (result.success) {
            // Handle both old format (array) and new format (object with banners + categories)
            if (Array.isArray(result.data)) {
                // Old format: just categories array
                setCategories(result.data);
                setBanners([]);
            } else {
                // New format: object with banners and categories
                setCategories(result.data.categories || []);
                setBanners(result.data.banners || []);
            }
        }
        setLoading(false);
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    };

    const renderCategoryFilterItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryFilterItem}
            onPress={() => handleCategorySelect(item.id)}
        >
            <View style={[
                styles.categoryImageContainer,
                selectedCategory === item.id && styles.selectedCategoryContainer
            ]}>
                <Image
                    source={{ uri: item.image_url || 'https://via.placeholder.com/100' }}
                    style={styles.categoryFilterImage}
                />
            </View>
            <Text style={[
                styles.categoryFilterName,
                selectedCategory === item.id && styles.selectedCategoryText
            ]} numberOfLines={1}>{item.name}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        fetchMenu();
    }, []);

    // Auto-scroll animation for category filter (exactly like website)
    useEffect(() => {
        if (categories.length > 0) {
            // Calculate total width of ONE set of categories (not duplicated)
            const categoryWidth = 120; // Each category item width
            const gap = 16; // Gap between items
            const totalWidth = (categories.length + 1) * (categoryWidth + gap); // +1 for "All"
            
            // Create looping animation
            animationRef.current = Animated.loop(
                Animated.timing(scrollX, {
                    toValue: -totalWidth, // Scroll exactly one set width (50%)
                    duration: 30000, // 30 seconds like website
                    useNativeDriver: true,
                    easing: (t) => t, // Linear like website
                })
            );
            
            // Start animation
            isPaused.current = false;
            animationRef.current.start();

            return () => {
                if (animationRef.current) {
                    animationRef.current.stop();
                }
            };
        }
    }, [categories]);

    // Pause animation - can be called multiple times
    const pauseAnimation = () => {
        if (animationRef.current && !isPaused.current) {
            animationRef.current.stop();
            isPaused.current = true;
        }
    };

    // Resume animation - recreates and restarts, works multiple times
    const resumeAnimation = () => {
        if (categories.length > 0 && isPaused.current) {
            const categoryWidth = 120;
            const gap = 16;
            const totalWidth = (categories.length + 1) * (categoryWidth + gap);
            
            // Get current scroll position
            const currentValue = scrollX._value;
            
            // Reset to start position when reaching end (for seamless loop)
            if (currentValue <= -totalWidth) {
                scrollX.setValue(0);
            }
            
            // Recreate the animation from current position
            animationRef.current = Animated.loop(
                Animated.timing(scrollX, {
                    toValue: -totalWidth,
                    duration: 30000,
                    useNativeDriver: true,
                    easing: (t) => t,
                })
            );
            
            isPaused.current = false;
            animationRef.current.start();
        }
    };

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

    const filteredCategories = selectedCategory
        ? categories.filter(cat => cat.id === selectedCategory)
        : categories;

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

            <View style={styles.categoryFilterContainer}>
                <Animated.View
                    style={[
                        styles.categoryScrollWrapper,
                        { transform: [{ translateX: scrollX }] }
                    ]}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={pauseAnimation}
                    onResponderRelease={resumeAnimation}
                >
                    {/* First set - "All" + categories */}
                    <TouchableOpacity
                        style={styles.categoryFilterItem}
                        onPress={() => handleCategorySelect(null)}
                    >
                        <View style={[
                            styles.categoryImageContainer,
                            selectedCategory === null && styles.selectedCategoryContainer
                        ]}>
                            <Image
                                source={{ uri: 'https://img.icons8.com/color/96/000000/restaurant.png' }}
                                style={styles.categoryFilterImage}
                            />
                        </View>
                        <Text style={[
                            styles.categoryFilterName,
                            selectedCategory === null && styles.selectedCategoryText
                        ]} numberOfLines={1}>All</Text>
                    </TouchableOpacity>

                    {categories.map((item) => (
                        <TouchableOpacity
                            key={`first-${item.id}`}
                            style={styles.categoryFilterItem}
                            onPress={() => handleCategorySelect(item.id)}
                        >
                            <View style={[
                                styles.categoryImageContainer,
                                selectedCategory === item.id && styles.selectedCategoryContainer
                            ]}>
                                <Image
                                    source={{ uri: item.image_url || 'https://via.placeholder.com/100' }}
                                    style={styles.categoryFilterImage}
                                />
                            </View>
                            <Text style={[
                                styles.categoryFilterName,
                                selectedCategory === item.id && styles.selectedCategoryText
                            ]} numberOfLines={1}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Duplicate set - "All" + categories (for infinite loop) */}
                    <TouchableOpacity
                        style={styles.categoryFilterItem}
                        onPress={() => handleCategorySelect(null)}
                    >
                        <View style={[
                            styles.categoryImageContainer,
                            selectedCategory === null && styles.selectedCategoryContainer
                        ]}>
                            <Image
                                source={{ uri: 'https://img.icons8.com/color/96/000000/restaurant.png' }}
                                style={styles.categoryFilterImage}
                            />
                        </View>
                        <Text style={[
                            styles.categoryFilterName,
                            selectedCategory === null && styles.selectedCategoryText
                        ]} numberOfLines={1}>All</Text>
                    </TouchableOpacity>

                    {categories.map((item) => (
                        <TouchableOpacity
                            key={`second-${item.id}`}
                            style={styles.categoryFilterItem}
                            onPress={() => handleCategorySelect(item.id)}
                        >
                            <View style={[
                                styles.categoryImageContainer,
                                selectedCategory === item.id && styles.selectedCategoryContainer
                            ]}>
                                <Image
                                    source={{ uri: item.image_url || 'https://via.placeholder.com/100' }}
                                    style={styles.categoryFilterImage}
                                />
                            </View>
                            <Text style={[
                                styles.categoryFilterName,
                                selectedCategory === item.id && styles.selectedCategoryText
                            ]} numberOfLines={1}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </View>

            <FlatList
                data={filteredCategories}
                renderItem={renderCategory}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={fetchMenu}
                ListHeaderComponent={
                    banners.length > 0 ? (
                        <View style={styles.bannersSection}>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                decelerationRate="fast"
                                snapToInterval={BANNER_WIDTH + 16}
                                snapToAlignment="start"
                                contentContainerStyle={styles.bannerScrollContent}
                            >
                                {banners.map((banner, index) => (
                                    <View key={banner.id} style={styles.bannerContainer}>
                                        <Image
                                            source={{ uri: banner.image_url }}
                                            style={styles.bannerImage}
                                            resizeMode="cover"
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    ) : null
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
    categoryFilterContainer: {
        backgroundColor: Colors.white,
        paddingVertical: 16,
        overflow: 'hidden',
        height: 120,
    },
    categoryScrollWrapper: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    categoryFilterItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 100,
    },
    categoryImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        padding: 2,
        borderWidth: 2,
        borderColor: 'transparent',
        marginBottom: 6,
        backgroundColor: Colors.white,
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 3,
    },
    selectedCategoryContainer: {
        borderColor: Colors.primary,
    },
    categoryFilterImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    categoryFilterName: {
        fontSize: 12,
        color: Colors.TEXT.secondary,
        textAlign: 'center',
        fontWeight: '500',
    },
    selectedCategoryText: {
        color: Colors.primary,
        fontWeight: 'bold',
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
    // Banner Styles
    bannersSection: {
        marginBottom: 16,
    },
    bannerScrollContent: {
        paddingHorizontal: 16,
    },
    bannerContainer: {
        width: BANNER_WIDTH,
        height: 180,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
});

export default MenuScreen;
