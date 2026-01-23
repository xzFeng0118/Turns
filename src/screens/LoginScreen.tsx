import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { useAuth } from '@/hooks/useAuth';

export function LoginScreen() {
  const { signIn, isLoading, error } = useAuth();

  const [email, setEmail] = useState('demo@turns.app');
  const [password, setPassword] = useState('password');

  return (
    <Screen>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Mock login for now. Use any non-empty values.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="you@example.com"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.button, isLoading ? styles.buttonDisabled : null]}
          onPress={() => signIn({ email, password })}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Signing in…' : 'Sign in'}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 6, color: '#666' },
  form: { marginTop: 18 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: { marginTop: 12, color: '#b00020' },
  button: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
