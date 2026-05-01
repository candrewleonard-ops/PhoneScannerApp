import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import Screen from '@/components/Screen';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    try {
      await signIn(email, password);
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <Screen scrollable spacing>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Reinnovation Scan</Text>
          <Text style={styles.subtitle}>Real Estate Inspection Tool</Text>
        </View>

        {error && <ErrorMessage message={error} onDismiss={clearError} />}

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

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          disabled={!email || !password}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignUp')}
          >
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
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  link: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default LoginScreen;
