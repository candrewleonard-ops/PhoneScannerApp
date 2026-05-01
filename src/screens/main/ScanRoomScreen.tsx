import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Screen, Button, Card, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { PropertiesScreenProps } from '@/types';
import {
  isRoomPlanSupported,
  startRoomScan,
  RoomPlanError,
  RoomScanResult,
} from '@/native/RoomPlanScanner';

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

const ScanRoomScreen: React.FC<PropertiesScreenProps<'ScanRoom'>> = ({ navigation, route }) => {
  const { roomId } = route.params;
  const [supported, setSupported] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    isRoomPlanSupported().then((value) => {
      if (!cancelled) setSupported(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStart = async () => {
    setError(null);
    setScanning(true);
    try {
      const result: RoomScanResult = await startRoomScan(roomId);
      Alert.alert(
        'Scan complete',
        `Walls: ${result.summary.wallsCount}\n` +
          `Openings: ${result.summary.openingsCount}\n` +
          `Objects: ${result.summary.objectsCount}\n` +
          `Ceiling: ${
            result.summary.estimatedCeilingHeight
              ? `${result.summary.estimatedCeilingHeight.toFixed(2)} m`
              : 'unknown'
          }`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      // TODO(phase-4): persist result via scansService.saveRoomScanStructure()
    } catch (err) {
      if (err instanceof RoomPlanError && err.code === 'E_SCAN_CANCELLED') {
        // user backed out — no-op
      } else {
        const message = err instanceof Error ? err.message : 'Scan failed';
        setError(message);
      }
    } finally {
      setScanning(false);
    }
  };

  return (
    <Screen scrollable>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📐</Text>
      </View>

      <Text style={styles.title}>AR Room Scan</Text>
      <Text style={styles.subtitle}>Capture wall geometry, openings, and ceiling height with iPhone LiDAR.</Text>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

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
          title="Tap Done when complete"
          body="The scanner will process and return geometry to the app."
        />
      </Card>

      <Card style={styles.tipCard}>
        <Text style={styles.tipTitle}>Before you start</Text>
        <Text style={styles.tipText}>• Open all doors and clear floor obstructions</Text>
        <Text style={styles.tipText}>• Make sure the room is well lit</Text>
        <Text style={styles.tipText}>• Requires iPhone Pro / Pro Max with LiDAR (iOS 16+)</Text>
      </Card>

      {supported === false && (
        <Card style={styles.warningCard}>
          <Text style={styles.warningText}>
            This device does not support RoomPlan. You need an iPhone or iPad with a LiDAR scanner running
            iOS 16 or newer.
          </Text>
        </Card>
      )}

      <Button
        title={scanning ? 'Launching scanner...' : 'Start Scan'}
        onPress={handleStart}
        loading={scanning}
        disabled={supported === false}
      />
      <Button title="Back" onPress={() => navigation.goBack()} variant="secondary" disabled={scanning} />
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
  warningCard: {
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBg,
  },
  warningText: {
    fontSize: fontSize.sm,
    color: colors.errorText,
  },
});

export default ScanRoomScreen;
