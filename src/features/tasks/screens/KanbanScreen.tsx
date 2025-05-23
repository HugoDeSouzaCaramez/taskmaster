import { 
  SectionList, 
  Text, 
  View, 
  StyleSheet, 
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';
import { TaskCard } from '../components/TaskCard';
import { Theme } from '../../../theme';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const groupTasksByStatus = (tasks: Task[]) => {
  const sections = [
    { title: 'To Do', data: [] as Task[] },
    { title: 'In Progress', data: [] as Task[] },
    { title: 'Done', data: [] as Task[] },
  ];

  tasks.forEach(task => {
    switch (task.status) {
      case 'todo':
        sections[0].data.push(task);
        break;
      case 'in_progress':
        sections[1].data.push(task);
        break;
      case 'done':
        sections[2].data.push(task);
        break;
    }
  });

  return sections;
};

export const KanbanScreen = () => {
  const { state } = useTasks();
  const navigation = useNavigation();
  const sections = groupTasksByStatus(state.tasks);

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
        
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TaskCard task={item} />}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={<View style={styles.spacer} />}
        />
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
  listContent: {
    paddingBottom: Theme.spacing.medium,
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
  },
  spacer: {
    height: Theme.spacing.small,
  },
});