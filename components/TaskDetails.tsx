import DateTimePicker from "@react-native-community/datetimepicker";
import {
  deleteTask,
  getModifiedCategories,
  toggleTaskDone,
  updateTask,
} from "dhruvtodo";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";

interface Task {
  _id: string;
  name: string;
  notes?: string;
  done: boolean;
  canBeRepeated: boolean;
  when?: string | Date;
  [key: string]: any;
}

interface TaskDetailsProps {
  task: Task;
  onBack: () => void;
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

export default function TaskDetails({
  task,
  onBack,
  categories,
  categoryId,
  onCategoriesUpdate,
}: TaskDetailsProps) {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize selectedDays and selectedDayOfMonth based on task.when
  const initializeRepeatValues = () => {
    if (task.when && typeof task.when === "string") {
      // Check if it's a number (day of month format)
      const dayNum = parseInt(task.when);
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
        return { days: [], dayOfMonth: dayNum };
      }
      // Check if it's comma-separated days (e.g., "Monday,Wednesday,Friday")
      else if (task.when.includes(",")) {
        const days = task.when
          .split(",")
          .filter((day) => DAYS_OF_WEEK.includes(day));
        return { days, dayOfMonth: null };
      }
      // Check if it's a single day
      else if (DAYS_OF_WEEK.includes(task.when)) {
        return { days: [task.when], dayOfMonth: null };
      }
    }
    return { days: [], dayOfMonth: null };
  };

  const { days: initialDays, dayOfMonth: initialDayOfMonth } =
    initializeRepeatValues();
  const [selectedDays, setSelectedDays] = useState<string[]>(initialDays);
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<number | null>(
    initialDayOfMonth
  );

  const handleNotesChange = (text: string) => {
    setEditedTask((prev) => ({ ...prev, notes: text }));
  };

  const handleDoneToggle = () => {
    const newDoneStatus = !editedTask.done;

    // Use toggleTaskDone from dhruvtodo
    const updatedCategories = toggleTaskDone(
      JSON.parse(JSON.stringify(categories)), // Deep copy to avoid direct state mutation
      categoryId,
      task.name,
      newDoneStatus
    );
    // Get modified categories for API update
    const modifiedCategories = getModifiedCategories(
      categories,
      updatedCategories
    );

    // Update local state
    setEditedTask((prev) => ({ ...prev, done: newDoneStatus }));

    // Update categories and navigate back
    onCategoriesUpdate(modifiedCategories, updatedCategories);
    onBack();
  };

  const handleCanBeRepeatedToggle = () => {
    setEditedTask((prev) => ({
      ...prev,
      canBeRepeated: !prev.canBeRepeated,
      when: !prev.canBeRepeated ? undefined : prev.when,
    }));
    setSelectedDays([]);
    setSelectedDayOfMonth(null);
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEditedTask((prev) => ({ ...prev, when: selectedDate }));
    }
  };

  const handleUpdate = () => {
    let updatedTask = { ...editedTask };

    if (editedTask.canBeRepeated) {
      if (selectedDays.length > 0) {
        updatedTask.when = selectedDays.join(",");
      } else if (selectedDayOfMonth) {
        updatedTask.when = selectedDayOfMonth.toString();
      }
    }

    // Use updateTask from dhruvtodo
    const updatedCategories = updateTask(
      JSON.parse(JSON.stringify(categories)), // Deep copy to avoid direct state mutation
      categoryId,
      task.name,
      updatedTask
    );

    console.log("Updated categories from updateTask:", updatedCategories);

    // Get modified categories for API update
    const modifiedCategories = getModifiedCategories(
      categories,
      updatedCategories
    );

    console.log(
      "Modified categories from getModifiedCategories:",
      modifiedCategories
    );

    // Update categories through callback
    onCategoriesUpdate(modifiedCategories, updatedCategories);

    onBack();
    Alert.alert("Success", "Task updated successfully!");
  };

  const handleDelete = () => {
    console.log("Delete operation started");
    console.log("Categories data received:", categories);
    console.log("Category ID:", categoryId);
    console.log("Task name:", task.name);

    // Use deleteTask from dhruvtodo
    const updatedCategories = deleteTask(
      JSON.parse(JSON.stringify(categories)), // Deep copy to avoid direct state mutation
      categoryId,
      task.name
    );

    console.log("Updated categories from deleteTask:", updatedCategories);

    // Get modified categories for API update
    const modifiedCategories = getModifiedCategories(
      categories,
      updatedCategories
    );

    console.log(
      "Modified categories from getModifiedCategories:",
      modifiedCategories
    );

    // Update categories and navigate back
    onCategoriesUpdate(modifiedCategories, updatedCategories);
    onBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>{"<"}</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ThemedText type="title" style={styles.taskName}>
          {editedTask.name}
        </ThemedText>

        <View style={styles.notesSection}>
          <ThemedText style={styles.sectionTitle}>Notes:</ThemedText>
          {isEditingNotes ? (
            <TextInput
              style={styles.notesInput}
              value={editedTask.notes || ""}
              onChangeText={handleNotesChange}
              placeholder="Add notes..."
              multiline
              onBlur={() => setIsEditingNotes(false)}
              autoFocus
              selection={{
                start: (editedTask.notes || "").length,
                end: (editedTask.notes || "").length,
              }}
            />
          ) : (
            <TouchableOpacity onPress={() => setIsEditingNotes(true)}>
              <ThemedText style={styles.notesText}>
                {editedTask.notes || "Tap to add notes..."}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.controlsSection}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              editedTask.canBeRepeated && styles.activeToggle,
            ]}
            onPress={handleCanBeRepeatedToggle}
          >
            <ThemedText style={styles.toggleText}>
              Can Be Repeated: {editedTask.canBeRepeated ? "Yes" : "No"}
            </ThemedText>
          </TouchableOpacity>

          {editedTask.canBeRepeated ? (
            <View style={styles.repeatOptions}>
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
            <View style={styles.dateSection}>
              <ThemedText style={styles.sectionTitle}>Due Date:</ThemedText>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.dateText}>
                  {editedTask.when &&
                  editedTask.when !== "" &&
                  editedTask.when !== undefined &&
                  !isNaN(new Date(editedTask.when).getTime())
                    ? new Date(editedTask.when).toLocaleDateString()
                    : "Select Date"}
                </ThemedText>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={
                    editedTask.when &&
                    editedTask.when !== "" &&
                    editedTask.when !== undefined &&
                    !isNaN(new Date(editedTask.when).getTime())
                      ? new Date(editedTask.when)
                      : new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.updateButton]}
            onPress={handleUpdate}
          >
            <IconSymbol name="arrow.clockwise" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Update</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              editedTask.done ? styles.undoneButton : styles.doneButton,
            ]}
            onPress={handleDoneToggle}
          >
            <IconSymbol
              name={editedTask.done ? "new.releases" : "checkmark.circle"}
              size={20}
              color="white"
            />
            <ThemedText style={styles.actionButtonText}>
              {editedTask.done ? "Undone" : "Done"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <IconSymbol name="trash" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Delete</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  taskName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  notesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  notesInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  notesText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    minHeight: 80,
  },
  controlsSection: {
    marginBottom: 30,
  },
  toggleButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  activeToggle: {
    backgroundColor: "rgba(76, 175, 80, 0.3)",
  },
  toggleText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  repeatOptions: {
    marginTop: 10,
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
  monthDaysContainer: {
    marginBottom: 15,
  },
  monthDayButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 8,
    marginRight: 5,
    minWidth: 35,
    alignItems: "center",
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
  dateSection: {
    marginTop: 10,
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "column",
    gap: 5,
  },
  updateButton: {
    backgroundColor: "rgba(76, 175, 80, 0.8)",
  },
  doneButton: {
    backgroundColor: "rgba(33, 150, 243, 0.8)",
  },
  undoneButton: {
    backgroundColor: "rgba(255, 152, 0, 0.8)",
  },
  deleteButton: {
    backgroundColor: "rgba(244, 67, 54, 0.8)",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
