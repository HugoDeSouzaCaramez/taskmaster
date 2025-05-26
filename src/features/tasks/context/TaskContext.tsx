import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Task } from '../types';
import { useAuth } from '../../auth/context/AuthContext';
import apiClient from '../../../services/apiClient';

type TaskState = {
  tasks: Task[];
};

type TaskAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; id: string; updates: Partial<Task> }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'LOAD_TASKS'; tasks: Task[] };

type TaskContextType = {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

const TaskContext = createContext<TaskContextType>(null!);

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'LOAD_TASKS':
      return { tasks: action.tasks };
    case 'ADD_TASK':
      return { tasks: [...state.tasks, action.task] };
    case 'UPDATE_TASK':
      return {
        tasks: state.tasks.map(task =>
          task.id === action.id ? { ...task, ...action.updates } : task
        ),
      };
    case 'DELETE_TASK':
      return { tasks: state.tasks.filter(task => task.id !== action.id) };
    default:
      return state;
  }
};

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { state: authState } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, { tasks: [] });

  const loadTasks = async () => {
    if (!authState.user) return;
    
    try {
      const response = await apiClient.get('/tasks');
      dispatch({ type: 'LOAD_TASKS', tasks: response.data });
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      dispatch({ type: 'ADD_TASK', task: response.data });
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await apiClient.patch(`/tasks/${id}`, updates);
      dispatch({ type: 'UPDATE_TASK', id, updates: response.data });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      dispatch({ type: 'DELETE_TASK', id });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadTasks();
  }, [authState.user]);

  return (
    <TaskContext.Provider value={{ 
      state, 
      dispatch,
      loadTasks,
      addTask,
      updateTask,
      deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};