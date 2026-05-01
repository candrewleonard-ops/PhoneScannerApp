import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useProperties } from '@/hooks';
import { Screen, TextInput, Button, ErrorMessage, Card } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { isNonEmpty } from '@/lib';
import { PropertiesScreenProps } from '@/types';

const RoomDetailScreen: React.FC<PropertiesScreenProps<'RoomDetail'>> = ({ navigation, route }) => {
  const { propertyId, roomId, isNew } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
        description: description.trim() || undefined,
        scan_completed: false,
      });
      if (newRoom) {
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
        placeholder="e.g., Master Bedroom, Kitchen"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput
        label="Description"
        placeholder="Notes about this room..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        editable={!loading}
      />

      <Button title={isNew ? 'Create Room' : 'Save Changes'} onPress={handleSave} loading={loading} />

      {!isNew && roomId && (
        <Card style={styles.scanCard}>
          <Text style={styles.scanTitle}>Scan This Room</Text>
          <Text style={styles.scanDesc}>
            Use ARKit/RoomPlan to capture wall lengths, doors, windows, and ceiling height.
          </Text>
          <Button title="Open Scanner" onPress={handleScan} variant="outline" />
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
