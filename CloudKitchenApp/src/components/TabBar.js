/**
 * ============================================================================
 * TabBar — WhatsApp-style horizontal scrollable tabs
 * ============================================================================
 *
 * Reusable tab bar with animated underline indicator.
 * Zero external dependencies — pure React Native Animated API.
 *
 * Props:
 *   tabs       : [{ key: string, label: string }]
 *   activeTab  : string  (key of active tab)
 *   onTabPress : (key: string) => void
 *
 * Usage:
 *   <TabBar
 *     tabs={[{ key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' }]}
 *     activeTab={activeTab}
 *     onTabPress={setActiveTab}
 *   />
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    StyleSheet,
    Platform,
} from 'react-native';
import Colors from '../styles/colors';

const TabBar = ({ tabs = [], activeTab, onTabPress }) => {
    const scrollRef = useRef(null);
    const indicatorX = useRef(new Animated.Value(0)).current;
    const indicatorW = useRef(new Animated.Value(0)).current;
    const tabLayouts = useRef({});
    const [ready, setReady] = useState(false);

    // When active tab changes, animate indicator + scroll to keep active tab visible
    const animateToTab = useCallback((key) => {
        const layout = tabLayouts.current[key];
        if (!layout) return;

        Animated.parallel([
            Animated.spring(indicatorX, {
                toValue: layout.x,
                useNativeDriver: false,
                tension: 80,
                friction: 10,
            }),
            Animated.spring(indicatorW, {
                toValue: layout.width,
                useNativeDriver: false,
                tension: 80,
                friction: 10,
            }),
        ]).start();

        // Auto-scroll to keep active tab visible
        scrollRef.current?.scrollTo({
            x: Math.max(0, layout.x - 32),
            animated: true,
        });
    }, [indicatorX, indicatorW]);

    useEffect(() => {
        if (ready) {
            animateToTab(activeTab);
        }
    }, [activeTab, ready, animateToTab]);

    const handleLayout = (key, event) => {
        const { x, width } = event.nativeEvent.layout;
        tabLayouts.current[key] = { x, width };

        // Once all tabs have reported, set initial position
        if (Object.keys(tabLayouts.current).length === tabs.length) {
            const initial = tabLayouts.current[activeTab];
            if (initial) {
                indicatorX.setValue(initial.x);
                indicatorW.setValue(initial.width);
                setReady(true);
            }
        }
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollContent}
            >
                {tabs.map((tab) => {
                    const isActive = tab.key === activeTab;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.tab}
                            onPress={() => onTabPress(tab.key)}
                            onLayout={(e) => handleLayout(tab.key, e)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                {/* Animated underline indicator */}
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            left: indicatorX,
                            width: indicatorW,
                        },
                    ]}
                />
            </ScrollView>

            {/* Bottom border for the whole tab bar */}
            <View style={styles.bottomBorder} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 2,
            },
            android: { elevation: 2 },
        }),
    },
    scrollContent: {
        paddingHorizontal: 8,
        paddingBottom: 0,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.TEXT.secondary,
        letterSpacing: 0.1,
    },
    tabLabelActive: {
        color: Colors.primary,
        fontWeight: '700',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    bottomBorder: {
        height: 1,
        backgroundColor: Colors.border,
    },
});

export default TabBar;
