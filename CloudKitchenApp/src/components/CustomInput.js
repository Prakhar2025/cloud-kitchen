/**
 * ============================================================================
 * CustomInput Component
 * ============================================================================
 * 
 * A beautifully styled, reusable input component with:
 * - Icon support
 * - Error state display
 * - Password visibility toggle
 * - Focus/blur animations
 * - Accessibility features
 */

import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import Colors from '../styles/colors';

/**
 * CustomInput - Reusable text input component
 * 
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Value change handler
 * @param {boolean} props.secureTextEntry - Password input mode
 * @param {string} props.error - Error message to display
 * @param {string} props.icon - Icon character/emoji
 * @param {string} props.keyboardType - Keyboard type
 * @param {string} props.autoCapitalize - Auto capitalize mode
 * @param {boolean} props.autoCorrect - Auto correct mode
 * @param {string} props.returnKeyType - Return key type
 * @param {Function} props.onSubmitEditing - Submit handler
 * @param {boolean} props.editable - Whether input is editable
 */
const CustomInput = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    error,
    icon,
    keyboardType = 'default',
    autoCapitalize = 'none',
    autoCorrect = false,
    returnKeyType = 'next',
    onSubmitEditing,
    editable = true,
    ...props
}) => {
    // State for password visibility toggle
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Animation value for focus state
    const focusAnim = useRef(new Animated.Value(0)).current;

    // Handle focus animation
    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(focusAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    // Handle blur animation
    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(focusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    // Animated border color
    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            error ? Colors.error : Colors.borderLight,
            error ? Colors.error : Colors.primary,
        ],
    });

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.inputContainer,
                    { borderColor },
                    error && styles.inputContainerError,
                    !editable && styles.inputContainerDisabled,
                ]}
            >
                {/* Icon */}
                {icon && (
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>{icon}</Text>
                    </View>
                )}

                {/* Text Input */}
                <TextInput
                    style={[
                        styles.input,
                        icon && styles.inputWithIcon,
                        secureTextEntry && styles.inputWithToggle,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.TEXT.placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={editable}
                    accessibilityLabel={placeholder}
                    accessibilityHint={error ? `Error: ${error}` : undefined}
                    {...props}
                />

                {/* Password Visibility Toggle */}
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={togglePasswordVisibility}
                        accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                        <Text style={styles.toggleIcon}>
                            {isPasswordVisible ? '🙈' : '👁️'}
                        </Text>
                    </TouchableOpacity>
                )}
            </Animated.View>

            {/* Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.BACKGROUND.input,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.BORDER.light,
        paddingHorizontal: 16,
        height: 56,
    },
    inputContainerError: {
        borderColor: Colors.error,
        backgroundColor: Colors.SEMANTIC.errorLight,
    },
    inputContainerDisabled: {
        backgroundColor: Colors.NEUTRAL.gray100,
        opacity: 0.7,
    },
    iconContainer: {
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.TEXT.primary,
        paddingVertical: 12,
    },
    inputWithIcon: {
        paddingLeft: 0,
    },
    inputWithToggle: {
        paddingRight: 40,
    },
    toggleButton: {
        position: 'absolute',
        right: 16,
        padding: 4,
    },
    toggleIcon: {
        fontSize: 20,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        paddingHorizontal: 4,
    },
    errorIcon: {
        fontSize: 12,
        marginRight: 6,
    },
    errorText: {
        fontSize: 13,
        color: Colors.error,
        flex: 1,
    },
});

export default CustomInput;
