/**
 * ============================================================================
 * CustomButton Component
 * ============================================================================
 * 
 * A beautifully styled, reusable button component with:
 * - Multiple variants (primary, secondary, outline)
 * - Loading state with spinner
 * - Disabled state styling
 * - Press animations
 * - Professional design
 */

import React, { useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    Animated,
    View,
} from 'react-native';
import Colors from '../styles/colors';

/**
 * CustomButton - Reusable button component
 * 
 * @param {Object} props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.disabled - Disable button
 * @param {string} props.variant - 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} props.size - 'small' | 'medium' | 'large'
 * @param {string} props.icon - Icon to display before text
 * @param {Object} props.style - Additional container styles
 * @param {Object} props.textStyle - Additional text styles
 */
const CustomButton = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    size = 'large',
    icon,
    style,
    textStyle,
    ...props
}) => {
    // Animation for press effect
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Handle press in animation
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    // Handle press out animation
    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    // Get variant styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return {
                    container: styles.secondaryContainer,
                    text: styles.secondaryText,
                };
            case 'outline':
                return {
                    container: styles.outlineContainer,
                    text: styles.outlineText,
                };
            case 'ghost':
                return {
                    container: styles.ghostContainer,
                    text: styles.ghostText,
                };
            case 'primary':
            default:
                return {
                    container: styles.primaryContainer,
                    text: styles.primaryText,
                };
        }
    };

    // Get size styles
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    container: styles.smallContainer,
                    text: styles.smallText,
                };
            case 'medium':
                return {
                    container: styles.mediumContainer,
                    text: styles.mediumText,
                };
            case 'large':
            default:
                return {
                    container: styles.largeContainer,
                    text: styles.largeText,
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();
    const isDisabled = disabled || loading;

    return (
        <Animated.View
            style={[
                { transform: [{ scale: scaleAnim }] },
                styles.animatedContainer,
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.baseContainer,
                    variantStyles.container,
                    sizeStyles.container,
                    isDisabled && styles.disabledContainer,
                    style,
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isDisabled}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={title}
                accessibilityState={{ disabled: isDisabled }}
                {...props}
            >
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={variant === 'outline' || variant === 'ghost'
                            ? Colors.primary
                            : Colors.white}
                    />
                ) : (
                    <View style={styles.contentContainer}>
                        {icon && <Text style={styles.icon}>{icon}</Text>}
                        <Text
                            style={[
                                styles.baseText,
                                variantStyles.text,
                                sizeStyles.text,
                                isDisabled && styles.disabledText,
                                textStyle,
                            ]}
                        >
                            {title}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
    animatedContainer: {
        width: '100%',
    },
    baseContainer: {
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 18,
        marginRight: 8,
    },
    baseText: {
        fontWeight: '600',
        textAlign: 'center',
    },

    // Primary variant
    primaryContainer: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryText: {
        color: Colors.white,
    },

    // Secondary variant
    secondaryContainer: {
        backgroundColor: Colors.NEUTRAL.gray100,
    },
    secondaryText: {
        color: Colors.TEXT.primary,
    },

    // Outline variant
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    outlineText: {
        color: Colors.primary,
    },

    // Ghost variant
    ghostContainer: {
        backgroundColor: 'transparent',
    },
    ghostText: {
        color: Colors.primary,
    },

    // Size: Small
    smallContainer: {
        height: 36,
        paddingHorizontal: 16,
    },
    smallText: {
        fontSize: 14,
    },

    // Size: Medium
    mediumContainer: {
        height: 44,
        paddingHorizontal: 20,
    },
    mediumText: {
        fontSize: 15,
    },

    // Size: Large
    largeContainer: {
        height: 56,
        paddingHorizontal: 24,
    },
    largeText: {
        fontSize: 17,
    },

    // Disabled state
    disabledContainer: {
        backgroundColor: Colors.NEUTRAL.gray300,
        shadowOpacity: 0,
        elevation: 0,
        borderColor: Colors.NEUTRAL.gray300,
    },
    disabledText: {
        color: Colors.NEUTRAL.gray500,
    },
});

export default CustomButton;
