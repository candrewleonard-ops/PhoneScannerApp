import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen, Button, Card, Loading, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { formatArea, formatHeight } from '@/lib';
import { roomsService, scansService } from '@/services';
import { useProperties } from '@/hooks';
import { PropertiesScreenProps, Room, RoomScan } from '@/types';

type ScanStatusKind = 'not_started' | 'in_progress' | 'completed' | 'failed';

const statusBadgeColor = (kind: ScanStatusKind) => {
  switch (kind) {
    case 'completed':
      return { bg: colors.successBg, text: colors.successText };
    case 'in_progress':
      return { bg: colors.warningBg, text: colors.warningText };
    case 'failed':
      return { bg: colors.errorBg, text: colors.errorText };
    default:
      return { bg: colors.surfaceAlt, text: colors.textSecondary };
  }
};

const statusLabel = (kind: ScanStatusKind) => {
  switch (kind) {
    case 'completed':
      return 'Scan complete';
    case 'in_progress':
      return 'Scan in progress';
    case 'failed':
      return 'Scan failed';
    default:
      return 'Not scanned';
  }
};

const RoomDetailScreen: React.FC<PropertiesScreenProps<'RoomDetail'>> = ({ navigation, route }) => {
  const { propertyId, roomId } = route.params;
  const { deleteRoom } = useProperties();

  const [room, setRoom] = useState<Room | null>(null);
  const [scan, setScan] = useState<RoomScan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [roomRes, scanRes] = await Promise.all([
        roomsService.getRoomById(roomId),
        scansService.getLatestRoomScanForRoom(roomId),
      ]);
      if (roomRes.error) throw roomRes.error;
      if (scanRes.error) throw scanRes.error;
      setRoom(roomRes.data);
      setScan(scanRes.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleDelete = () => {
    Alert.alert('Delete Room', 'This will permanently delete the room and all its scans.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRoom(roomId);
          navigation.goBack();
        },
      },
    ]);
  };

  const scanKind: ScanStatusKind = (() => {
    if (!scan) return 'not_started';
    switch (scan.scan_status) {
      case 'completed':
        return 'completed';
      case 'in_progress':
      case 'pending':
        return 'in_progress';
      case 'failed':
        return 'failed';
      default:
        return 'not_started';
    }
  })();

  const statusColors = statusBadgeColor(scanKind);

  if (loading && !room) {
    return (
      <Screen>
        <Loading message="Loading room..." />
      </Screen>
    );
  }

  if (!room) {
    return (
      <Screen>
        <ErrorMessage message={error || 'Room not found'} />
        <Button title="Back" onPress={() => navigation.goBack()} variant="secondary" />
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <View style={styles.header}>
        <Text style={styles.roomName}>{room.name}</Text>
        <View style={styles.metaRow}>
          {room.room_type && <Text style={styles.meta}>{room.room_type}</Text>}
          {room.floor_level && <Text style={styles.meta}>Floor: {room.floor_level}</Text>}
        </View>
      </View>

      <Card style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.cardLabel}>Scan Status</Text>
          <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.badgeText, { color: statusColors.text }]}>
              {statusLabel(scanKind)}
            </Text>
          </View>
        </View>
        {scan && scanKind === 'completed' && (
          <View style={styles.scanSummary}>
            <Text style={styles.summaryItem}>Area: {formatArea(scan.floor_area)}</Text>
            <Text style={styles.summaryItem}>Ceiling: {formatHeight(scan.ceiling_height)}</Text>
          </View>
        )}
      </Card>

      <Text style={styles.sectionTitle}>Actions</Text>

      <Button
        title={scanKind === 'completed' ? 'Re-scan with AR' : 'Start AR Scan'}
        onPress={() => navigation.navigate('ScanRoom', { propertyId, roomId })}
      />
      <Button
        title="Guided Inspection"
        onPress={() => navigation.navigate('GuidedInspection', { propertyId, roomId })}
        variant="secondary"
      />
      <Button
        title="Repair Notes"
        onPress={() => navigation.navigate('RepairNotes', { propertyId, roomId })}
        variant="secondary"
      />
      <Button
        title="Scope Items"
        onPress={() => navigation.navigate('ScopeItems', { propertyId, roomId })}
        variant="secondary"
      />

      <View style={styles.danger}>
        <Button title="Delete Room" onPress={handleDelete} variant="danger" />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  roomName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  meta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statusCard: {
    backgroundColor: colors.surface,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium as '500',
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold as '600',
  },
  scanSummary: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryItem: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  danger: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default RoomDetailScreen;
