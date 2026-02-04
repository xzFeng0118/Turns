import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/contexts/AuthContext';

export function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signUp, loading, error } = useAuth();
  const [info, setInfo] = useState<string | undefined>(undefined);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Sign up with your email and password.</Text>

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

        <Pressable
          style={[styles.button, loading ? styles.buttonDisabled : null]}
          onPress={async () => {
            setInfo(undefined);
            try {
              await signUp(email, password);
              setInfo('Account created. If email confirmation is enabled, check your inbox before signing in.');
            } catch {
              return;
            }
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating…' : 'Create account'}</Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={styles.info}>{info}</Text> : null}

        <Pressable onPress={() => navigation.navigate('Login')} disabled={loading}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
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
  info: { marginTop: 12, color: '#666' },
  link: { marginTop: 14, color: '#111', fontWeight: '700', textAlign: 'center' },
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
