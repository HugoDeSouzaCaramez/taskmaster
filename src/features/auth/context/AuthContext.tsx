import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

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
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const users = await AsyncStorage.getItem('users');
    const newUser = { ...userData, id: uuid.v4() };
    
    if (users) {
      const parsedUsers = JSON.parse(users);
      await AsyncStorage.setItem('users', JSON.stringify([...parsedUsers, newUser]));
    } else {
      await AsyncStorage.setItem('users', JSON.stringify([newUser]));
    }
    
    await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  },

  login: async (email: string, password: string): Promise<User | null> => {
    const users = await AsyncStorage.getItem('users');
    if (users) {
      const parsedUsers: User[] = JSON.parse(users);
      const user = parsedUsers.find(u => u.email === email && u.password === password);
      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      }
      return user || null;
    }
    return null;
  },

  logout: async () => {
    await AsyncStorage.removeItem('currentUser');
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