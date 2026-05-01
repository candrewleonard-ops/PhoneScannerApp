import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '@/constants/theme';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  inline?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ message, size = 'large', inline = false }) => {
  return (
    <View style={[styles.container, inline && styles.inline]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  inline: {
    flex: 0,
    paddingVertical: spacing.lg,
  },
  message: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

export default Loading;
