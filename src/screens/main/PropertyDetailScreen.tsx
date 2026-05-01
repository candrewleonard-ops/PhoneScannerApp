import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usePropertyStore } from '@/store/propertyStore';
import Screen from '@/components/Screen';
import Button from '@/components/Button';
import { Room } from '@/types';

const RoomCard: React.FC<{ room: Room; onPress: () => void; onDelete: () => void }> = ({
  room,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{room.name}</Text>
        {room.description && <Text style={styles.cardSubtitle}>{room.description}</Text>}
        {room.floor_area && (
          <Text style={styles.cardMeta}>Floor Area: {room.floor_area.toFixed(0)} sq ft</Text>
        )}
        {room.ceiling_height && (
          <Text style={styles.cardMeta}>Ceiling Height: {room.ceiling_height.toFixed(1)} ft</Text>
        )}
        {room.scan_completed && <Text style={styles.scannedBadge}>✓ Scanned</Text>}
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const PropertyDetailScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { propertyId } = route.params;
  const { currentProperty, rooms, loading, fetchProperty, fetchRooms, deleteRoom } = usePropertyStore();
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProperty(propertyId);
      fetchRooms(propertyId);
    }, [propertyId])
  );

  const handleDeleteRoom = (roomId: string) => {
    Alert.alert('Delete Room', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          setDeleting(true);
          await deleteRoom(roomId);
          setDeleting(false);
        },
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return (
      <Screen spacing>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen spacing={false}>
      {currentProperty && (
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyName}>{currentProperty.name}</Text>
          {currentProperty.address && <Text style={styles.propertyAddress}>{currentProperty.address}</Text>}
        </View>
      )}

      <View style={styles.sectionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rooms ({rooms.length})</Text>
          <Button
            title="+ Room"
            onPress={() => navigation.navigate('RoomDetail', { propertyId, isNew: true })}
            variant="primary"
          />
        </View>

        {rooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No rooms added yet</Text>
            <Text style={styles.emptySubtext}>Add your first room to begin scanning</Text>
          </View>
        ) : (
          <FlatList
            data={rooms}
            renderItem={({ item }) => (
              <RoomCard
                room={item}
                onPress={() => navigation.navigate('RoomDetail', { propertyId, roomId: item.id })}
                onDelete={() => handleDeleteRoom(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  propertyHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  propertyName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionsContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 13,
    color: '#9ca3af',
  },
  scannedBadge: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default PropertyDetailScreen;
