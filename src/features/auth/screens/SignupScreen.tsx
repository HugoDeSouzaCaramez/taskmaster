import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { userService } from '../context/AuthContext';

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
  const { control, handleSubmit, watch } = useForm<FormData>();
  const { dispatch } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        dispatch({ type: 'SET_ERROR', error: 'As senhas não coincidem' });
        return;
      }

      const newUser = await userService.createUser({
        email: data.email,
        password: data.password
      });
      
      navigation.navigate('Login');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Erro no cadastro' });
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field }) => (
          <TextInput
            label="Email"
            value={field.value}
            onChangeText={field.onChange}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: true, minLength: 6 }}
        render={({ field }) => (
          <TextInput
            label="Password"
            value={field.value}
            onChangeText={field.onChange}
            secureTextEntry
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: true,
          validate: value => value === password || 'Passwords do not match'
        }}
        render={({ field, fieldState }) => (
          <TextInput
            label="Confirm Password"
            value={field.value}
            onChangeText={field.onChange}
            secureTextEntry
            style={styles.input}
            error={!!fieldState.error}
          />
        )}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      >
        Cadastre-se
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.link}
      >
        Já possui uma conta? Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    paddingVertical: 5,
  },
  link: {
    marginTop: 15,
    alignSelf: 'center',
  },
});