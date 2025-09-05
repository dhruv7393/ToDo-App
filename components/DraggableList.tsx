import React from "react";
import { StyleSheet, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

interface DraggableListProps<T> {
  data: T[];
  onDragEnd: (data: T[]) => void;
  renderItem: (params: RenderItemParams<T>) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  style?: any;
  contentContainerStyle?: any;
}

export default function DraggableList<T>({
  data,
  onDragEnd,
  renderItem,
  keyExtractor,
  style,
  contentContainerStyle,
}: DraggableListProps<T>) {
  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data: newData }) => onDragEnd(newData)}
      keyExtractor={keyExtractor}
      renderItem={({ item, drag, isActive, getIndex }) => (
        <ScaleDecorator>
          <View style={[isActive && styles.activeItem]}>
            {renderItem({ item, drag, isActive, getIndex })}
          </View>
        </ScaleDecorator>
      )}
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  activeItem: {
    opacity: 0.8,
    transform: [{ scale: 1.05 }],
  },
});
