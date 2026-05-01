import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  PropertiesTab: undefined;
  SettingsTab: undefined;
};

export type PropertiesStackParamList = {
  Properties: undefined;
  PropertyDetail: { propertyId: string };
  CreateProperty: undefined;
  CreateRoom: { propertyId: string };
  RoomDetail: { propertyId: string; roomId: string };
  ScanRoom: { propertyId: string; roomId: string };
  GuidedInspection: { propertyId: string; roomId: string };
  RepairNotes: { propertyId: string; roomId: string };
  ScopeItems: { propertyId: string; roomId: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type PropertiesScreenProps<T extends keyof PropertiesStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<PropertiesStackParamList, T>,
  BottomTabScreenProps<MainTabParamList>
>;

export type SettingsScreenProps<T extends keyof SettingsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<SettingsStackParamList, T>,
  BottomTabScreenProps<MainTabParamList>
>;
