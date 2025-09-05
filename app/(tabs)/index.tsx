import AddCategoryModal from "@/components/AddCategoryModal";
import AddTaskModal from "@/components/AddTaskModal";
import CategoryDetailsModal from "@/components/CategoryDetailsModal";
import TaskDetails from "@/components/TaskDetails";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import getAllCategories, { CategoryData } from "@/helpers/getAllCategories";
import updateVaccation from "@/helpers/updateVaccation";
import React, { useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

export default function TodayScreen() {
  const [categories, setCategories] = React.useState<CategoryData[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<string>("");
  const [showTaskDetails, setShowTaskDetails] = React.useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);
  const [addTaskCategoryId, setAddTaskCategoryId] = React.useState<string>("");
  const [showCategoryDetails, setShowCategoryDetails] = React.useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    React.useState<string>("");
  const [showAddCategoryModal, setShowAddCategoryModal] = React.useState(false);

  // Component to render draggable tasks within a category
  const renderTaskItem = ({
    item: task,
    drag,
    isActive,
  }: RenderItemParams<any>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          style={[styles.taskItem, isActive && styles.activeTaskItem]}
          onLongPress={drag}
          onPress={() => handleTaskClick(task, selectedCategoryId)}
          activeOpacity={0.7}
        >
          <View style={styles.taskContent}>
            <TouchableOpacity style={styles.taskDragHandle} onLongPress={drag}>
              <IconSymbol
                name="chevron.right"
                size={12}
                color="rgba(255, 255, 255, 0.5)"
              />
            </TouchableOpacity>
            <IconSymbol
              name="square.fill"
              size={12}
              color="white"
              style={styles.taskIcon}
            />
            <ThemedText
              type="default"
              style={[styles.taskText, task.done && styles.strikethrough]}
            >
              {task.name}
            </ThemedText>
          </View>
          {(() => {
            // Handle when date display
            let showWhen = false;
            let displayWhen = "";

            if (task.when) {
              if (typeof task.when === "string") {
                // Check if it's a datetime timestamp (ISO format or similar)
                const isDateTimeStamp =
                  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(task.when) ||
                  /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(task.when);

                if (isDateTimeStamp) {
                  // Split datetime timestamp to get just the date part
                  displayWhen = task.when
                    .split("T")[0]
                    .split(" ")[0]
                    .split("-");
                  displayWhen = `${displayWhen[2]}/${displayWhen[1]}`;
                } else {
                  displayWhen = task.when;
                }
              }

              // Don't display if it's just a day of week or day of month
              const daysOfWeek = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ];
              const isDayOfWeek = daysOfWeek.includes(displayWhen);
              const isDayOfMonth = /^\d{1,2}$/.test(displayWhen);
              const isCommaSeparatedDays =
                displayWhen.includes(",") &&
                displayWhen
                  .split(",")
                  .every((day: string) => daysOfWeek.includes(day.trim()));

              showWhen = !(isDayOfWeek || isDayOfMonth || isCommaSeparatedDays);
            }

            return (
              <>
                {(showWhen || (task.notes && task.notes !== "")) && (
                  <ThemedText type="default" style={styles.taskNotes}>
                    {showWhen && displayWhen}
                    {showWhen && task.notes && task.notes !== "" && ", "}
                    {task.notes && task.notes !== "" && task.notes}
                  </ThemedText>
                )}
              </>
            );
          })()}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  // Component to render draggable categories
  const renderCategoryItem = ({
    item: category,
    drag,
    isActive,
  }: RenderItemParams<CategoryData>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          style={[styles.categoryBox, isActive && styles.activeCategoryItem]}
          onLongPress={drag}
          activeOpacity={0.7}
        >
          <View style={styles.categoryHeader}>
            <TouchableOpacity style={styles.dragHandle} onLongPress={drag}>
              <IconSymbol
                name="chevron.right"
                size={16}
                color="rgba(255, 255, 255, 0.5)"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryNameButton}
              onPress={() => handleCategoryClick(category._id)}
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
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => handleAddTask(category._id)}
              activeOpacity={0.7}
            >
              <IconSymbol name="plus.circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {category.tasks.length > 0 && (
            <View style={styles.tasksContainer}>
              <DraggableFlatList
                data={category.tasks}
                renderItem={(props) => {
                  setSelectedCategoryId(category._id);
                  return renderTaskItem(props);
                }}
                keyExtractor={(task: any) => task._id}
                onDragEnd={({ data }) => handleTaskDragEnd(category._id, data)}
                containerStyle={styles.tasksList}
              />
            </View>
          )}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const fetchCategories = async () => {
    try {
      const result = await getAllCategories();

      const { data = [], error } = result;

      if (error) {
        setError(error);
        console.warn("API Error:", error);
        // Set empty array as fallback
        setCategories([]);
      } else {
        // Sort categories by priority, then by name if no priority
        const sortedCategories = data
          .map((category, index) => ({
            ...category,
            priority: category.priority || index + 1,
            tasks:
              category.tasks
                ?.map((task: any, taskIndex: number) => ({
                  ...task,
                  priority: task.priority || taskIndex + 1,
                }))
                .sort(
                  (a: any, b: any) => (a.priority || 0) - (b.priority || 0)
                ) || [],
          }))
          .sort((a, b) => (a.priority || 0) - (b.priority || 0));

        setCategories(sortedCategories);
        setError(null);
      }
    } catch (err) {
      console.error("Fetch categories failed:", err);
      setError("Failed to load categories");
      setCategories([]);
    }
  };

  const handleTaskClick = (task: any, categoryId: string) => {
    setSelectedTask(task);
    setSelectedCategoryId(categoryId);
    setShowTaskDetails(true);
  };

  const handleBackToCategories = () => {
    setShowTaskDetails(false);
    setSelectedTask(null);
    setSelectedCategoryId("");
  };

  const handleAddTask = (categoryId: string) => {
    setAddTaskCategoryId(categoryId);
    setShowAddTaskModal(true);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
    setAddTaskCategoryId("");
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryForEdit(categoryId);
    setShowCategoryDetails(true);
  };

  const handleCloseCategoryDetails = () => {
    setShowCategoryDetails(false);
    setSelectedCategoryForEdit("");
  };

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
  };

  const handleCloseAddCategoryModal = () => {
    setShowAddCategoryModal(false);
  };

  const handleCategoryAdded = () => {
    fetchCategories(); // Refresh the categories list
  };

  const handleCategoryDragEnd = async (data: CategoryData[]) => {
    // Update priorities based on new order
    const updatedCategories = data.map((category, index) => ({
      ...category,
      priority: index + 1,
    }));

    setCategories(updatedCategories);

    try {
      // Update backend with new priorities
      await updateVaccation(updatedCategories);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error updating category order"
      );
      // Revert on error
      fetchCategories();
    }
  };

  const handleTaskDragEnd = async (
    categoryId: string,
    reorderedTasks: any[]
  ) => {
    // Update task priorities based on new order
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      priority: index + 1,
    }));

    // Update categories with reordered tasks
    const updatedCategories = categories.map((category) => {
      if (category._id === categoryId) {
        return {
          ...category,
          tasks: updatedTasks,
        };
      }
      return category;
    });

    setCategories(updatedCategories);

    try {
      // Find the modified category for backend update
      const modifiedCategory = updatedCategories.find(
        (cat) => cat._id === categoryId
      );
      if (modifiedCategory) {
        await updateVaccation([modifiedCategory]);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error updating task order"
      );
      // Revert on error
      fetchCategories();
    }
  };

  const handleCategoriesUpdate = async (
    modifiedCategories: CategoryData[],
    updatedCategories: CategoryData[]
  ) => {
    try {
      await updateVaccation(modifiedCategories);
      setCategories(updatedCategories);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error updating vacation"
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/Nishan.jpeg")}
      style={styles.container}
      resizeMode="stretch"
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {error ? (
            <ThemedText type="default" style={styles.errorMessage}>
              {error}
            </ThemedText>
          ) : categories.length > 0 ? (
            <DraggableFlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(category) => category._id}
              onDragEnd={({ data }) => handleCategoryDragEnd(data)}
              contentContainerStyle={styles.categoriesContainer}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            />
          ) : (
            <ThemedText type="default" style={styles.message}>
              Loading categories...
            </ThemedText>
          )}
        </View>
      </View>

      {/* Floating Add Category Button */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={handleAddCategory}
        activeOpacity={0.7}
      >
        <IconSymbol name="plus.circle.fill" size={28} color="white" />
      </TouchableOpacity>

      <AddTaskModal
        visible={showAddTaskModal}
        onClose={handleCloseAddTaskModal}
        categories={categories}
        categoryId={addTaskCategoryId}
        onCategoriesUpdate={handleCategoriesUpdate}
      />

      <AddCategoryModal
        visible={showAddCategoryModal}
        onClose={handleCloseAddCategoryModal}
        onCategoryAdded={handleCategoryAdded}
      />

      <CategoryDetailsModal
        visible={showCategoryDetails}
        onClose={handleCloseCategoryDetails}
        categories={categories}
        categoryId={selectedCategoryForEdit}
        onCategoriesUpdate={handleCategoriesUpdate}
      />

      {showTaskDetails && selectedTask && (
        <TaskDetails
          task={selectedTask}
          onBack={handleBackToCategories}
          categories={categories}
          categoryId={selectedCategoryId}
          onCategoriesUpdate={handleCategoriesUpdate}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker semi-transparent overlay for better text readability
    paddingTop: 30, // Add 30px top padding
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: "100%", // Ensure content takes full height for centering
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  scrollView: {
    width: "100%",
    flexGrow: 1, // Allow scroll view to grow
  },
  categoriesContainer: {
    width: "100%",
    paddingHorizontal: 0,
    paddingBottom: 20, // Reduced padding since tab bar is auto-hiding
    justifyContent: "center", // Center content vertically within scroll view
    flexGrow: 1, // Allow container to grow to center content
  },
  categoryBox: {
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    width: "100%",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dragHandle: {
    padding: 5,
    marginRight: 5,
  },
  categoryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "left",
    paddingLeft: 10,
    flex: 1,
  },
  categoryNameButton: {
    flex: 1,
  },
  addTaskButton: {
    padding: 5,
    marginLeft: 10,
  },
  errorMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#ff6b6b",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 10,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.9,
    color: "white",
  },
  tasksContainer: {
    marginTop: 8,
    paddingLeft: 10,
  },
  tasksList: {
    maxHeight: 200, // Limit height to prevent scroll conflicts
  },
  taskText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "left",
    paddingLeft: 10,
    marginVertical: 2,
  },
  taskWhen: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "left",
    paddingLeft: 25,
    marginTop: 2,
  },
  taskItem: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  activeTaskItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskDragHandle: {
    padding: 3,
    marginRight: 5,
  },
  taskIcon: {
    marginRight: 8,
  },
  activeCategoryItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  taskNotes: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "300",
    textAlign: "left",
    paddingLeft: 25,
    marginTop: 2,
    fontStyle: "italic",
  },
  floatingAddButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "transparent",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  strikethrough: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    opacity: 0.6,
  },
});
