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
};

type RootStackParamList = {
  Signup: undefined;
  Main: undefined;
};

export function LoginScreen() {
  const { control, handleSubmit } = useForm<FormData>();
  const { dispatch } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onSubmit = async (data: FormData) => {
    try {
      const user = await userService.login(data.email, data.password);
      
      if (user) {
        dispatch({ type: 'SIGN_IN', user });
      } else {
        dispatch({ type: 'SET_ERROR', error: 'Credenciais inválidas' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Erro no login' });
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            label="Email"
            value={field.value}
            onChangeText={field.onChange}
            style={styles.input}
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
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

      <Button 
        mode="contained" 
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      >
        Login
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Signup')}
        style={styles.link}
      >
        Não possui uma conta? Cadastre-se
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