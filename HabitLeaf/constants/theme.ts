/**
 * HabitLeaf Theme System
 * Modern, vibrant color palette with gradients and shadows
 */

import { Platform } from 'react-native';

const tintColorLight = '#6366F1'; // Indigo
const tintColorDark = '#818CF8';

export const Colors = {
  light: {
    text: '#1F2937',
    textSecondary: '#6B7280',
    background: '#F9FAFB',
    backgroundSecondary: '#FFFFFF',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    border: '#E5E7EB',
    shadow: '#000000',

    // Semantic colors
    success: '#10B981',
    successLight: '#D1FAE5',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    // Brand colors
    primary: '#6366F1',
    primaryLight: '#EEF2FF',
    primaryDark: '#4F46E5',
    secondary: '#8B5CF6',
    secondaryLight: '#F5F3FF',
    accent: '#EC4899',
    accentLight: '#FCE7F3',

    // Gradients
    gradientStart: '#6366F1',
    gradientMiddle: '#8B5CF6',
    gradientEnd: '#EC4899',

    // Card colors
    cardBackground: '#FFFFFF',
    cardBorder: '#F3F4F6',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    background: '#111827',
    backgroundSecondary: '#1F2937',
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    border: '#374151',
    shadow: '#000000',

    // Semantic colors
    success: '#34D399',
    successLight: '#064E3B',
    error: '#F87171',
    errorLight: '#7F1D1D',
    warning: '#FBBF24',
    warningLight: '#78350F',
    info: '#60A5FA',
    infoLight: '#1E3A8A',

    // Brand colors
    primary: '#818CF8',
    primaryLight: '#312E81',
    primaryDark: '#A5B4FC',
    secondary: '#A78BFA',
    secondaryLight: '#4C1D95',
    accent: '#F472B6',
    accentLight: '#831843',

    // Gradients
    gradientStart: '#818CF8',
    gradientMiddle: '#A78BFA',
    gradientEnd: '#F472B6',

    // Card colors
    cardBackground: '#1F2937',
    cardBorder: '#374151',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Typography = {
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
