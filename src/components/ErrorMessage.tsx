import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeight } from '@/constants/theme';

interface ErrorMessageProps {
  message?: string | null;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} hitSlop={8}>
          <Text style={styles.dismiss}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: radius.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.errorText,
    fontSize: fontSize.sm,
    flex: 1,
  },
  dismiss: {
    color: colors.errorText,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as '700',
    marginLeft: spacing.md,
  },
});

export default ErrorMessage;
