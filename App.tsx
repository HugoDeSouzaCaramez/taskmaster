import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/features/auth/context/AuthContext';
import { TaskProvider } from './src/features/tasks/context/TaskContext';
import { AuthNavigator } from './src/features/auth/navigation/AuthNavigator';
import { MainNavigator } from './src/features/tasks/navigation/MainNavigator';
import { useAuth } from './src/features/auth/context/AuthContext';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Theme } from './src/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import uuid from 'react-native-uuid';
import 'expo-crypto';
import 'react-native-get-random-values';


const Stack = createStackNavigator();

const mockUsers = [
  {
    id: uuid.v4(),
    email: 'usuario@teste.com',
    password: 'senha123'
  }
];

const mockTasks = [
  {
    id: uuid.v4(),
    title: 'Tarefa de Exemplo',
    description: 'Esta é uma tarefa de exemplo',
    status: 'todo',
    userId: mockUsers[0].id
  }
];

export default function App() {
  useEffect(() => {
    const initializeMockData = async () => {
      try {
        const existingUsers = await AsyncStorage.getItem('users');
        if (!existingUsers) {
          await AsyncStorage.setItem('users', JSON.stringify(mockUsers));
        }
      } catch (error) {
        console.error('Error initializing mock data:', error);
      }
    };
    initializeMockData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <TaskProvider>
            <NavigationContainer>
              <View style={styles.globalContainer}>
                <RootNavigator />
              </View>
            </NavigationContainer>
          </TaskProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

function RootNavigator() {
  const { state } = useAuth();

  if (state.isLoading) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state.user ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ animationTypeForReplace: state.isLoading ? 'push' : 'pop' }}
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  globalContainer: {
    flex: 1,
    marginHorizontal: Theme.spacing.medium,
    marginTop: Theme.spacing.small,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
});