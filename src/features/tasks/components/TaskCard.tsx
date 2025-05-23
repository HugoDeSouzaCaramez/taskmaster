import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task } from '../types';

type Props = {
  task: Task;
};

export const TaskCard = ({ task }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>{task.title}</Text>
    <Text>{task.description}</Text>
    <Text style={styles.status}>{task.status.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 15,
    margin: 5,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
});