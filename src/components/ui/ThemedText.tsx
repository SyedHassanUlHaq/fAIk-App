import { StyleSheet, Text, type TextProps } from 'react-native';

import { TEXT_COLORS, TYPOGRAPHY } from '@/constants/Typography';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'button' | 'buttonLarge' | 'label' | 'caption' | 'captionBold' | 'social' | 'hero' | 'cardTitle' | 'cardSubtitle' | 'premium' | 'elegant' | 'modern' | 'tech' | 'data';
  color?: keyof typeof TEXT_COLORS;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  color,
  ...rest
}: ThemedTextProps) {
  const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textColor = color ? TEXT_COLORS[color] : themeColor;

  return (
    <Text
      style={[
        { color: textColor },
        type === 'default' ? TYPOGRAPHY.body : undefined,
        type === 'defaultSemiBold' ? TYPOGRAPHY.bodyMedium : undefined,
        type === 'title' ? TYPOGRAPHY.h1 : undefined,
        type === 'subtitle' ? TYPOGRAPHY.h3 : undefined,
        type === 'link' ? { ...TYPOGRAPHY.body, color: TEXT_COLORS.accent } : undefined,
        type === 'display' ? TYPOGRAPHY.display : undefined,
        type === 'h1' ? TYPOGRAPHY.h1 : undefined,
        type === 'h2' ? TYPOGRAPHY.h2 : undefined,
        type === 'h3' ? TYPOGRAPHY.h3 : undefined,
        type === 'h4' ? TYPOGRAPHY.h4 : undefined,
        type === 'body' ? TYPOGRAPHY.body : undefined,
        type === 'bodyLarge' ? TYPOGRAPHY.bodyLarge : undefined,
        type === 'bodyMedium' ? TYPOGRAPHY.bodyMedium : undefined,
        type === 'bodySmall' ? TYPOGRAPHY.bodySmall : undefined,
        type === 'button' ? TYPOGRAPHY.button : undefined,
        type === 'buttonLarge' ? TYPOGRAPHY.buttonLarge : undefined,
        type === 'label' ? TYPOGRAPHY.label : undefined,
        type === 'caption' ? TYPOGRAPHY.caption : undefined,
        type === 'captionBold' ? TYPOGRAPHY.captionBold : undefined,
        type === 'social' ? TYPOGRAPHY.social : undefined,
        type === 'hero' ? TYPOGRAPHY.hero : undefined,
        type === 'cardTitle' ? TYPOGRAPHY.cardTitle : undefined,
        type === 'cardSubtitle' ? TYPOGRAPHY.cardSubtitle : undefined,
        type === 'premium' ? TYPOGRAPHY.premium : undefined,
        type === 'elegant' ? TYPOGRAPHY.elegant : undefined,
        type === 'modern' ? TYPOGRAPHY.modern : undefined,
        type === 'tech' ? TYPOGRAPHY.tech : undefined,
        type === 'data' ? TYPOGRAPHY.data : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

// Legacy styles for backward compatibility
const styles = StyleSheet.create({
  default: TYPOGRAPHY.body,
  defaultSemiBold: TYPOGRAPHY.bodyMedium,
  title: TYPOGRAPHY.h1,
  subtitle: TYPOGRAPHY.h3,
  link: { ...TYPOGRAPHY.body, color: TEXT_COLORS.accent },
});
