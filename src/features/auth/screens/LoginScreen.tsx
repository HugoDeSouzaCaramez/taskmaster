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
};

type RootStackParamList = {
  Signup: undefined;
  Main: undefined;
};

export function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    mode: 'onChange',
  });
  const { state, dispatch } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onSubmit = async (data: FormData) => {
    try {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      const user = await userService.login(data.email, data.password);
      
      if (user) {
        dispatch({ type: 'SIGN_IN', user });
      } else {
        dispatch({ type: 'SET_ERROR', error: 'Credenciais inválidas' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Erro no login' });
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
          'Entrar'
        )}
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Signup')}
        style={styles.link}
        labelStyle={styles.linkLabel}
      >
        Não possui uma conta? Cadastre-se
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