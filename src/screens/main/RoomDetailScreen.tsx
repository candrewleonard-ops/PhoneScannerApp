import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usePropertyStore } from '@/store/propertyStore';
import Screen from '@/components/Screen';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

const RoomDetailScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { propertyId, roomId, isNew } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  const { createRoom, updateRoom, loading, error, clearError, fetchRooms } = usePropertyStore();

  useFocusEffect(
    useCallback(() => {
      if (!isNew && roomId) {
        // TODO: Load room data when we have a getRoom endpoint
      }
    }, [roomId, isNew])
  );

  const handleSave = async () => {
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Room name is required');
      return;
    }

    if (isNew) {
      const newRoom = await createRoom(propertyId, {
        name: name.trim(),
        description: description.trim() || undefined,
        scan_completed: false,
      });

      if (newRoom) {
        await fetchRooms(propertyId);
        navigation.goBack();
      }
    } else if (roomId) {
      await updateRoom(roomId, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      navigation.goBack();
    }
  };

  return (
    <Screen scrollable spacing>
      {(error || validationError) && (
        <ErrorMessage message={error || validationError} onDismiss={clearError} />
      )}

      {loading && <ActivityIndicator size="large" />}

      <Text style={styles.sectionTitle}>Room Information</Text>

      <TextInput
        label="Room Name *"
        placeholder="e.g., Master Bedroom, Kitchen, Bathroom"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <TextInput
        label="Description"
        placeholder="Any details about this room..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        editable={!loading}
      />

      <View style={styles.spacing}>
        <Text style={styles.infoText}>💡 Scan features will be available after creation.</Text>
      </View>

      <Button title="Save Room" onPress={handleSave} loading={loading} disabled={!name.trim()} />

      <Button
        title="Cancel"
        onPress={() => navigation.goBack()}
        variant="secondary"
        disabled={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  spacing: {
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#92400e',
  },
});

export default RoomDetailScreen;
