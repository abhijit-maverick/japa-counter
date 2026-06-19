import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Text, StyleSheet } from 'react-native';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <View style={styles.error}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMsg}>{error.message}</Text>
      <Text style={styles.errorStack}>{error.stack}</Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <StatusBar style="dark" backgroundColor="#FDF3E3" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  error: {
    flex: 1, padding: 20, paddingTop: 60,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20, fontWeight: 'bold',
    color: 'red', marginBottom: 10,
  },
  errorMsg: {
    fontSize: 14, color: '#333',
    marginBottom: 10,
  },
  errorStack: {
    fontSize: 11, color: '#666',
  },
});
