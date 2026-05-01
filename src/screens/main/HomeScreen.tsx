import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '@/store/authStore';
import { usePropertyStore } from '@/store/propertyStore';
import Screen from '@/components/Screen';
import Button from '@/components/Button';
import { Property } from '@/types';

const PropertyCard: React.FC<{ property: Property; onPress: () => void }> = ({ property, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.cardTitle}>{property.name}</Text>
        {property.address && <Text style={styles.cardSubtitle}>{property.address}</Text>}
        {property.city && (
          <Text style={styles.cardSubtitle}>
            {property.city}
            {property.state && `, ${property.state}`}
          </Text>
        )}
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { properties, loading, fetchProperties } = usePropertyStore();

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchProperties(user.id);
      }
    }, [user])
  );

  return (
    <Screen spacing={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Properties</Text>
        <Button
          title="+ New Property"
          onPress={() => navigation.navigate('CreateProperty')}
          variant="primary"
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : properties.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No properties yet</Text>
          <Text style={styles.emptySubtext}>Create your first property to get started</Text>
        </View>
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
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#f3f4f6',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  },
  arrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  listContent: {
    flexGrow: 1,
  },
  centerContainer: {
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

export default HomeScreen;
