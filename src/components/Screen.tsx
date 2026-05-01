import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  style?: ViewStyle;
}

const Screen: React.FC<ScreenProps> = ({ children, scrollable = false, padded = true, style }) => {
  const insets = useSafeAreaInsets();

  const padding = padded
    ? {
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.lg,
        paddingLeft: insets.left + spacing.lg,
        paddingRight: insets.right + spacing.lg,
      }
    : {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      };

  if (scrollable) {
    return (
      <ScrollView
        style={[styles.container, style]}
        contentContainerStyle={[padding, { flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.container, padding, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default Screen;
