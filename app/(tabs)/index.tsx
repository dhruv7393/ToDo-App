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

  const fetchCategories = async () => {
    try {
      const result = await getAllCategories();

      const { data = [], error } = result;

      if (error) {
        setError(error);
        console.warn('API Error:', error);
        // Set empty array as fallback
        setCategories([]);
      } else {
        setCategories(data);
        setError(null);
      }
    } catch (err) {
      console.error('Fetch categories failed:', err);
      setError('Failed to load categories');
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
                      <ThemedText type="default" style={styles.categoryText}>
                        {category.isMarkedDone ? (
                          <del>{category.name}</del>
                        ) : (
                          category.name
                        )}
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
                      {category.tasks.map((task: any) => (
                        <TouchableOpacity
                          key={task._id}
                          style={styles.taskItem}
                          onPress={() => handleTaskClick(task, category._id)}
                          activeOpacity={0.7}
                        >
                          <ThemedText type="default" style={styles.taskText}>
                            - {task.done ? <del>{task.name}</del> : task.name}
                          </ThemedText>
                          {(() => {
                            // Handle when date display
                            let showWhen = false;
                            let displayWhen = "";

                            if (task.when) {
                              if (typeof task.when === "string") {
                                displayWhen = task.when;
                                // Remove year from common date formats
                                // Handle formats like "12/25/2024" or "12/25/24" -> "12/25"
                                displayWhen = displayWhen.replace(
                                  /\/\d{2,4}$/g,
                                  ""
                                );
                                // Handle formats like "December 25, 2024" -> "December 25"
                                displayWhen = displayWhen.replace(
                                  /,\s*\d{4}$/g,
                                  ""
                                );
                                // Handle formats like "25/12/2024" (day/month/year) -> "25/12"
                                displayWhen = displayWhen.replace(
                                  /(\d{1,2}\/\d{1,2})\/\d{2,4}$/g,
                                  "$1"
                                );
                              } else {
                                // Format date without year (MM/DD format)
                                const date = new Date(task.when);
                                displayWhen = date.toLocaleDateString(
                                  undefined,
                                  {
                                    month: "numeric",
                                    day: "numeric",
                                  }
                                );
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
                      ))}
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
});
