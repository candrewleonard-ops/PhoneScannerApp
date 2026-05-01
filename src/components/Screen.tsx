import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  spacing?: boolean;
}

const Screen: React.FC<ScreenProps> = ({ children, scrollable = false, spacing = true }) => {
  const insets = useSafeAreaInsets();

  const containerStyle = spacing
    ? [
        styles.container,
        {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]
    : [styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }];

  if (scrollable) {
    return (
      <ScrollView style={containerStyle} contentContainerStyle={{ flexGrow: 1 }}>
        {children}
      </ScrollView>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Screen;
