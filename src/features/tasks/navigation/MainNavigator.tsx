import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { TaskListScreen } from '../screens/TaskListScreen';
import { CreateTaskScreen } from '../screens/CreateTaskScreen';
import { Theme } from '../../../theme';
import KanbanScreen from '../screens/KanbanScreen';

const Stack = createStackNavigator();

export const MainNavigator = () => (
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      headerShown: true,
      headerStyle: {
        backgroundColor: Theme.colors.background,
        elevation: Theme.elevation.low,
      },
      headerTitleStyle: {
        color: Theme.colors.text,
        fontSize: Theme.typography.title,
      },
      headerLeft: () => (
         <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={{ marginLeft: Theme.spacing.small }}
        />
      ),
    })}
  >
    <Stack.Screen 
      name="TaskList" 
      component={TaskListScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Kanban" 
      component={KanbanScreen} 
      options={{ title: 'Quadro Kanban' }}
    />
    <Stack.Screen 
      name="CreateTask" 
      component={CreateTaskScreen}
      options={{ title: 'Nova Tarefa' }}
    />
  </Stack.Navigator>
);