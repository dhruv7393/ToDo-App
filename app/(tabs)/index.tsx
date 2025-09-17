import AddCategoryModal from "@/components/AddCategoryModal";
import AddTaskModal from "@/components/AddTaskModal";
import CategoryDetailsModal from "@/components/CategoryDetailsModal";
import TaskDetails from "@/components/TaskDetails";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import getAllCategories, { CategoryData } from "@/helpers/getAllCategories";
import updateVaccation from "@/helpers/updateVaccation";
import { getModifiedCategories, updateTaskPriority } from "dhruvtodo";
import React, { useEffect } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [selectedTaskForPriority, setSelectedTaskForPriority] = React.useState<{
    taskName: string;
    categoryId: string;
  } | null>(null);

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
        setCategories(data);
        setError(null);
      }
    } catch (err) {
      console.error("Fetch categories failed:", err);
      setError("Failed to load categories");
      setCategories([]);
    }
  };

  const handleTaskClick = (task: any, categoryId: string) => {
    // Clear priority selection when task is clicked normally
    clearPrioritySelection();

    setSelectedTask(task);
    setSelectedCategoryId(categoryId);
    setShowTaskDetails(true);
  };

  const handleBackToCategories = () => {
    clearPrioritySelection();
    setShowTaskDetails(false);
    setSelectedTask(null);
    setSelectedCategoryId("");
  };

  const handleAddTask = (categoryId: string) => {
    clearPrioritySelection();
    setAddTaskCategoryId(categoryId);
    setShowAddTaskModal(true);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
    setAddTaskCategoryId("");
  };

  const handleCategoryClick = (categoryId: string) => {
    clearPrioritySelection();
    setSelectedCategoryForEdit(categoryId);
    setShowCategoryDetails(true);
  };

  const handleCloseCategoryDetails = () => {
    setShowCategoryDetails(false);
    setSelectedCategoryForEdit("");
  };

  const handleAddCategory = () => {
    clearPrioritySelection();
    setShowAddCategoryModal(true);
  };

  const handleCloseAddCategoryModal = () => {
    setShowAddCategoryModal(false);
  };

  const handleCategoryAdded = () => {
    fetchCategories(); // Refresh the categories list
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

  const handleTaskLongPress = (taskName: string, categoryId: string) => {
    // Clear any other selected items first
    setSelectedTask(null);
    setSelectedCategoryForEdit("");
    setShowTaskDetails(false);
    setShowCategoryDetails(false);

    // Set the selected task for priority adjustment
    setSelectedTaskForPriority({ taskName, categoryId });
  };

  const handlePriorityChange = async (
    taskName: string,
    categoryId: string,
    newPriority: number
  ) => {
    try {
      // Get the current category to check task count
      const currentCategory = categories.find((cat) => cat._id === categoryId);
      if (!currentCategory) {
        return;
      }

      // Ensure priority is within valid range
      const clampedPriority = Math.max(
        1,
        Math.min(newPriority, currentCategory.tasks.length)
      );

      // Use updateTaskPriority from dhruvtodo
      const updatedCategories = updateTaskPriority(
        JSON.parse(JSON.stringify(categories)), // Deep copy to avoid direct state mutation
        categoryId,
        taskName,
        clampedPriority
      );

      // Get modified categories for API update
      const modifiedCategories = getModifiedCategories(
        categories,
        updatedCategories
      );

      // Update categories through API and local state
      await handleCategoriesUpdate(modifiedCategories, updatedCategories);

      // Clear the priority selection after successful update
      clearPrioritySelection();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error updating priority"
      );
    }
  };

  const clearPrioritySelection = () => {
    setSelectedTaskForPriority(null);
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
        <TouchableOpacity
          style={styles.content}
          activeOpacity={1}
          onPress={clearPrioritySelection}
        >
          <ScrollView
            contentContainerStyle={styles.categoriesContainer}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            {error ? (
              <ThemedText type="default" style={styles.errorMessage}>
                {error}
              </ThemedText>
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryBox}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryHeader}>
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
                      {category.tasks.map((task: any, taskIndex: number) => {
                        const isSelectedForPriority =
                          selectedTaskForPriority?.taskName === task.name &&
                          selectedTaskForPriority?.categoryId === category._id;
                        const currentPriority = task.priority || taskIndex + 1;
                        const maxPriority = category.tasks.length;

                        return (
                          <View key={task._id}>
                            <TouchableOpacity
                              style={[
                                styles.taskItem,
                                isSelectedForPriority &&
                                  styles.selectedTaskItem,
                              ]}
                              onPress={() =>
                                handleTaskClick(task, category._id)
                              }
                              onLongPress={() =>
                                handleTaskLongPress(task.name, category._id)
                              }
                              activeOpacity={0.7}
                            >
                              <ThemedText
                                type="default"
                                style={[
                                  styles.taskText,
                                  task.done && styles.strikethrough,
                                ]}
                              >
                                - {task.name}
                              </ThemedText>
                              {(() => {
                                // Handle when date display
                                let showWhen = false;
                                let displayWhen = "";

                                if (task.when) {
                                  if (typeof task.when === "string") {
                                    // Check if it's a datetime timestamp (ISO format or similar)
                                    const isDateTimeStamp =
                                      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(
                                        task.when
                                      ) ||
                                      /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(
                                        task.when
                                      );

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
                                  const isDayOfWeek =
                                    daysOfWeek.includes(displayWhen);
                                  const isDayOfMonth = /^\d{1,2}$/.test(
                                    displayWhen
                                  );
                                  const isCommaSeparatedDays =
                                    displayWhen.includes(",") &&
                                    displayWhen
                                      .split(",")
                                      .every((day: string) =>
                                        daysOfWeek.includes(day.trim())
                                      );

                                  showWhen = !(
                                    isDayOfWeek ||
                                    isDayOfMonth ||
                                    isCommaSeparatedDays
                                  );
                                }

                                return (
                                  <>
                                    {(showWhen ||
                                      (task.notes && task.notes !== "")) && (
                                      <ThemedText
                                        type="default"
                                        style={styles.taskNotes}
                                      >
                                        {showWhen && displayWhen}
                                        {showWhen &&
                                          task.notes &&
                                          task.notes !== "" &&
                                          ", "}
                                        {task.notes &&
                                          task.notes !== "" &&
                                          task.notes}
                                      </ThemedText>
                                    )}
                                  </>
                                );
                              })()}
                            </TouchableOpacity>

                            {/* Priority Controls - Show when task is selected for priority adjustment */}
                            {isSelectedForPriority && (
                              <View style={styles.priorityControls}>
                                <TouchableOpacity
                                  style={[
                                    styles.priorityButton,
                                    currentPriority <= 1 &&
                                      styles.disabledPriorityButton,
                                  ]}
                                  onPress={() => {
                                    handlePriorityChange(
                                      task.name,
                                      category._id,
                                      currentPriority - 1
                                    );
                                  }}
                                  disabled={currentPriority <= 1}
                                  activeOpacity={0.7}
                                >
                                  <IconSymbol
                                    name="chevron.up"
                                    size={18}
                                    color={
                                      currentPriority <= 1
                                        ? "rgba(255, 255, 255, 0.3)"
                                        : "white"
                                    }
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    styles.priorityButton,
                                    currentPriority >= maxPriority &&
                                      styles.disabledPriorityButton,
                                  ]}
                                  onPress={() => {
                                    handlePriorityChange(
                                      task.name,
                                      category._id,
                                      currentPriority + 1
                                    );
                                  }}
                                  disabled={currentPriority >= maxPriority}
                                  activeOpacity={0.7}
                                >
                                  <IconSymbol
                                    name="chevron.down"
                                    size={18}
                                    color={
                                      currentPriority >= maxPriority
                                        ? "rgba(255, 255, 255, 0.3)"
                                        : "white"
                                    }
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText type="default" style={styles.message}>
                Loading categories...
              </ThemedText>
            )}
          </ScrollView>
        </TouchableOpacity>
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
  selectedTaskItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  priorityControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    paddingVertical: 4,
    gap: 12,
  },
  priorityButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  disabledPriorityButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});
