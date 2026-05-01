import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useProperties } from '@/hooks';
import { Screen, Button, Card, Loading, EmptyState, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { formatCurrency } from '@/lib';
import { Room, PropertiesScreenProps } from '@/types';

const RoomCard: React.FC<{ room: Room; onPress: () => void }> = ({ room, onPress }) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.roomRow}>
        <View style={styles.roomContent}>
          <Text style={styles.roomTitle}>{room.name}</Text>
          {(room.floor_level || room.room_type) && (
            <View style={styles.metaRow}>
              {room.room_type && <Text style={styles.meta}>{room.room_type}</Text>}
              {room.floor_level && <Text style={styles.meta}>Floor: {room.floor_level}</Text>}
            </View>
          )}
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </Card>
  );
};

const PropertyDetailScreen: React.FC<PropertiesScreenProps<'PropertyDetail'>> = ({ navigation, route }) => {
  const { propertyId } = route.params;
  const { currentProperty, rooms, loading, error, fetchProperty, fetchRooms, clearError } = useProperties();

  useFocusEffect(
    useCallback(() => {
      fetchProperty(propertyId);
      fetchRooms(propertyId);
    }, [propertyId, fetchProperty, fetchRooms])
  );

  // TODO: replace with sum of repair_items.total_cost once repair items service exists
  const totalEstimatedCost: number | null = null;

  return (
    <Screen padded={false}>
      {currentProperty && (
        <View style={styles.header}>
          <Text style={styles.propertyName}>{currentProperty.name}</Text>
          {currentProperty.address && <Text style={styles.propertyAddress}>{currentProperty.address}</Text>}
          {(currentProperty.city || currentProperty.state || currentProperty.zip) && (
            <Text style={styles.propertyAddress}>
              {[currentProperty.city, currentProperty.state, currentProperty.zip].filter(Boolean).join(', ')}
            </Text>
          )}
        </View>
      )}

      <View style={styles.body}>
        {error && <ErrorMessage message={error} onDismiss={clearError} />}

        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Rooms</Text>
            <Text style={styles.summaryValue}>{rooms.length}</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Estimated Repairs</Text>
            <Text style={styles.summaryValue}>
              {totalEstimatedCost !== null ? formatCurrency(totalEstimatedCost) : '—'}
            </Text>
            <Text style={styles.summaryHint}>Updates as scope items are added</Text>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rooms</Text>
          <Button
            title="+ Room"
            onPress={() => navigation.navigate('CreateRoom', { propertyId })}
            fullWidth={false}
          />
        </View>

        {loading && rooms.length === 0 ? (
          <Loading message="Loading rooms..." />
        ) : rooms.length === 0 ? (
          <EmptyState
            icon="📐"
            title="No rooms yet"
            message="Add a room to begin inspecting and scanning."
            actionLabel="+ Add Room"
            onAction={() => navigation.navigate('CreateRoom', { propertyId })}
          />
        ) : (
          <FlatList
            data={rooms}
            renderItem={({ item }) => (
              <RoomCard
                room={item}
                onPress={() => navigation.navigate('RoomDetail', { propertyId, roomId: item.id })}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  propertyName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  propertyAddress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold as '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as '700',
    color: colors.text,
  },
  summaryHint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as '600',
    color: colors.text,
  },
  list: {
    paddingBottom: spacing.lg,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roomContent: {
    flex: 1,
  },
  roomTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as '600',
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
  arrow: {
    fontSize: fontSize.xxl,
    color: colors.textMuted,
    marginLeft: spacing.md,
  },
});

export default PropertyDetailScreen;
