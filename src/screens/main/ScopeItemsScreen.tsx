import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen, Button, Card } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { PropertiesScreenProps } from '@/types';

const ScopeItemsScreen: React.FC<PropertiesScreenProps<'ScopeItems'>> = ({ navigation }) => {
  return (
    <Screen scrollable>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🧾</Text>
      </View>

      <Text style={styles.title}>Scope Items</Text>
      <Text style={styles.subtitle}>
        Costed line items for this room: paint, drywall, fixtures, flooring, etc. These roll up into
        the property-level scope of work.
      </Text>

      <Card style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Available after Phase 7. Scope items are stored in `repair_items` and aggregated into a
          property total estimated repair cost.
        </Text>
      </Card>

      <Button title="Back to Room" onPress={() => navigation.goBack()} variant="secondary" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  icon: {
    fontSize: 56,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  placeholder: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBg,
  },
  placeholderText: {
    fontSize: fontSize.sm,
    color: colors.warningText,
  },
});

export default ScopeItemsScreen;
