import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { usePropertyStore } from '@/store/propertyStore';
import Screen from '@/components/Screen';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

const CreatePropertyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  const { user } = useAuthStore();
  const { createProperty, loading, error, clearError } = usePropertyStore();

  const handleCreate = async () => {
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Property name is required');
      return;
    }

    if (!user?.id) return;

    const newProperty = await createProperty(user.id, {
      name: name.trim(),
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      zip: zip.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    if (newProperty) {
      navigation.goBack();
    }
  };

  return (
    <Screen scrollable spacing>
      {(error || validationError) && (
        <ErrorMessage
          message={error || validationError}
          onDismiss={clearError}
        />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <TextInput
          label="Property Name *"
          placeholder="e.g., 123 Main St Flip"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <TextInput
          label="Address"
          placeholder="123 Main Street"
          value={address}
          onChangeText={setAddress}
          editable={!loading}
        />

        <TextInput
          label="City"
          placeholder="New York"
          value={city}
          onChangeText={setCity}
          editable={!loading}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <TextInput
              label="State"
              placeholder="NY"
              value={state}
              onChangeText={setState}
              editable={!loading}
            />
          </View>
          <View style={styles.halfWidth}>
            <TextInput
              label="ZIP"
              placeholder="10001"
              value={zip}
              onChangeText={setZip}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>
        </View>

        <TextInput
          label="Notes"
          placeholder="Any initial observations..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          editable={!loading}
        />
      </View>

      <Button
        title="Create Property"
        onPress={handleCreate}
        loading={loading}
        disabled={!name.trim()}
      />

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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
});

export default CreatePropertyScreen;
