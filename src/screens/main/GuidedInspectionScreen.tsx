import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen, Button, Card } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { PropertiesScreenProps } from '@/types';

const GuidedInspectionScreen: React.FC<PropertiesScreenProps<'GuidedInspection'>> = ({ navigation }) => {
  return (
    <Screen scrollable>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📋</Text>
      </View>

      <Text style={styles.title}>Guided Inspection</Text>
      <Text style={styles.subtitle}>
        Walk through a checklist of inspection photos for every wall, opening, ceiling, floor, and damage area.
      </Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>What you'll capture</Text>
        <Text style={styles.bullet}>• A photo of each wall</Text>
        <Text style={styles.bullet}>• A photo of every door and window</Text>
        <Text style={styles.bullet}>• Ceiling and floor reference shots</Text>
        <Text style={styles.bullet}>• Optional damage photos with notes</Text>
      </Card>

      <Card style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Available after Phase 5. Once a room is scanned, the checklist is generated automatically from
          captured walls and openings.
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
  card: {
    backgroundColor: colors.surface,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bullet: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
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

export default GuidedInspectionScreen;
