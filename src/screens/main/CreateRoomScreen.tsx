import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useProperties } from '@/hooks';
import { Screen, TextInput, Button, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { isNonEmpty } from '@/lib';
import { PropertiesScreenProps } from '@/types';

const CreateRoomScreen: React.FC<PropertiesScreenProps<'CreateRoom'>> = ({ navigation, route }) => {
  const { propertyId } = route.params;
  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [floorLevel, setFloorLevel] = useState('');
  const [validationError, setValidationError] = useState('');

  const { createRoom, loading, error, clearError } = useProperties();

  const handleCreate = async () => {
    setValidationError('');
    if (!isNonEmpty(name)) {
      setValidationError('Room name is required');
      return;
    }

    const newRoom = await createRoom(propertyId, {
      name: name.trim(),
      room_type: roomType.trim() || null,
      floor_level: floorLevel.trim() || null,
    });

    if (newRoom) {
      navigation.replace('RoomDetail', { propertyId, roomId: newRoom.id });
    }
  };

  const dismissError = () => {
    clearError();
    setValidationError('');
  };

  return (
    <Screen scrollable>
      {(error || validationError) && (
        <ErrorMessage message={error || validationError} onDismiss={dismissError} />
      )}

      <Text style={styles.sectionTitle}>New Room</Text>
      <Text style={styles.helper}>Add a room before scanning. You can edit details anytime.</Text>

      <TextInput
        label="Room Name *"
        placeholder="e.g., Master Bedroom, Kitchen"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput
        label="Room Type"
        placeholder="bedroom, kitchen, bathroom..."
        value={roomType}
        onChangeText={setRoomType}
        editable={!loading}
      />
      <TextInput
        label="Floor Level"
        placeholder="1st, 2nd, basement..."
        value={floorLevel}
        onChangeText={setFloorLevel}
        editable={!loading}
      />

      <Button title="Create Room" onPress={handleCreate} loading={loading} disabled={!name.trim()} />
      <Button title="Cancel" onPress={() => navigation.goBack()} variant="secondary" disabled={loading} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  helper: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
});

export default CreateRoomScreen;
