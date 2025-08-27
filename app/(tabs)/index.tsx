import TaskDetails from "@/components/TaskDetails";
import { ThemedText } from "@/components/ThemedText";
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

  const fetchCategories = async () => {
    const result = await getAllCategories();

    const { data = [], error } = result;

    if (error) {
      setError(error);
      // Handle error
    } else {
      setCategories(data);
      // Process categories as needed
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

  const handleCategoriesUpdate = async (
    modifiedCategories: CategoryData[],
    updatedCategories: CategoryData[]
  ) => {
    try {
      const response = await updateVaccation(modifiedCategories);
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

  if (showTaskDetails && selectedTask) {
    return (
      <TaskDetails
        task={selectedTask}
        onBack={handleBackToCategories}
        categories={categories}
        categoryId={selectedCategoryId}
        onCategoriesUpdate={handleCategoriesUpdate}
      />
    );
  }

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
                  <ThemedText type="default" style={styles.categoryText}>
                    {category.isMarkedDone ? (
                      <del>{category.name}</del>
                    ) : (
                      category.name
                    )}
                  </ThemedText>
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
                          {task.notes && task.notes !== "" && (
                            <ThemedText type="default" style={styles.taskNotes}>
                              {task.notes}
                            </ThemedText>
                          )}
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
  categoryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "left",
    paddingLeft: 10,
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
});
