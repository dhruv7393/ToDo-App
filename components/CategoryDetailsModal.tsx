import deleteVaccationCategory from "@/helpers/deleteVaccationCategory";
import updateVaccation from "@/helpers/updateVaccation";
import {
  deleteCategoryById,
  getModifiedCategories,
  toggleCategoryDone,
} from "dhruvtodo";
import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";

interface CategoryDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  categories: any[];
  categoryId: string;
  onCategoriesUpdate: (
    modifiedCategories: any[],
    updatedCategories: any[]
  ) => void;
}

// Suggested color palette for categories
const COLOR_PALETTE = [
  {
    name: "White",
    value: "rgba(255, 255, 255, 0.1)",
    border: "rgba(255, 255, 255, 0.8)",
  },
  {
    name: "Blue",
    value: "rgba(33, 150, 243, 0.3)",
    border: "rgba(33, 150, 243, 0.8)",
  },
  {
    name: "Green",
    value: "rgba(76, 175, 80, 0.3)",
    border: "rgba(76, 175, 80, 0.8)",
  },
  {
    name: "Purple",
    value: "rgba(156, 39, 176, 0.3)",
    border: "rgba(156, 39, 176, 0.8)",
  },
  {
    name: "Orange",
    value: "rgba(255, 152, 0, 0.3)",
    border: "rgba(255, 152, 0, 0.8)",
  },
  {
    name: "Red",
    value: "rgba(244, 67, 54, 0.3)",
    border: "rgba(244, 67, 54, 0.8)",
  },
  {
    name: "Teal",
    value: "rgba(0, 150, 136, 0.3)",
    border: "rgba(0, 150, 136, 0.8)",
  },
  {
    name: "Pink",
    value: "rgba(233, 30, 99, 0.3)",
    border: "rgba(233, 30, 99, 0.8)",
  },
  {
    name: "Indigo",
    value: "rgba(63, 81, 181, 0.3)",
    border: "rgba(63, 81, 181, 0.8)",
  },
  {
    name: "Cyan",
    value: "rgba(0, 188, 212, 0.3)",
    border: "rgba(0, 188, 212, 0.8)",
  },
  {
    name: "Amber",
    value: "rgba(255, 193, 7, 0.3)",
    border: "rgba(255, 193, 7, 0.8)",
  },
  {
    name: "Deep Orange",
    value: "rgba(255, 87, 34, 0.3)",
    border: "rgba(255, 87, 34, 0.8)",
  },
  {
    name: "Brown",
    value: "rgba(121, 85, 72, 0.3)",
    border: "rgba(121, 85, 72, 0.8)",
  },
];

export default function CategoryDetailsModal({
  visible,
  onClose,
  categories,
  categoryId,
  onCategoriesUpdate,
}: CategoryDetailsModalProps) {
  // Find the current category
  const currentCategory = categories.find((cat) => cat._id === categoryId);

  const [categoryName, setCategoryName] = useState("");
  const [isMarkedDone, setIsMarkedDone] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);

  // Update state when modal opens or category changes
  useEffect(() => {
    if (visible && currentCategory) {
      setCategoryName(currentCategory.name || "");
      setIsMarkedDone(currentCategory.isMarkedDone || false);
      setSelectedColor(
        COLOR_PALETTE.find(
          (color) => currentCategory.backgroundColor === color.value
        ) || COLOR_PALETTE[0]
      );
    }
  }, [visible, currentCategory]);

  const resetForm = () => {
    if (currentCategory) {
      setCategoryName(currentCategory.name || "");
      setIsMarkedDone(currentCategory.isMarkedDone || false);
      setSelectedColor(
        COLOR_PALETTE.find(
          (color) => currentCategory.backgroundColor === color.value
        ) || COLOR_PALETTE[0]
      );
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleToggleDone = () => {
    // Only update local state, don't save immediately
    setIsMarkedDone(!isMarkedDone);
  };

  const handleDeleteCategory = async () => {
    try {
      console.log("Deleting category with ID:", categoryId);

      // Call API to delete category
      const result = await deleteVaccationCategory({
        ids: [categoryId],
      });

      console.log("API delete result:", result);

      if (result.error) {
        Alert.alert("Error", result.error);
        return;
      }

      // Remove category from local state using dhruvtodo function
      const updatedCategories = deleteCategoryById(
        JSON.parse(JSON.stringify(categories)), // Deep copy to avoid direct state mutation
        categoryId
      );

      console.log("Updated categories after deletion:", updatedCategories);

      // Get modified categories to find the difference
      const modifiedCategories = getModifiedCategories(
        categories,
        updatedCategories
      );

      console.log("Modified categories:", modifiedCategories);

      // Update the category data with updateVaccation if there are modifications
      if (modifiedCategories.length > 0) {
        const updateResult = await updateVaccation(modifiedCategories);

        console.log("Update vaccination result:", updateResult);

        if (updateResult.error) {
          Alert.alert("Error", updateResult.error);
          return;
        }
      }

      // Update categories in the index with the new data
      onCategoriesUpdate(modifiedCategories, updatedCategories);

      handleClose();
    } catch (error) {
      console.error("Error deleting category:", error);
      Alert.alert("Error", "Failed to delete category");
    }
  };

  const handleUpdateCategory = () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    try {
      // Start with current categories
      let updatedCategories = [...categories];

      // First, handle status change if needed
      if (isMarkedDone !== currentCategory.isMarkedDone) {
        updatedCategories = toggleCategoryDone(
          JSON.parse(JSON.stringify(updatedCategories)), // Deep copy to avoid direct state mutation
          categoryId,
          isMarkedDone
        );
      }

      // Then, update category name and color
      const categoryToUpdate = updatedCategories.find(
        (cat) => cat._id === categoryId
      );
      const updatedCategory = {
        ...categoryToUpdate,
        name: categoryName.trim(),
        color: selectedColor.value,
        backgroundColor: selectedColor.value,
        borderColor: selectedColor.border,
      };

      // Apply the final category updates
      updatedCategories = updatedCategories.map((cat) =>
        cat._id === categoryId ? updatedCategory : cat
      );

      // Get modified categories for API update
      const modifiedCategories = getModifiedCategories(
        categories,
        updatedCategories
      );

      console.log("Update category - modifiedCategories:", modifiedCategories);

      // Update categories through callback
      onCategoriesUpdate(modifiedCategories, updatedCategories);

      Alert.alert("Success", "Category updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating category:", error);
      Alert.alert("Error", "Failed to update category");
    }
  };

  if (!currentCategory) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ImageBackground
        source={require("@/assets/images/Nishan.jpeg")}
        style={styles.container}
        resizeMode="stretch"
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color="white" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Category Details</ThemedText>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Category Name *
              </ThemedText>
              <TextInput
                style={styles.textInput}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Status</ThemedText>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isMarkedDone && styles.activeToggle,
                ]}
                onPress={handleToggleDone}
              >
                <IconSymbol
                  name={isMarkedDone ? "checkmark.circle" : "list.bullet"}
                  size={20}
                  color="white"
                />
                <ThemedText style={styles.toggleText}>
                  {isMarkedDone ? "Completed" : "Active"}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Category Color
              </ThemedText>
              <View style={styles.colorGrid}>
                {COLOR_PALETTE.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: color.value,
                        borderColor: color.border,
                      },
                      selectedColor.name === color.name &&
                        styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor.name === color.name && (
                      <IconSymbol
                        name="checkmark.circle"
                        size={20}
                        color="white"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <ThemedText style={styles.selectedColorText}>
                Selected: {selectedColor.name}
              </ThemedText>
            </View>

            <View style={styles.previewSection}>
              <ThemedText style={styles.sectionTitle}>Preview</ThemedText>
              <View
                style={[
                  styles.categoryPreview,
                  {
                    backgroundColor: selectedColor.value,
                    borderColor: selectedColor.border,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.previewText,
                    isMarkedDone && styles.strikethrough,
                  ]}
                >
                  {categoryName || "Category Name"}
                </ThemedText>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={handleUpdateCategory}
              >
                <IconSymbol name="arrow.clockwise" size={20} color="white" />
                <ThemedText style={styles.actionButtonText}>
                  Update Category
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeleteCategory}
              >
                <IconSymbol name="trash" size={20} color="white" />
                <ThemedText style={styles.actionButtonText}>
                  Delete Category
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </Modal>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  toggleButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  activeToggle: {
    backgroundColor: "rgba(76, 175, 80, 0.3)",
  },
  toggleText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: "white",
  },
  selectedColorText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
  previewSection: {
    marginBottom: 25,
  },
  categoryPreview: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    marginTop: 10,
  },
  previewText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  actionButtons: {
    marginBottom: 30,
  },
  actionButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  updateButton: {
    backgroundColor: "rgba(76, 175, 80, 0.8)",
  },
  deleteButton: {
    backgroundColor: "rgba(244, 67, 54, 0.8)",
    marginTop: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    opacity: 0.6,
  },
});
