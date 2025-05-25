import { Controller, useForm } from 'react-hook-form';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useTasks } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import uuid from 'react-native-uuid';
import { Theme } from '../../../theme';
import { useAuth } from '../../auth/context/AuthContext';

type FormData = {
  title: string;
  description: string;
};

type RootStackParamList = {
  TaskList: undefined;
};

export function CreateTaskScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { dispatch } = useTasks();
  const { state: authState } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onSubmit = (data: FormData) => {
    if (!authState.user) return;
    
    const newTask = {
      id: uuid.v4(),
      title: data.title,
      description: data.description,
      status: 'todo' as const,
      userId: authState.user.id
    };
    
    dispatch({ type: 'ADD_TASK', task: newTask });
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
            minLength: {
              value: 3,
              message: 'Mínimo de 3 caracteres'
            }
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
            minLength: {
              value: 10,
              message: 'Mínimo de 10 caracteres'
            }
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
              {errors.description && (
                <Text style={styles.error}>{errors.description.message}</Text>
              )}
            </>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Criar Tarefa
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
  button: {
    marginTop: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.medium,
    paddingVertical: Theme.spacing.small,
    backgroundColor: Theme.colors.primary,
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