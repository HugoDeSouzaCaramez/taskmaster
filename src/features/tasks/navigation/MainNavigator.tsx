import { createStackNavigator } from '@react-navigation/stack';
import { KanbanScreen } from '../screens/KanbanScreen';
import { TaskListScreen } from '../screens/TaskListScreen';

const Stack = createStackNavigator();

export const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TaskList" component={TaskListScreen} />
    <Stack.Screen name="Kanban" component={KanbanScreen} />
  </Stack.Navigator>
);