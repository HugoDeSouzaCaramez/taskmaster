import { Controller, useForm } from 'react-hook-form';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useTasks } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { v4 as uuidv4 } from 'uuid';
import { Theme } from '../../../theme';

type FormData = {
  title: string;
  description: string;
};

type RootStackParamList = {
  TaskList: undefined;
};

export function CreateTaskScreen() {
  const { control, handleSubmit } = useForm<FormData>();
  const { dispatch } = useTasks();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onSubmit = (data: FormData) => {
    const newTask = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: 'todo' as const,
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
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              label="Título"
              value={field.value}
              onChangeText={field.onChange}
              style={styles.input}
              mode="outlined"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextInput
              label="Descrição"
              value={field.value}
              onChangeText={field.onChange}
              multiline
              style={[styles.input, styles.descriptionInput]}
              mode="outlined"
              numberOfLines={4}
            />
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
    marginBottom: Theme.spacing.medium,
    backgroundColor: Theme.colors.background,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: Theme.spacing.large,
    borderRadius: Theme.borderRadius.medium,
    paddingVertical: Theme.spacing.xsmall,
    backgroundColor: Theme.colors.primary,
  },
  buttonLabel: {
    fontSize: Theme.typography.body,
    color: Theme.colors.background,
  },
});