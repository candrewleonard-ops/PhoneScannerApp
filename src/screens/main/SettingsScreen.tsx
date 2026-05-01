import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useAuth } from '@/hooks';
import { Screen, Button, Card } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { APP_NAME, APP_VERSION } from '@/constants';
import { SettingsScreenProps } from '@/types';

const SettingsScreen: React.FC<SettingsScreenProps<'Settings'>> = () => {
  const { user, signOut, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut();
          } catch {
            Alert.alert('Error', 'Failed to sign out');
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  return (
    <Screen scrollable>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.sectionLabel}>Account</Text>
      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || '—'}</Text>
        </View>
        {user?.name && (
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
        )}
      </Card>

      <Text style={styles.sectionLabel}>App</Text>
      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{APP_NAME}</Text>
        </View>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>{APP_VERSION}</Text>
        </View>
      </Card>

      <Button title="Sign Out" onPress={handleSignOut} loading={signingOut || loading} variant="danger" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as '700',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium as '500',
  },
});

export default SettingsScreen;
