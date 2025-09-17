import addVaccationCategory, {
  UpdateVaccationData,
} from "@/helpers/addVaccationCategory";
import { useState } from "react";
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

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
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

export default function AddCategoryModal({
  visible,
  onClose,
  onCategoryAdded,
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setCategoryName("");
    setSelectedColor(COLOR_PALETTE[0]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    setIsLoading(true);

    try {
      const newCategoryData: UpdateVaccationData = {
        name: categoryName.trim(),
        color: selectedColor.value,
        border: selectedColor.border,
      };

      const result = await addVaccationCategory(newCategoryData);

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", "Category added successfully!");
        resetForm();
        onClose();
        onCategoryAdded(); // Refresh the categories list
      }
    } catch {
      Alert.alert("Error", "Failed to add category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <IconSymbol name="xmark" size={24} color="white" />
              </TouchableOpacity>
              <ThemedText type="title" style={styles.title}>
                Add New Category
              </ThemedText>
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleAddCategory}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <ThemedText style={styles.saveButtonText}>
                  {isLoading ? "Adding..." : "Add"}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formContainer}>
                {/* Category Name Input */}
                <View style={styles.inputSection}>
                  <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Category Name
                  </ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholder="Enter category name"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    multiline
                    maxLength={100}
                  />
                </View>

                {/* Color Selection */}
                <View style={styles.inputSection}>
                  <ThemedText type="subtitle" style={styles.sectionTitle}>
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
                            styles.selectedColor,
                        ]}
                        onPress={() => setSelectedColor(color)}
                        activeOpacity={0.7}
                      >
                        {selectedColor.name === color.name && (
                          <IconSymbol
                            name="checkmark"
                            size={16}
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
              </View>
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "rgba(76, 175, 80, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: "rgba(128, 128, 128, 0.5)",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    padding: 12,
    color: "white",
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: "top",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "white",
  },
  selectedColorText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});
