import { StyleSheet, TouchableOpacity, View } from "react-native";
import { RenderItemParams } from "react-native-draggable-flatlist";
import DraggableList from "./DraggableList";
import DraggableTaskList from "./DraggableTaskList";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";

interface DraggableCategoryListProps {
  categories: any[];
  onCategoriesReorder: (reorderedCategories: any[]) => void;
  onTasksReorder: (categoryId: string, reorderedTasks: any[]) => void;
  onCategoryClick: (categoryId: string) => void;
  onTaskClick: (task: any, categoryId: string) => void;
  onAddTask: (categoryId: string) => void;
}

export default function DraggableCategoryList({
  categories,
  onCategoriesReorder,
  onTasksReorder,
  onCategoryClick,
  onTaskClick,
  onAddTask,
}: DraggableCategoryListProps) {
  const handleCategoriesDragEnd = (reorderedCategories: any[]) => {
    // Update priority based on new order
    const categoriesWithUpdatedPriority = reorderedCategories.map(
      (category, index) => ({
        ...category,
        priority: index + 1,
      })
    );
    onCategoriesReorder(categoriesWithUpdatedPriority);
  };

  const handleTasksReorder = (categoryId: string, reorderedTasks: any[]) => {
    onTasksReorder(categoryId, reorderedTasks);
  };

  const renderCategoryItem = ({
    item: category,
    drag,
    isActive,
  }: RenderItemParams<any>) => {
    return (
      <View style={[styles.categoryBox, isActive && styles.activeCategoryBox]}>
        <View style={styles.categoryHeader}>
          <TouchableOpacity
            style={styles.categoryNameButton}
            onPress={() => onCategoryClick(category._id)}
            activeOpacity={0.7}
          >
            <ThemedText
              type="default"
              style={[
                styles.categoryText,
                category.isMarkedDone && styles.strikethrough,
              ]}
            >
              {category.name}
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.categoryControls}>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => onAddTask(category._id)}
              activeOpacity={0.7}
            >
              <IconSymbol name="plus.circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dragHandle}
              onLongPress={drag}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.dragHandleText}>⋮⋮</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        {category.tasks && category.tasks.length > 0 && (
          <DraggableTaskList
            tasks={category.tasks}
            onTasksReorder={(reorderedTasks) =>
              handleTasksReorder(category._id, reorderedTasks)
            }
            onTaskClick={(task) => onTaskClick(task, category._id)}
          />
        )}
      </View>
    );
  };

  return (
    <DraggableList
      data={categories}
      onDragEnd={handleCategoriesDragEnd}
      renderItem={renderCategoryItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.categoriesContainer}
    />
  );
}

const styles = StyleSheet.create({
  categoriesContainer: {
    padding: 20,
    paddingBottom: 100, // Space for floating add button
  },
  categoryBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  activeCategoryBox: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryNameButton: {
    flex: 1,
  },
  categoryText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  categoryControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addTaskButton: {
    padding: 4,
  },
  dragHandle: {
    padding: 8,
  },
  dragHandleText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    opacity: 0.6,
  },
});
