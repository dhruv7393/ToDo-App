import DateTimePicker from "@react-native-community/datetimepicker";
import { addTask, getModifiedCategories } from "dhruvtodo";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  categories: any[];
  categoryId: string;
  onCategoriesUpdate: (
    modifiedCategories: any[],
    updatedCategories: any[]
  ) => void;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddTaskModal({
  visible,
  onClose,
  categories,
  categoryId,
  onCategoriesUpdate,
}: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [canBeRepeated, setCanBeRepeated] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const resetForm = () => {
    setTaskName("");
    setTaskNotes("");
    setCanBeRepeated(false);
    setSelectedDays([]);
    setSelectedDayOfMonth(null);
    setSelectedDate(null);
    setShowDatePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCanBeRepeatedToggle = () => {
    setCanBeRepeated(!canBeRepeated);
    setSelectedDays([]);
    setSelectedDayOfMonth(null);
    setSelectedDate(null);
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
    // Clear day of month selection when days are selected
    setSelectedDayOfMonth(null);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddTask = () => {
    if (!taskName.trim()) {
      Alert.alert("Error", "Please enter a task name");
      return;
    }

    let when: string | Date | undefined;

    if (canBeRepeated) {
      if (selectedDays.length > 0) {
        when = selectedDays.join(",");
      } else if (selectedDayOfMonth) {
        when = selectedDayOfMonth.toString();
      }
    } else if (selectedDate) {
      when = selectedDate;
    }

    const taskDetails = {
      name: taskName.trim(),
      notes: taskNotes.trim(),
      done: false,
      canBeRepeated,
      when,
    };

    try {
      // Use addTask from dhruvtodo
      const updatedCategories = addTask(
        JSON.parse(JSON.stringify(categories)), // Deep copy to avoid direct state mutation
        categoryId,
        taskDetails
      );

      // Get modified categories for API update
      const modifiedCategories = getModifiedCategories(
        categories,
        updatedCategories
      );

      // Update categories through callback
      onCategoriesUpdate(modifiedCategories, updatedCategories);

      Alert.alert("Success", "Task added successfully!");
      handleClose();
    } catch {
      Alert.alert("Error", "Failed to add task");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Add New Task</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Task Name *</ThemedText>
            <TextInput
              style={styles.textInput}
              value={taskName}
              onChangeText={setTaskName}
              placeholder="Enter task name..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Notes</ThemedText>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              value={taskNotes}
              onChangeText={setTaskNotes}
              placeholder="Add notes..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                canBeRepeated && styles.activeToggle,
              ]}
              onPress={handleCanBeRepeatedToggle}
            >
              <ThemedText style={styles.toggleText}>
                Can Be Repeated: {canBeRepeated ? "Yes" : "No"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {canBeRepeated ? (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Select Days:</ThemedText>
              <View style={styles.daysContainer}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day) && styles.selectedDay,
                    ]}
                    onPress={() => handleDayToggle(day)}
                  >
                    <ThemedText style={styles.dayText}>
                      {day.slice(0, 3)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              <ThemedText style={styles.sectionTitle}>
                Or Select Day of Month:
              </ThemedText>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    (selectedDayOfMonth === null || selectedDayOfMonth <= 1) &&
                      styles.disabledButton,
                  ]}
                  onPress={() => {
                    if (selectedDayOfMonth === null) {
                      setSelectedDayOfMonth(1);
                    } else if (selectedDayOfMonth > 1) {
                      setSelectedDayOfMonth(selectedDayOfMonth - 1);
                    }
                    // Clear selected days when day of month is selected
                    setSelectedDays([]);
                  }}
                  disabled={
                    selectedDayOfMonth !== null && selectedDayOfMonth <= 1
                  }
                >
                  <ThemedText
                    style={[
                      styles.counterButtonText,
                      (selectedDayOfMonth === null ||
                        selectedDayOfMonth <= 1) &&
                        styles.disabledText,
                    ]}
                  >
                    -
                  </ThemedText>
                </TouchableOpacity>

                <View style={styles.counterValue}>
                  <ThemedText style={styles.counterValueText}>
                    {selectedDayOfMonth || 1}
                  </ThemedText>
                </View>

                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    selectedDayOfMonth === 31 && styles.disabledButton,
                  ]}
                  onPress={() => {
                    if (selectedDayOfMonth === null) {
                      setSelectedDayOfMonth(2);
                    } else if (selectedDayOfMonth < 31) {
                      setSelectedDayOfMonth(selectedDayOfMonth + 1);
                    }
                    // Clear selected days when day of month is selected
                    setSelectedDays([]);
                  }}
                  disabled={selectedDayOfMonth === 31}
                >
                  <ThemedText
                    style={[
                      styles.counterButtonText,
                      selectedDayOfMonth === 31 && styles.disabledText,
                    ]}
                  >
                    +
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Due Date:</ThemedText>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.dateText}>
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Select Date (Optional)"}
                </ThemedText>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <IconSymbol name="plus.circle.fill" size={20} color="white" />
            <ThemedText style={styles.addButtonText}>Add Task</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
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
    marginBottom: 20,
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
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  toggleButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
  },
  activeToggle: {
    backgroundColor: "rgba(76, 175, 80, 0.3)",
  },
  toggleText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 8,
    minWidth: 45,
    alignItems: "center",
    marginBottom: 5,
  },
  selectedDay: {
    backgroundColor: "rgba(76, 175, 80, 0.5)",
  },
  dayText: {
    color: "white",
    fontSize: 12,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  counterButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  counterButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  disabledText: {
    color: "rgba(255, 255, 255, 0.3)",
  },
  counterValue: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 60,
    alignItems: "center",
  },
  counterValueText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  dateButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  dateText: {
    color: "white",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "rgba(76, 175, 80, 0.8)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
