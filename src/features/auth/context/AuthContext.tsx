import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  userToken: string | null;
  isLoading: boolean;
  error: string | null;
};

type AuthAction =
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>(null!);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, userToken: action.token, error: null };
    case 'SIGN_OUT':
      return { ...state, userToken: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export function AuthProvider ({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    userToken: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          dispatch({ type: 'SIGN_IN', token: userToken });
        }
      } catch (e) {
        console.error('Error loading token:', e);
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