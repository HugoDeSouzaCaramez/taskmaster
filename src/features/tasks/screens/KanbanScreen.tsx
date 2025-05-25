import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  LayoutChangeEvent
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';
import DraggableTask from '../components/DraggableTask';
import { Theme } from '../../../theme';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const columns: { 
  title: string; 
  status: Task['status'] 
}[] = [
  { title: 'Para Fazer', status: 'todo' },
  { title: 'Em Andamento', status: 'in_progress' },
  { title: 'Concluída', status: 'done' },
];

const KanbanScreen = () => {
  const { state, dispatch } = useTasks();
  const navigation = useNavigation();
  const [columnLayouts, setColumnLayouts] = useState<{ [key: string]: { x: number; y: number; width: number; height: number } }>({});
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [currentColumn, setCurrentColumn] = useState<Task['status'] | null>(null);

  const handleLayout = (status: Task['status'], event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setColumnLayouts(prev => ({ ...prev, [status]: { x, y, width, height } }));
  };

  const handleDrag = (task: Task, x: number, y: number) => {
    let newStatus: Task['status'] = task.status;
    
    for (const column of columns) {
      const layout = columnLayouts[column.status];
      if (layout && x >= layout.x && x <= layout.x + layout.width && y >= layout.y && y <= layout.y + layout.height) {
        newStatus = column.status;
        break;
      }
    }
    
    setCurrentColumn(newStatus);
    setDraggedTask(task);
  };

  const handleDragEnd = (task: Task, x: number, y: number) => {
    let newStatus: Task['status'] = task.status;
    
    for (const column of columns) {
      const layout = columnLayouts[column.status];
      if (layout && x >= layout.x && x <= layout.x + layout.width && y >= layout.y && y <= layout.y + layout.height) {
        newStatus = column.status;
        break;
      }
    }

    if (newStatus !== task.status) {
      dispatch({ type: 'UPDATE_TASK', id: task.id, updates: { status: newStatus } });
    }
    
    setDraggedTask(null);
    setCurrentColumn(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            icon="arrow-left"
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            labelStyle={styles.buttonLabel}
          >
            Voltar
          </Button>
        </View>
        
        <View style={styles.columnsContainer}>
          {columns.map(column => (
            <View
              key={column.status}
              style={styles.column}
              onLayout={(e) => handleLayout(column.status, e)}
            >
              <Text style={styles.sectionHeader}>{column.title}</Text>
              <FlatList
                data={state.tasks
                  .filter(t => t.status === column.status)
                  .concat(
                    draggedTask && currentColumn === column.status && draggedTask.status !== column.status 
                      ? [draggedTask] 
                      : []
                  )}
                renderItem={({ item }) => (
                  <DraggableTask
                    task={item}
                    onDrag={(task, x, y) => handleDrag(task, x, y)}
                    onDragEnd={(task, x, y) => handleDragEnd(task, x, y)}
                    isDragging={draggedTask?.id === item.id}
                  />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.columnContent}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.medium,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Theme.spacing.small,
  },
  backButton: {
    marginLeft: -Theme.spacing.small,
  },
  buttonLabel: {
    color: Theme.colors.primary,
    fontSize: Theme.typography.body,
  },
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: Theme.spacing.small,
  },
  sectionHeader: {
    fontSize: Theme.typography.header,
    fontWeight: 'bold',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.medium,
    marginVertical: Theme.spacing.small,
    borderRadius: Theme.borderRadius.medium,
    elevation: Theme.elevation.low,
    color: Theme.colors.text,
    textAlign: 'center',
  },
  columnContent: {
    paddingBottom: Theme.spacing.medium,
  },
});

export default KanbanScreen;