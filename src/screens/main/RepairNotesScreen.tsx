import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen, Button, Card } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { PropertiesScreenProps } from '@/types';

const RepairNotesScreen: React.FC<PropertiesScreenProps<'RepairNotes'>> = ({ navigation }) => {
  return (
    <Screen scrollable>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📝</Text>
      </View>

      <Text style={styles.title}>Repair Notes</Text>
      <Text style={styles.subtitle}>
        Free-form observations about damage, conditions, and required work. Anchor notes to a wall or
        opening so they show up in scope reports.
      </Text>

      <Card style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Available after Phase 6. Notes will be stored in the `repair_notes` table and surfaced here
          per-room.
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

export default RepairNotesScreen;
