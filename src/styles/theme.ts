// Premium Design System for High-End Applications
export const theme = {
  colors: {
    // Primary palette - Elegant deep blue with gold accents
    primary: '#1E3D59',
    primaryLight: '#2C5282',
    primaryDark: '#152A3F',
    accent: '#FFD700',
    accentLight: '#FFE55C',
    accentDark: '#B79B00',

    // Secondary palette - Sophisticated neutrals
    secondary: '#718096',
    secondaryLight: '#A0AEC0',
    secondaryDark: '#4A5568',

    // Background variations
    background: '#FFFFFF',
    surfaceLight: '#F7FAFC',
    surface: '#EDF2F7',
    surfaceDark: '#E2E8F0',

    // Text colors
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      tertiary: '#718096',
      inverse: '#FFFFFF',
      accent: '#FFD700',
      error: '#E53E3E',
      success: '#38A169',
    },

    // Status colors
    status: {
      success: '#38A169',
      error: '#E53E3E',
      warning: '#DD6B20',
      info: '#3182CE',
    },

    // Gradient combinations
    gradients: {
      primary: ['#1E3D59', '#2C5282', '#3182CE'],
      accent: ['#FFD700', '#FFE55C', '#FFF3B0'],
      surface: ['#F7FAFC', '#EDF2F7', '#E2E8F0'],
      success: ['#38A169', '#48BB78', '#68D391'],
    },
  },

  // Typography system
  typography: {
    fonts: {
      primary: 'System',
      secondary: 'System',
    },
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing system (in pixels)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    '4xl': 56,
    '5xl': 64,
    container: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  // Border radius system
  borderRadius: {
    none: 0,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
  },

  // Shadows system
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 8,
    },
  },

  // Animation timing
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
    elastic: [0.68, -0.55, 0.265, 1.55], // Elastic bezier curve
  },

  // Layout
  layout: {
    maxWidth: 1280,
    gutter: 16,
  },
} as const;

// Utility types
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;
export type ThemeTypography = typeof theme.typography;
export type ThemeShadows = typeof theme.shadows;
export type ThemeBorderRadius = typeof theme.borderRadius;

// Helper functions
export const getColor = (color: keyof typeof theme.colors) => theme.colors[color];
export const getSpacing = (space: keyof typeof theme.spacing) => theme.spacing[space];
export const getFontSize = (size: keyof typeof theme.typography.sizes) => theme.typography.sizes[size];
export const getShadow = (shadow: keyof typeof theme.shadows) => theme.shadows[shadow];
