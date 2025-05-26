import { User } from '../features/auth/types';
import { Task } from '../features/tasks/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MockAdapter from 'axios-mock-adapter';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'usuario@teste.com',
    password: 'senha123',
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Tarefa de Exemplo',
    description: 'Esta é uma tarefa de exemplo',
    status: 'todo',
    userId: '1'
  }
];

const initializeMockData = async () => {
  try {
    await AsyncStorage.setItem('users', JSON.stringify(mockUsers));
    await AsyncStorage.setItem('tasks_1', JSON.stringify(mockTasks));
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};

export const setupMocks = (instance: any) => {
  const mock = new MockAdapter(instance, { delayResponse: 500 });
  
  initializeMockData();

  mock.onPost('/auth/login').reply(async (config) => {
    const { email, password } = JSON.parse(config.data);
    const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);
    
    return user 
      ? [200, { 
          token: `mock-token-${user.id}`,
          user 
        }]
      : [401, { message: 'Credenciais inválidas' }];
  });

  mock.onPost('/auth/register').reply(async (config) => {
    const newUser = JSON.parse(config.data);
    const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
    
    if (users.some((u: User) => u.email === newUser.email)) {
      return [400, { message: 'Email já cadastrado' }];
    }

    const user: User = { ...newUser, id: String(users.length + 1) };
    await AsyncStorage.setItem('users', JSON.stringify([...users, user]));
    
    return [201, { 
      token: `mock-token-${user.id}`,
      user 
    }];
  });

  const getUserIdFromToken = (authHeader: any): string => {
    if (typeof authHeader !== 'string') return '';
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2) return '';
    return tokenParts[1].split('-')[2] || '';
  };

  mock.onGet('/tasks').reply(async (config) => {
    const userId = getUserIdFromToken(config.headers?.Authorization);
    const tasks = JSON.parse(await AsyncStorage.getItem(`tasks_${userId}`) || '[]');
    return [200, tasks];
  });

  mock.onPost('/tasks').reply(async (config) => {
    const userId = getUserIdFromToken(config.headers?.Authorization);
    const newTask = JSON.parse(config.data);
    
    const tasks = JSON.parse(await AsyncStorage.getItem(`tasks_${userId}`) || '[]');
    const task: Task = { 
      ...newTask, 
      id: String(tasks.length + 1)
    };
    
    await AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify([...tasks, task]));
    return [201, task];
  });

  mock.onPatch(/\/tasks\/\d+/).reply(async (config) => {
    const userId = getUserIdFromToken(config.headers?.Authorization);
    const taskId = config.url?.split('/').pop();
    const updates = JSON.parse(config.data);
    
    let tasks = JSON.parse(await AsyncStorage.getItem(`tasks_${userId}`) || '[]');
    tasks = tasks.map((t: Task) => t.id === taskId ? { ...t, ...updates } : t);
    
    await AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
    return [200, tasks.find((t: Task) => t.id === taskId)];
  });

  mock.onDelete(/\/tasks\/\d+/).reply(async (config) => {
    const userId = getUserIdFromToken(config.headers?.Authorization);
    const taskId = config.url?.split('/').pop();
    
    let tasks = JSON.parse(await AsyncStorage.getItem(`tasks_${userId}`) || '[]');
    tasks = tasks.filter((t: Task) => t.id !== taskId);
    
    await AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
    return [204];
  });
};