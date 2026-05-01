import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks';
import { Screen, TextInput, Button, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { APP_NAME } from '@/constants';
import { isValidEmail, isValidPassword, isNonEmpty } from '@/lib';
import { AuthScreenProps } from '@/types';

type Mode = 'signIn' | 'signUp';

const LoginScreen: React.FC<AuthScreenProps<'Login'>> = () => {
  const [mode, setMode] = useState<Mode>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { signIn, signUp, loading, error, clearError } = useAuth();

  const isSignUp = mode === 'signUp';

  const toggleMode = () => {
    setMode(isSignUp ? 'signIn' : 'signUp');
    setValidationError('');
    clearError();
  };

  const handleSubmit = async () => {
    setValidationError('');

    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email');
      return;
    }
    if (!isValidPassword(password)) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (isSignUp) {
      if (!isNonEmpty(name)) {
        setValidationError('Name is required');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
    }

    try {
      if (isSignUp) {
        await signUp(email.trim(), password, name.trim());
      } else {
        await signIn(email.trim(), password);
      }
    } catch {
      // surfaced via error state
    }
  };

  const dismissError = () => {
    clearError();
    setValidationError('');
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Real Estate Inspection Tool'}
          </Text>
        </View>

        {(error || validationError) && (
          <ErrorMessage message={error || validationError} onDismiss={dismissError} />
        )}

        {isSignUp && (
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            editable={!loading}
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
          placeholder={isSignUp ? 'At least 6 characters' : '••••••••'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {isSignUp && (
          <TextInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
        )}

        <Button
          title={isSignUp ? 'Create Account' : 'Sign In'}
          onPress={handleSubmit}
          loading={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <Text style={styles.link} onPress={toggleMode}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
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
