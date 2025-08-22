import { ThemedText } from "@/components/ThemedText";
import getAllCategories, { CategoryData } from "@/helpers/getAllCategories";
import updateCategoryPriorityAPI from "@/helpers/updateCategoryPriority";
import React, { useEffect } from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function TodayScreen() {
  const [categories, setCategories] = React.useState<CategoryData[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isReordering, setIsReordering] = React.useState(false);

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

  const handleLongPress = (index: number) => {
    Alert.alert("Reorder Categories", "Choose an action:", [
      ...(index > 0
        ? [
            {
              text: "Move Up",
              onPress: () => moveCategoryUp(index),
            },
          ]
        : []),
      ...(index < categories.length - 1
        ? [
            {
              text: "Move Down",
              onPress: () => moveCategoryDown(index),
            },
          ]
        : []),
      {
        text: "Cancel",
        style: "cancel" as const,
      },
    ]);
  };

  const moveCategoryUp = async (index: number) => {
    if (index === 0) return;

    const oldPriority = index;
    const newPriority = index - 1;

    await updateCategoryOrder(oldPriority, newPriority, index, index - 1);
  };

  const moveCategoryDown = async (index: number) => {
    if (index === categories.length - 1) return;

    const oldPriority = index;
    const newPriority = index + 1;

    await updateCategoryOrder(oldPriority, newPriority, index, index + 1);
  };

  const updateCategoryOrder = async (
    oldPriority: number,
    newPriority: number,
    oldIndex: number,
    newIndex: number
  ) => {
    // If priorities are the same, don't call the function
    if (oldPriority === newPriority) return;

    try {
      setIsReordering(true);

      // Call the API to update category priority
      const categoryToUpdate = categories[oldIndex];
      const result = await updateCategoryPriorityAPI(
        categoryToUpdate,
        categoryToUpdate._id || String(oldIndex),
        newPriority
      );

      if (result.error) {
        setError(result.error);
      } else {
        // On success, update the local categories state
        const newCategories = [...categories];
        const [movedCategory] = newCategories.splice(oldIndex, 1);
        newCategories.splice(newIndex, 0, movedCategory);
        setCategories(newCategories);
        setError(null); // Clear any previous errors
      }
    } catch {
      setError("Failed to update category order");
    } finally {
      setIsReordering(false);
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
          <ThemedText type="title" style={styles.title}>
            Today&apos;s Tasks
          </ThemedText>
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
                  onLongPress={() => handleLongPress(index)}
                  delayLongPress={500}
                  activeOpacity={0.7}
                >
                  <ThemedText type="default" style={styles.categoryText}>
                    {category.name}
                  </ThemedText>
                  {isReordering && (
                    <ThemedText type="default" style={styles.reorderingText}>
                      Reordering...
                    </ThemedText>
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
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  scrollView: {
    width: "100%",
  },
  categoriesContainer: {
    width: "100%",
    paddingHorizontal: 0,
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
    textAlign: "center",
  },
  reorderingText: {
    color: "white",
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
    opacity: 0.8,
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
});
