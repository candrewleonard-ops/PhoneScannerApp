import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useAuth, useProperties } from '@/hooks';
import { Screen, TextInput, Button, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { isNonEmpty } from '@/lib';
import { PropertiesScreenProps } from '@/types';

const CreatePropertyScreen: React.FC<PropertiesScreenProps<'CreateProperty'>> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [validationError, setValidationError] = useState('');

  const { user } = useAuth();
  const { createProperty, loading, error, clearError } = useProperties();

  const handleCreate = async () => {
    setValidationError('');
    if (!isNonEmpty(name)) {
      setValidationError('Property name is required');
      return;
    }
    if (!user?.id) {
      setValidationError('You must be signed in');
      return;
    }

    const newProperty = await createProperty(user.id, {
      name: name.trim(),
      address: address.trim() || null,
      city: city.trim() || null,
      state: state.trim() || null,
      zip: zip.trim() || null,
    });

    if (newProperty) {
      navigation.goBack();
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
      <TextInput label="City" placeholder="City" value={city} onChangeText={setCity} editable={!loading} />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <TextInput label="State" placeholder="ST" value={state} onChangeText={setState} editable={!loading} />
        </View>
        <View style={styles.halfWidth}>
          <TextInput
            label="ZIP"
            placeholder="00000"
            value={zip}
            onChangeText={setZip}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>
      </View>

      <Button title="Create Property" onPress={handleCreate} loading={loading} />
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
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  halfWidth: {
    flex: 1,
  },
});

export default CreatePropertyScreen;
