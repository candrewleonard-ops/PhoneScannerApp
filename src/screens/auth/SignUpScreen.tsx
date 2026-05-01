import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks';
import { Screen, TextInput, Button, ErrorMessage } from '@/components';
import { colors, spacing, fontSize, fontWeight } from '@/constants/theme';
import { isValidEmail, isValidPassword, isNonEmpty } from '@/lib';
import { AuthScreenProps } from '@/types';

const SignUpScreen: React.FC<AuthScreenProps<'SignUp'>> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { signUp, loading, error, clearError } = useAuth();

  const handleSignUp = async () => {
    setValidationError('');
    if (!isNonEmpty(name)) return setValidationError('Name is required');
    if (!isValidEmail(email)) return setValidationError('Valid email is required');
    if (!isValidPassword(password)) return setValidationError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setValidationError('Passwords do not match');

    try {
      await signUp(email.trim(), password, name.trim());
    } catch {
      // handled in store
    }
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start scanning properties</Text>
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

        <TextInput label="Full Name" placeholder="John Doe" value={name} onChangeText={setName} editable={!loading} />
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
          placeholder="At least 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        <TextInput
          label="Confirm Password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <Button title="Create Account" onPress={handleSignUp} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Sign In
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

export default SignUpScreen;
