import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Screen, Button, Card } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { PropertiesScreenProps } from '@/types';

const ScanRoomScreen: React.FC<PropertiesScreenProps<'ScanRoom'>> = ({ navigation, route }) => {
  const { roomId } = route.params;

  return (
    <Screen scrollable>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📐</Text>
      </View>

      <Text style={styles.title}>Room Scanner</Text>
      <Text style={styles.subtitle}>ARKit/RoomPlan integration coming in Phase 3</Text>

      <Card style={styles.infoCard}>
        <Text style={styles.cardTitle}>What this will do</Text>
        <Text style={styles.bullet}>• Scan walls, doors, windows with ARKit/RoomPlan</Text>
        <Text style={styles.bullet}>• Capture ceiling height and floor area</Text>
        <Text style={styles.bullet}>• Anchor inspection photos to walls</Text>
        <Text style={styles.bullet}>• Save structured data to Supabase</Text>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.cardTitle}>Room ID</Text>
        <Text style={styles.mono}>{roomId}</Text>
      </Card>

      <Button title="Back to Room" onPress={() => navigation.goBack()} variant="secondary" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  icon: {
    fontSize: 64,
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
  infoCard: {
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
  mono: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
});

export default ScanRoomScreen;
