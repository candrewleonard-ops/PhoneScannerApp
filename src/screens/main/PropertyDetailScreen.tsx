import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useProperties } from '@/hooks';
import { Screen, Button, Card, Loading, EmptyState, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { formatArea, formatHeight } from '@/lib';
import { Room, PropertiesScreenProps } from '@/types';

const RoomCard: React.FC<{ room: Room; onPress: () => void; onDelete: () => void }> = ({
  room,
  onPress,
  onDelete,
}) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.roomRow}>
        <View style={styles.roomContent}>
          <Text style={styles.roomTitle}>{room.name}</Text>
          {room.description && <Text style={styles.roomDesc}>{room.description}</Text>}
          <View style={styles.metaRow}>
            <Text style={styles.meta}>Area: {formatArea(room.floor_area)}</Text>
            <Text style={styles.meta}>Ceiling: {formatHeight(room.ceiling_height)}</Text>
          </View>
          {room.scan_completed && <Text style={styles.scannedBadge}>✓ Scanned</Text>}
        </View>
        <Text style={styles.deleteIcon} onPress={onDelete}>
          🗑
        </Text>
      </View>
    </Card>
  );
};

const PropertyDetailScreen: React.FC<PropertiesScreenProps<'PropertyDetail'>> = ({ navigation, route }) => {
  const { propertyId } = route.params;
  const { currentProperty, rooms, loading, error, fetchProperty, fetchRooms, deleteRoom, clearError } =
    useProperties();

  useFocusEffect(
    useCallback(() => {
      fetchProperty(propertyId);
      fetchRooms(propertyId);
    }, [propertyId, fetchProperty, fetchRooms])
  );

  const handleDeleteRoom = (roomId: string) => {
    Alert.alert('Delete Room', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => deleteRoom(roomId),
        style: 'destructive',
      },
    ]);
  };

  return (
    <Screen padded={false}>
      {currentProperty && (
        <View style={styles.header}>
          <Text style={styles.propertyName}>{currentProperty.name}</Text>
          {currentProperty.address && <Text style={styles.propertyAddress}>{currentProperty.address}</Text>}
          {(currentProperty.city || currentProperty.state) && (
            <Text style={styles.propertyAddress}>
              {[currentProperty.city, currentProperty.state, currentProperty.zip].filter(Boolean).join(', ')}
            </Text>
          )}
        </View>
      )}

      <View style={styles.body}>
        {error && <ErrorMessage message={error} onDismiss={clearError} />}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rooms ({rooms.length})</Text>
          <Button
            title="+ Room"
            onPress={() =>
              navigation.navigate('RoomDetail', { propertyId, isNew: true })
            }
            fullWidth={false}
          />
        </View>

        {loading && rooms.length === 0 ? (
          <Loading message="Loading rooms..." />
        ) : rooms.length === 0 ? (
          <EmptyState
            icon="📐"
            title="No rooms yet"
            message="Add a room to start your inspection."
            actionLabel="+ Add Room"
            onAction={() =>
              navigation.navigate('RoomDetail', { propertyId, isNew: true })
            }
          />
        ) : (
          <FlatList
            data={rooms}
            renderItem={({ item }) => (
              <RoomCard
                room={item}
                onPress={() =>
                  navigation.navigate('RoomDetail', { propertyId, roomId: item.id })
                }
                onDelete={() => handleDeleteRoom(item.id)}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  roomDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  meta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  scannedBadge: {
    fontSize: fontSize.xs,
    color: colors.success,
    marginTop: spacing.sm,
    fontWeight: fontWeight.semibold as '600',
  },
  deleteIcon: {
    fontSize: fontSize.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});

export default PropertyDetailScreen;
