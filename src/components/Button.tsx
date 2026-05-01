import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeight } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  fullWidth = true,
}) => {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.textOnPrimary} />
      ) : (
        <Text style={[styles.text, isOutline && styles.outlineText, variant === 'secondary' && styles.secondaryText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginBottom: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceAlt,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as '600',
    color: colors.textOnPrimary,
  },
  secondaryText: {
    color: colors.text,
  },
  outlineText: {
    color: colors.primary,
  },
});

export default Button;
