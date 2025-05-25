import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, ActivityIndicator } from 'react-native-paper';
import { Theme } from '../theme';

export const Feedback = ({
  isLoading,
  error,
  success,
  onDismiss
}: {
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
  onDismiss: () => void;
}) => (
  <View style={styles.container}>
    {isLoading && (
      <ActivityIndicator 
        size="large" 
        color={Theme.colors.primary} 
        style={styles.loader}
      />
    )}
    
    <Snackbar
      visible={!!error}
      onDismiss={onDismiss}
      duration={3000}
      style={[styles.snackbar, { backgroundColor: Theme.colors.error }]}>
      {error}
    </Snackbar>

    <Snackbar
      visible={!!success}
      onDismiss={onDismiss}
      duration={2000}
      style={[styles.snackbar, { backgroundColor: Theme.colors.secondary }]}>
      {success}
    </Snackbar>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 9999,
  },
  loader: {
    marginTop: Theme.spacing.large,
  },
  snackbar: {
    margin: Theme.spacing.medium,
    marginTop: Theme.spacing.large,
    borderRadius: Theme.borderRadius.medium,
  },
});