import { Controller, useForm } from 'react-hook-form';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text } from 'react-native';
import { Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { useTasks } from '../context/TaskContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Theme } from '../../../theme';
import { Task } from '../types';

type FormData = {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
};

type RootStackParamList = {
  TaskList: undefined;
};

type RouteParams = {
  task: Task;
};

export function EditTaskScreen() {
  const route = useRoute();
  const { task } = route.params as RouteParams;
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
    },
  });
  const { dispatch } = useTasks();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onSubmit = (data: FormData) => {
    dispatch({
      type: 'UPDATE_TASK',
      id: task.id,
      updates: data,
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', id: task.id });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            icon="close"
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            labelStyle={styles.buttonLabel}
          >
            Cancelar
          </Button>
        </View>

        <Controller
          control={control}
          name="title"
          rules={{
            required: 'Título é obrigatório',
            minLength: { value: 3, message: 'Mínimo 3 caracteres' }
          }}
          render={({ field }) => (
            <>
              <TextInput
                label="Título"
                value={field.value}
                onChangeText={field.onChange}
                style={styles.input}
                mode="outlined"
                error={!!errors.title}
              />
              {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{
            required: 'Descrição é obrigatória',
            minLength: { value: 10, message: 'Mínimo 10 caracteres' }
          }}
          render={({ field }) => (
            <>
              <TextInput
                label="Descrição"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                style={[styles.input, styles.descriptionInput]}
                mode="outlined"
                numberOfLines={4}
                error={!!errors.description}
              />
              {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SegmentedButtons
              value={field.value}
              onValueChange={field.onChange}
              buttons={[
                { value: 'todo', label: 'Para Fazer' },
                { value: 'in_progress', label: 'Em Andamento' },
                { value: 'done', label: 'Concluída' },
              ]}
              style={styles.segmented}
            />
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Salvar Alterações
        </Button>

        <Button
          mode="contained"
          onPress={handleDelete}
          style={[styles.button, styles.deleteButton]}
          labelStyle={styles.buttonLabel}
        >
          Excluir Tarefa
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    padding: Theme.spacing.medium,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Theme.spacing.medium,
  },
  cancelButton: {
    marginRight: -Theme.spacing.small,
  },
  input: {
    marginBottom: Theme.spacing.small,
    backgroundColor: Theme.colors.background,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  segmented: {
    marginVertical: Theme.spacing.medium,
  },
  button: {
    marginTop: Theme.spacing.small,
    borderRadius: Theme.borderRadius.medium,
    paddingVertical: Theme.spacing.small,
    backgroundColor: Theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: Theme.colors.error,
    marginTop: Theme.spacing.small,
  },
  buttonLabel: {
    fontSize: Theme.typography.body,
    color: Theme.colors.background,
  },
  error: {
    color: Theme.colors.error,
    fontSize: Theme.typography.body - 2,
    marginBottom: Theme.spacing.small,
    marginLeft: Theme.spacing.xsmall,
  },
});