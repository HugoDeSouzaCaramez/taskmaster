import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { Task } from '../types';


type TaskState = {
  tasks: Task[];
};

type TaskAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; id: string; updates: Partial<Task> }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'LOAD_TASKS'; tasks: Task[] };

const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}>(null!);

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
  const [state, dispatch] = useReducer(taskReducer, { tasks: [] });

  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        dispatch({ type: 'LOAD_TASKS', tasks: JSON.parse(savedTasks) });
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);