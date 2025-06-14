import { FlatList, View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from 'react-native-paper';
import { useAuth } from '../../auth/context/AuthContext';
import { userService } from '../../auth/context/AuthContext';
import { Swipeable } from 'react-native-gesture-handler';
import { Theme } from '../../../theme';

type RootStackParamList = {
  Kanban: undefined;
  CreateTask: undefined;
  EditTask: { task: any };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function TaskListScreen() {
  const { state, dispatch } = useTasks();
  const { dispatch: authDispatch, state: authState } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    try {
      await userService.logout();
      authDispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };


  const handleDelete = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', id: taskId });
  };

  const renderRightActions = (taskId: string) => {
    return (
      <View style={styles.deleteContainer}>
        <Button
          mode="contained"
          onPress={() => handleDelete(taskId)}
          style={styles.deleteButton}
          labelStyle={styles.deleteLabel}
        >
          Excluir
        </Button>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Kanban')}
            style={styles.switchButton}
            labelStyle={styles.buttonLabel}
          >
            Mudar para Kanban
          </Button>

          <Button
            mode="text"
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.buttonLabel}
          >
            Logout
          </Button>
        </View>

        <FlatList
          data={state.tasks.filter(task => task.userId === authState.user?.id)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <TaskCard
                task={item}
                onPress={() => navigation.navigate('EditTask', { task: item })}
              />
            </Swipeable>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma task encontrada</Text>}
          contentContainerStyle={styles.listContent}
        />

        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateTask')}
          style={styles.addButton}
          labelStyle={styles.addButtonLabel}
        >
          Adicionar Task
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.medium,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.medium,
  },
  listContent: {
    paddingBottom: Theme.spacing.xlarge,
  },
  empty: {
    textAlign: 'center',
    marginTop: Theme.spacing.large,
    fontSize: Theme.typography.body,
    color: Theme.colors.text,
  },
  addButton: {
    position: 'absolute',
    bottom: Theme.spacing.large,
    right: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.medium,
    paddingVertical: Theme.spacing.xsmall,
    backgroundColor: Theme.colors.primary,
    elevation: Theme.elevation.medium,
  },
  switchButton: {
    borderRadius: Theme.borderRadius.medium,
    borderColor: Theme.colors.primary,
  },
  logoutButton: {
    borderRadius: Theme.borderRadius.medium,
  },
  buttonLabel: {
    fontSize: Theme.typography.body,
    color: Theme.colors.primary,
  },
  addButtonLabel: {
    color: Theme.colors.background,
    fontSize: Theme.typography.body,
  },
  deleteContainer: {
    backgroundColor: Theme.colors.error,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
    marginVertical: Theme.spacing.xsmall,
  },
  deleteButton: {
    height: '100%',
    borderRadius: 0,
    backgroundColor: Theme.colors.error,
  },
  deleteLabel: {
    color: Theme.colors.background,
    fontSize: Theme.typography.body - 2,
  },
});