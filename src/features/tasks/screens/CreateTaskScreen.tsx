import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  Platform, 
  StatusBar, 
  Text 
} from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../../auth/context/AuthContext';
import { Theme } from '../../../theme';
import { Feedback } from '../../../components/Feedback';

type FormData = {
  title: string;
  description: string;
};

type RootStackParamList = {
  TaskList: undefined;
};

export function CreateTaskScreen() {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { addTask } = useTasks();
  const { state: authState } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onSubmit = async (data: FormData) => {
    try {
      if (!authState.user) {
        throw new Error('User not authenticated');
      }

      const newTask = {
        ...data,
        status: 'todo' as const,
        userId: authState.user.id
      };

      await addTask(newTask);
      setSuccessMessage('Tarefa criada com sucesso!');
      
      setTimeout(() => {
        navigation.goBack();
      }, 2000);

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao criar tarefa');
      setTimeout(() => setErrorMessage(null), 3000);
    }
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
          render={({ field, fieldState }) => (
            <>
              <TextInput
                label="Título"
                value={field.value}
                onChangeText={field.onChange}
                style={styles.input}
                mode="outlined"
                error={!!fieldState.error}
              />
              {fieldState.error && (
                <Text style={styles.error}>{fieldState.error.message}</Text>
              )}
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
          render={({ field, fieldState }) => (
            <>
              <TextInput
                label="Descrição"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                style={[styles.input, styles.descriptionInput]}
                mode="outlined"
                numberOfLines={4}
                error={!!fieldState.error}
              />
              {fieldState.error && (
                <Text style={styles.error}>{fieldState.error.message}</Text>
              )}
            </>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Theme.colors.background} />
          ) : (
            'Criar Tarefa'
          )}
        </Button>

        <Feedback
          isLoading={isSubmitting}
          error={errorMessage}
          success={successMessage}
          onDismiss={() => {
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
        />
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