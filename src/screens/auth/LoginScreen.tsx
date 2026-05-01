import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks';
import { Screen, TextInput, Button, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { APP_NAME } from '@/constants';
import { isValidEmail } from '@/lib';
import { AuthScreenProps } from '@/types';

const LoginScreen: React.FC<AuthScreenProps<'Login'>> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { signIn, loading, error, clearError } = useAuth();

  const handleLogin = async () => {
    setValidationError('');
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password');
      return;
    }
    try {
      await signIn(email.trim(), password);
    } catch {
      // handled in store
    }
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>Real Estate Inspection Tool</Text>
        </View>

        {(error || validationError) && (
          <ErrorMessage
            message={error || validationError}
            onDismiss={() => {
              clearError();
              setValidationError('');
            }}
          />
        )}

        <TextInput
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <Button title="Sign In" onPress={handleLogin} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold as '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  link: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold as '600',
  },
});

export default LoginScreen;
