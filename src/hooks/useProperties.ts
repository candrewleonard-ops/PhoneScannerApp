import { usePropertyStore } from '@/store/propertyStore';

export function useProperties() {
  const properties = usePropertyStore((state) => state.properties);
  const currentProperty = usePropertyStore((state) => state.currentProperty);
  const rooms = usePropertyStore((state) => state.rooms);
  const loading = usePropertyStore((state) => state.loading);
  const error = usePropertyStore((state) => state.error);
  const fetchProperties = usePropertyStore((state) => state.fetchProperties);
  const fetchProperty = usePropertyStore((state) => state.fetchProperty);
  const fetchRooms = usePropertyStore((state) => state.fetchRooms);
  const createProperty = usePropertyStore((state) => state.createProperty);
  const updateProperty = usePropertyStore((state) => state.updateProperty);
  const deleteProperty = usePropertyStore((state) => state.deleteProperty);
  const createRoom = usePropertyStore((state) => state.createRoom);
  const updateRoom = usePropertyStore((state) => state.updateRoom);
  const deleteRoom = usePropertyStore((state) => state.deleteRoom);
  const clearError = usePropertyStore((state) => state.clearError);

  return {
    properties,
    currentProperty,
    rooms,
    loading,
    error,
    fetchProperties,
    fetchProperty,
    fetchRooms,
    createProperty,
    updateProperty,
    deleteProperty,
    createRoom,
    updateRoom,
    deleteRoom,
    clearError,
  };
}
