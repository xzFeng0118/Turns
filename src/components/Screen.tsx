import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

export function Screen(props: ViewProps) {
  return <View {...props} style={[styles.container, props.style]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
