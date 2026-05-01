import React from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PropertiesScreen from '@/screens/main/PropertiesScreen';
import PropertyDetailScreen from '@/screens/main/PropertyDetailScreen';
import CreatePropertyScreen from '@/screens/main/CreatePropertyScreen';
import CreateRoomScreen from '@/screens/main/CreateRoomScreen';
import RoomDetailScreen from '@/screens/main/RoomDetailScreen';
import ScanRoomScreen from '@/screens/main/ScanRoomScreen';
import GuidedInspectionScreen from '@/screens/main/GuidedInspectionScreen';
import RepairNotesScreen from '@/screens/main/RepairNotesScreen';
import ScopeItemsScreen from '@/screens/main/ScopeItemsScreen';
import SettingsScreen from '@/screens/main/SettingsScreen';

import { colors } from '@/constants/theme';
import { MainTabParamList, PropertiesStackParamList, SettingsStackParamList } from '@/types';

const PropertiesStack = createNativeStackNavigator<PropertiesStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const PropertiesStackNavigator: React.FC = () => (
  <PropertiesStack.Navigator screenOptions={{ headerBackTitle: 'Back' }}>
    <PropertiesStack.Screen
      name="Properties"
      component={PropertiesScreen}
      options={{ headerShown: false }}
    />
    <PropertiesStack.Screen
      name="PropertyDetail"
      component={PropertyDetailScreen}
      options={{ title: 'Property' }}
    />
    <PropertiesStack.Screen
      name="CreateProperty"
      component={CreatePropertyScreen}
      options={{ title: 'New Property', presentation: 'modal' }}
    />
    <PropertiesStack.Screen
      name="CreateRoom"
      component={CreateRoomScreen}
      options={{ title: 'New Room', presentation: 'modal' }}
    />
    <PropertiesStack.Screen
      name="RoomDetail"
      component={RoomDetailScreen}
      options={{ title: 'Room' }}
    />
    <PropertiesStack.Screen
      name="ScanRoom"
      component={ScanRoomScreen}
      options={{ title: 'Scan Room' }}
    />
    <PropertiesStack.Screen
      name="GuidedInspection"
      component={GuidedInspectionScreen}
      options={{ title: 'Inspection' }}
    />
    <PropertiesStack.Screen
      name="RepairNotes"
      component={RepairNotesScreen}
      options={{ title: 'Repair Notes' }}
    />
    <PropertiesStack.Screen
      name="ScopeItems"
      component={ScopeItemsScreen}
      options={{ title: 'Scope Items' }}
    />
  </PropertiesStack.Navigator>
);

const SettingsStackNavigator: React.FC = () => (
  <SettingsStack.Navigator screenOptions={{ headerBackTitle: 'Back' }}>
    <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
  </SettingsStack.Navigator>
);

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="PropertiesTab"
        component={PropertiesStackNavigator}
        options={{
          tabBarLabel: 'Properties',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
