import { Platform } from 'react-native';

// Sophisticated font families for different purposes
export const FONTS = {
  // Primary fonts - Poppins for body text and UI
  regular: Platform.select({
    ios: 'Poppins-Regular',
    android: 'Poppins-Regular',
    default: 'Poppins-Regular',
  }),
  medium: Platform.select({
    ios: 'Poppins-Medium',
    android: 'Poppins-Medium',
    default: 'Poppins-Medium',
  }),
  semiBold: Platform.select({
    ios: 'Poppins-SemiBold',
    android: 'Poppins-SemiBold',
    default: 'Poppins-SemiBold',
  }),
  bold: Platform.select({
    ios: 'Poppins-Bold',
    android: 'Poppins-Bold',
    default: 'Poppins-Bold',
  }),
  extraBold: Platform.select({
    ios: 'Poppins-ExtraBold',
    android: 'Poppins-ExtraBold',
    default: 'Poppins-ExtraBold',
  }),
  light: Platform.select({
    ios: 'Poppins-Light',
    android: 'Poppins-Light',
    default: 'Poppins-Light',
  }),

  // Display fonts - SpaceMono for special elements
  mono: Platform.select({
    ios: 'SpaceMono',
    android: 'SpaceMono',
    default: 'SpaceMono',
  }),

  // System fonts for premium feel
  systemRegular: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  }),
  systemMedium: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  systemBold: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto-Bold',
    default: 'System',
  }),
};

// Font sizes - Sophisticated scale with better proportions
export const FONT_SIZES = {
  // Headlines - More dramatic sizing
  h1: 34,      // Main titles, hero text (increased from 32)
  h2: 30,      // Section headers (increased from 28)
  h3: 26,      // Card titles, important headings (increased from 24)
  h4: 22,      // Subsection headers (increased from 20)
  
  // Body text - Refined sizing
  large: 19,   // Important body text, prominent descriptions (increased from 18)
  regular: 17, // Standard body text, most content (increased from 16)
  medium: 15,  // Secondary text, descriptions (increased from 14)
  small: 13,   // Captions, labels, metadata (increased from 12)
  
  // Special sizes
  display: 42, // Display text, very prominent (increased from 36)
  tiny: 11,    // Very small text, fine print (increased from 10)
};

// Line heights for better readability
export const LINE_HEIGHTS = {
  tight: 1.2,     // Headlines, titles
  normal: 1.4,    // Body text
  relaxed: 1.6,   // Long-form content
  loose: 1.8,     // Very relaxed reading
};

// Font weights
export const FONT_WEIGHTS = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  black: '900' as const,
};

// Typography styles for common use cases
export const TYPOGRAPHY = {
  // Headlines with sophisticated styling - Mix of system and Poppins
  display: {
    fontFamily: FONTS.systemBold,
    fontSize: FONT_SIZES.display,
    lineHeight: FONT_SIZES.display * LINE_HEIGHTS.tight,
    fontWeight: FONT_WEIGHTS.extraBold,
    letterSpacing: -1.2,
  },
  h1: {
    fontFamily: FONTS.systemBold,
    fontSize: FONT_SIZES.h1,
    lineHeight: FONT_SIZES.h1 * LINE_HEIGHTS.tight,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: -0.8,
  },
  h2: {
    fontFamily: FONTS.systemMedium,
    fontSize: FONT_SIZES.h2,
    lineHeight: FONT_SIZES.h2 * LINE_HEIGHTS.tight,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: -0.6,
  },
  h3: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.h3,
    lineHeight: FONT_SIZES.h3 * LINE_HEIGHTS.tight,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: -0.4,
  },
  h4: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.h4,
    lineHeight: FONT_SIZES.h4 * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: -0.2,
  },

  // Body text with sophisticated font choices
  bodyLarge: {
    fontFamily: FONTS.systemMedium,
    fontSize: FONT_SIZES.large,
    lineHeight: FONT_SIZES.large * LINE_HEIGHTS.relaxed,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 0.2,
  },
  body: {
    fontFamily: FONTS.systemRegular,
    fontSize: FONT_SIZES.regular,
    lineHeight: FONT_SIZES.regular * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0.1,
  },
  bodyMedium: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.medium,
    lineHeight: FONT_SIZES.medium * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 0.15,
  },
  bodySmall: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.small,
    lineHeight: FONT_SIZES.small * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0.1,
  },

  // UI Elements with sophisticated styling
  button: {
    fontFamily: FONTS.systemMedium,
    fontSize: FONT_SIZES.regular,
    lineHeight: FONT_SIZES.regular * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: 0.3,
    textTransform: 'uppercase' as const,
  },
  buttonLarge: {
    fontFamily: FONTS.systemBold,
    fontSize: FONT_SIZES.large,
    lineHeight: FONT_SIZES.large * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.small,
    lineHeight: FONT_SIZES.small * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontFamily: FONTS.systemRegular,
    fontSize: FONT_SIZES.small,
    lineHeight: FONT_SIZES.small * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0.2,
  },
  captionBold: {
    fontFamily: FONTS.systemMedium,
    fontSize: FONT_SIZES.small,
    lineHeight: FONT_SIZES.small * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: 0.3,
  },

  // Special cases with enhanced styling
  social: {
    fontFamily: FONTS.systemMedium,
    fontSize: FONT_SIZES.regular,
    lineHeight: FONT_SIZES.regular * LINE_HEIGHTS.relaxed,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 0.1,
  },
  hero: {
    fontFamily: FONTS.systemBold,
    fontSize: FONT_SIZES.h1,
    lineHeight: FONT_SIZES.h1 * LINE_HEIGHTS.tight,
    fontWeight: FONT_WEIGHTS.extraBold,
    letterSpacing: -0.8,
  },
  cardTitle: {
    fontFamily: FONTS.systemMedium,
    fontSize: FONT_SIZES.h4,
    lineHeight: FONT_SIZES.h4 * LINE_HEIGHTS.tight,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontFamily: FONTS.systemRegular,
    fontSize: FONT_SIZES.medium,
    lineHeight: FONT_SIZES.medium * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0.15,
  },
  
  // New sophisticated variants with premium fonts
  premium: {
    fontFamily: FONTS.systemBold,
    fontSize: FONT_SIZES.h3,
    lineHeight: FONT_SIZES.h3 * LINE_HEIGHTS.tight,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: -0.4,
  },
  elegant: {
    fontFamily: FONTS.systemMedium,
    fontSize: FONT_SIZES.large,
    lineHeight: FONT_SIZES.large * LINE_HEIGHTS.relaxed,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 0.3,
  },
  modern: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.regular,
    lineHeight: FONT_SIZES.regular * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: 0.4,
  },
  
  // Tech/Analytics specific fonts
  tech: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.medium,
    lineHeight: FONT_SIZES.medium * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 0.6,
  },
  data: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.small,
    lineHeight: FONT_SIZES.small * LINE_HEIGHTS.normal,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: 0.5,
  },
};

// Color combinations for social yet professional look
export const TEXT_COLORS = {
  primary: '#1a1a1a',      // Main text
  secondary: '#6b7280',    // Secondary text
  tertiary: '#9ca3af',     // Muted text
  accent: '#3b82f6',       // Accent text
  success: '#10b981',      // Success text
  warning: '#f59e0b',      // Warning text
  error: '#ef4444',        // Error text
  inverse: '#ffffff',      // White text
  muted: '#d1d5db',        // Very muted text
};
