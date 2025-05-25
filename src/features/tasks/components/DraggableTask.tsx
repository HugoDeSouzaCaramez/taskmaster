import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { StyleSheet } from 'react-native';

type DraggableTaskProps = {
  task: Task;
  onDrag: (task: Task, x: number, y: number) => void;
  onDragEnd: (task: Task, x: number, y: number) => void;
  isDragging: boolean;
};

const DraggableTask = ({ task, onDrag, onDragEnd, isDragging }: DraggableTaskProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isActive = useSharedValue(false);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      isActive.value = true;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
      runOnJS(onDrag)(task, event.absoluteX, event.absoluteY);
    },
    onEnd: (event) => {
      isActive.value = false;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(onDragEnd)(task, event.absoluteX, event.absoluteY);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    zIndex: isActive.value ? 999 : 1,
    opacity: isDragging ? 0.5 : isActive.value ? 0.8 : 1,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <TaskCard task={task} />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default DraggableTask;