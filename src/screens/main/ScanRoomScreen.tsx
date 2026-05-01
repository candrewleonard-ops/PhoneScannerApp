import React from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Screen, Button, Card } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { PropertiesScreenProps } from '@/types';

const Step: React.FC<{ index: number; title: string; body: string }> = ({ index, title, body }) => (
  <View style={styles.step}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{index}</Text>
    </View>
    <View style={styles.stepBody}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepText}>{body}</Text>
    </View>
  </View>
);

const ScanRoomScreen: React.FC<PropertiesScreenProps<'ScanRoom'>> = ({ navigation }) => {
  const handleStart = () => {
    Alert.alert(
      'Scanner not yet implemented',
      'The native ARKit/RoomPlan module ships in Phase 3. For now, this is a placeholder.'
    );
  };

  return (
    <Screen scrollable>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📐</Text>
      </View>

      <Text style={styles.title}>AR Room Scan</Text>
      <Text style={styles.subtitle}>Capture wall geometry, openings, and ceiling height with iPhone LiDAR.</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>How it works</Text>
        <Step
          index={1}
          title="Hold your phone at chest height"
          body="Stand near the center of the room. Keep the screen vertical."
        />
        <Step
          index={2}
          title="Walk slowly along the perimeter"
          body="Pan side to side to capture each wall, door, and window in turn."
        />
        <Step
          index={3}
          title="Look up and down briefly"
          body="This lets RoomPlan estimate ceiling height and floor area."
        />
        <Step
          index={4}
          title="Stop when the scan is complete"
          body="The scanner will indicate when each surface has been captured."
        />
      </Card>

      <Card style={styles.tipCard}>
        <Text style={styles.tipTitle}>Before you start</Text>
        <Text style={styles.tipText}>• Open all doors and clear floor obstructions</Text>
        <Text style={styles.tipText}>• Make sure the room is well lit</Text>
        <Text style={styles.tipText}>• Requires iPhone Pro / Pro Max with LiDAR</Text>
      </Card>

      <Button title="Start Scan" onPress={handleStart} />
      <Button title="Back" onPress={() => navigation.goBack()} variant="secondary" />
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
    marginBottom: spacing.md,
  },
  step: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    color: colors.textOnPrimary,
    fontWeight: fontWeight.bold as '700',
    fontSize: fontSize.sm,
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stepText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  tipCard: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBg,
  },
  tipTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as '600',
    color: colors.warningText,
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: fontSize.sm,
    color: colors.warningText,
    marginBottom: spacing.xs,
  },
});

export default ScanRoomScreen;
