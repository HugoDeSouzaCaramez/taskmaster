import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../../services/apiClient';

type User = {
  id: string;
  email: string;
  password: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
};

type AuthAction =
  | { type: 'SIGN_IN'; user: User }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_SUCCESS'; success: string };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>(null!);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return { 
        ...state, 
        user: action.user, 
        error: null, 
        success: 'Login realizado com sucesso!' 
      };
    case 'SIGN_OUT':
      return { 
        ...state, 
        user: null, 
        success: 'Logout realizado com sucesso!' 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_ERROR':
      return { ...state, error: action.error, success: null };
    case 'SET_SUCCESS':
      return { ...state, success: action.success, error: null };
    default:
      return state;
  }
};

export const userService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      await AsyncStorage.setItem('authToken', response.data.token);
      return response.data.user;
    } catch (error) {
      if (isApiError(error)) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Falha desconhecida no login');
    }
  },

  register: async (userData: Omit<User, 'id'>) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('currentUser', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      if (isApiError(error)) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Falha desconhecida no registro');
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  }
};
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    error: null,
    success: null,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const user: User = JSON.parse(userData);
          dispatch({ type: 'SIGN_IN', user });
        }
      } catch (e) {
        dispatch({ type: 'SET_ERROR', error: 'Erro ao carregar usuário' });
      } finally {
        dispatch({ type: 'SET_LOADING', isLoading: false });
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const isApiError = (error: unknown): error is { 
  response: { 
    data: { 
      message: string 
    } 
  } 
} => {
  return typeof error === 'object' && 
         error !== null && 
         'response' in error && 
         typeof (error as any).response.data?.message === 'string';
};