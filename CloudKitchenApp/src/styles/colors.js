/**
 * ============================================================================
 * Color Palette - Cloud Kitchen App
 * ============================================================================
 * 
 * Food-delivery themed color palette with warm, appetizing colors.
 * Designed for a premium, modern food ordering experience.
 * 
 * Color Psychology:
 * - Orange/Red: Stimulates appetite, creates urgency
 * - Green: Fresh, healthy, natural
 * - White/Light: Clean, trustworthy
 */

// =============================================================================
// Primary Colors (Brand Colors)
// =============================================================================

export const PRIMARY = {
    // Main brand orange - appetizing and energetic
    main: '#FF6B35',
    light: '#FF8F66',
    dark: '#E55A2B',

    // Secondary brand color - deep crimson for accents
    secondary: '#D62828',
    secondaryLight: '#E84545',
    secondaryDark: '#A61E1E',
};

// =============================================================================
// Neutral Colors
// =============================================================================

export const NEUTRAL = {
    // White shades
    white: '#FFFFFF',
    offWhite: '#FAFAFA',

    // Gray scale
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Black
    black: '#000000',
};

// =============================================================================
// Semantic Colors
// =============================================================================

export const SEMANTIC = {
    // Success - Fresh green for successful actions
    success: '#10B981',
    successLight: '#D1FAE5',
    successDark: '#059669',

    // Error - Attention-grabbing red
    error: '#EF4444',
    errorLight: '#FEE2E2',
    errorDark: '#DC2626',

    // Warning - Caution yellow/orange
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    warningDark: '#D97706',

    // Info - Calm blue
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    infoDark: '#2563EB',
};

// =============================================================================
// Background Colors
// =============================================================================

export const BACKGROUND = {
    // Main app background
    primary: '#FFFFFF',
    secondary: '#F9FAFB',

    // Card backgrounds
    card: '#FFFFFF',
    cardHover: '#F3F4F6',

    // Input backgrounds
    input: '#F3F4F6',
    inputFocused: '#FFFFFF',

    // Overlay for modals
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// =============================================================================
// Text Colors
// =============================================================================

export const TEXT = {
    // Primary text - dark and readable
    primary: '#1F2937',

    // Secondary text - slightly lighter
    secondary: '#4B5563',

    // Muted text - for less important info
    muted: '#9CA3AF',

    // Inverse text - white for dark backgrounds
    inverse: '#FFFFFF',

    // Link text
    link: '#FF6B35',
    linkHover: '#E55A2B',

    // Placeholder text
    placeholder: '#9CA3AF',
};

// =============================================================================
// Border Colors
// =============================================================================

export const BORDER = {
    light: '#E5E7EB',
    default: '#D1D5DB',
    dark: '#9CA3AF',
    focused: '#FF6B35',
    error: '#EF4444',
    success: '#10B981',
};

// =============================================================================
// Gradient Presets
// =============================================================================

export const GRADIENTS = {
    // Primary gradient for buttons, headers
    primary: ['#FF6B35', '#FF8F66'],
    primaryReverse: ['#FF8F66', '#FF6B35'],

    // Sunset gradient for premium feel
    sunset: ['#FF6B35', '#D62828'],

    // Fresh gradient for healthy options
    fresh: ['#10B981', '#34D399'],

    // Dark overlay for image overlays
    darkOverlay: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)'],
};

// =============================================================================
// Shadow Colors
// =============================================================================

export const SHADOW = {
    light: 'rgba(0, 0, 0, 0.05)',
    default: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
    primaryGlow: 'rgba(255, 107, 53, 0.3)',
};

// =============================================================================
// Default Export - Combined Colors Object
// =============================================================================

const Colors = {
    primary: PRIMARY.main,
    primaryLight: PRIMARY.light,
    primaryDark: PRIMARY.dark,
    secondary: PRIMARY.secondary,

    // Quick access to common colors
    white: NEUTRAL.white,
    black: NEUTRAL.black,
    gray: NEUTRAL.gray500,

    // Semantic
    success: SEMANTIC.success,
    error: SEMANTIC.error,
    warning: SEMANTIC.warning,
    info: SEMANTIC.info,

    // Backgrounds
    background: BACKGROUND.primary,
    backgroundSecondary: BACKGROUND.secondary,

    // Text
    text: TEXT.primary,
    textSecondary: TEXT.secondary,
    textMuted: TEXT.muted,

    // Borders
    border: BORDER.default,
    borderLight: BORDER.light,

    // Full palettes
    PRIMARY,
    NEUTRAL,
    SEMANTIC,
    BACKGROUND,
    TEXT,
    BORDER,
    GRADIENTS,
    SHADOW,
};

export default Colors;
