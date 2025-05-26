import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { View, StyleSheet, Text } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { userService } from '../context/AuthContext';
import { Theme } from '../../../theme';
import { Feedback } from '../../../components/Feedback';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export function SignupScreen() {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    mode: 'onChange',
  });
  const { state, dispatch } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const password = watch('password');

const onSubmit = async (data: FormData) => {
  try {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    
    if (data.password !== data.confirmPassword) {
      dispatch({ type: 'SET_ERROR', error: 'As senhas não coincidem' });
      return;
    }

    const newUser = await userService.register({
      email: data.email,
      password: data.password
    });
    
    dispatch({ type: 'SIGN_IN', user: newUser });
    dispatch({ type: 'SET_SUCCESS', success: 'Cadastro realizado com sucesso!' });
    
    setTimeout(() => {
      navigation.navigate('Main');
    }, 2000);

  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao realizar cadastro';
    
    dispatch({ type: 'SET_ERROR', error: errorMessage });
  } finally {
    dispatch({ type: 'SET_LOADING', isLoading: false });
  }
};

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email é obrigatório',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido'
          }
        }}
        render={({ field }) => (
          <>
            <TextInput
              label="Email"
              value={field.value}
              onChangeText={field.onChange}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              error={!!errors.email}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Senha é obrigatória',
          minLength: {
            value: 6,
            message: 'Mínimo de 6 caracteres'
          }
        }}
        render={({ field }) => (
          <>
            <TextInput
              label="Senha"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              style={styles.input}
              error={!!errors.password}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: 'Confirme sua senha',
          validate: value => value === password || 'As senhas não coincidem'
        }}
        render={({ field }) => (
          <>
            <TextInput
              label="Confirmar Senha"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              style={styles.input}
              error={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword.message}</Text>
            )}
          </>
        )}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        disabled={state.isLoading}
      >
        {state.isLoading ? (
          <ActivityIndicator color={Theme.colors.background} />
        ) : (
          'Cadastre-se'
        )}
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.link}
        labelStyle={styles.linkLabel}
      >
        Já possui uma conta? Login
      </Button>

      <View style={styles.feedbackContainer}>
        <Feedback
          isLoading={state.isLoading}
          error={state.error}
          success={state.success}
          onDismiss={() => dispatch({ type: 'SET_ERROR', error: '' })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Theme.spacing.medium,
    backgroundColor: Theme.colors.background,
  },
  input: {
    marginBottom: Theme.spacing.small,
    backgroundColor: Theme.colors.background,
  },
  button: {
    marginTop: Theme.spacing.medium,
    paddingVertical: Theme.spacing.small,
    borderRadius: Theme.borderRadius.medium,
    backgroundColor: Theme.colors.primary,
  },
  buttonLabel: {
    color: Theme.colors.background,
    fontSize: Theme.typography.body,
  },
  link: {
    marginTop: Theme.spacing.medium,
    alignSelf: 'center',
  },
  linkLabel: {
    color: Theme.colors.primary,
  },
  error: {
    color: Theme.colors.error,
    fontSize: Theme.typography.body - 2,
    marginBottom: Theme.spacing.small,
    marginLeft: Theme.spacing.xsmall,
  },
  feedbackContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});