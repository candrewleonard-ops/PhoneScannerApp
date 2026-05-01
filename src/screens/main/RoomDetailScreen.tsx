import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useProperties } from '@/hooks';
import { Screen, TextInput, Button, ErrorMessage, Card } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { isNonEmpty } from '@/lib';
import { PropertiesScreenProps } from '@/types';

const RoomDetailScreen: React.FC<PropertiesScreenProps<'RoomDetail'>> = ({ navigation, route }) => {
  const { propertyId, roomId, isNew } = route.params;
  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [floorLevel, setFloorLevel] = useState('');
  const [validationError, setValidationError] = useState('');

  const { createRoom, updateRoom, loading, error, clearError } = useProperties();

  const handleSave = async () => {
    setValidationError('');
    if (!isNonEmpty(name)) {
      setValidationError('Room name is required');
      return;
    }

    if (isNew) {
      const newRoom = await createRoom(propertyId, {
        name: name.trim(),
        room_type: roomType.trim() || null,
        floor_level: floorLevel.trim() || null,
      });
      if (newRoom) navigation.goBack();
    } else if (roomId) {
      await updateRoom(roomId, {
        name: name.trim(),
        room_type: roomType.trim() || null,
        floor_level: floorLevel.trim() || null,
      });
      navigation.goBack();
    }
  };

  const handleScan = () => {
    if (roomId) {
      navigation.navigate('ScanRoom', { propertyId, roomId });
    }
  };

  return (
    <Screen scrollable>
      {(error || validationError) && (
        <ErrorMessage
          message={error || validationError}
          onDismiss={() => {
            clearError();
            setValidationError('');
          }}
        />
      )}

      <Text style={styles.sectionTitle}>{isNew ? 'New Room' : 'Edit Room'}</Text>

      <TextInput
        label="Room Name *"
        placeholder="e.g., Master Bedroom"
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

      <Button title={isNew ? 'Create Room' : 'Save Changes'} onPress={handleSave} loading={loading} />

      {!isNew && roomId && (
        <Card style={styles.scanCard}>
          <View>
            <Text style={styles.scanTitle}>Scan This Room</Text>
            <Text style={styles.scanDesc}>
              Capture wall lengths, doors, windows, and ceiling height with ARKit/RoomPlan.
            </Text>
            <Button title="Open Scanner" onPress={handleScan} variant="outline" />
          </View>
        </Card>
      )}

      <Button title="Cancel" onPress={() => navigation.goBack()} variant="secondary" disabled={loading} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as '600',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  scanCard: {
    backgroundColor: colors.surface,
    marginTop: spacing.lg,
  },
  scanTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  scanDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
});

export default RoomDetailScreen;
