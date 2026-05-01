import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth, useProperties } from '@/hooks';
import { Screen, Button, Card, Loading, EmptyState, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { Property, PropertiesScreenProps } from '@/types';

const PropertyCard: React.FC<{ property: Property; onPress: () => void }> = ({ property, onPress }) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.cardRow}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{property.name}</Text>
          {property.address && <Text style={styles.cardSubtitle}>{property.address}</Text>}
          {(property.city || property.state) && (
            <Text style={styles.cardSubtitle}>
              {[property.city, property.state].filter(Boolean).join(', ')}
            </Text>
          )}
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </Card>
  );
};

const PropertiesScreen: React.FC<PropertiesScreenProps<'Properties'>> = ({ navigation }) => {
  const { user } = useAuth();
  const { properties, loading, error, fetchProperties, clearError } = useProperties();

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchProperties(user.id);
      }
    }, [user?.id, fetchProperties])
  );

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties</Text>
        <Button
          title="+ New Property"
          onPress={() => navigation.navigate('CreateProperty')}
          fullWidth={false}
        />
      </View>

      <View style={styles.body}>
        {error && <ErrorMessage message={error} onDismiss={clearError} />}

        {loading && properties.length === 0 ? (
          <Loading message="Loading properties..." />
        ) : properties.length === 0 ? (
          <EmptyState
            icon="🏠"
            title="No properties yet"
            message="Create your first property to begin scanning."
            actionLabel="+ Create Property"
            onAction={() => navigation.navigate('CreateProperty')}
          />
        ) : (
          <FlatList
            data={properties}
            renderItem={({ item }) => (
              <PropertyCard
                property={item}
                onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.id })}
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
    paddingTop: spacing.xl + spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as '700',
    color: colors.text,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  list: {
    paddingBottom: spacing.lg,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold as '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: fontSize.xxl,
    color: colors.textMuted,
    marginLeft: spacing.md,
  },
});

export default PropertiesScreen;
