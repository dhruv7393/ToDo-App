import { StyleSheet, TouchableOpacity, View } from "react-native";
import { RenderItemParams } from "react-native-draggable-flatlist";
import DraggableList from "./DraggableList";
import { ThemedText } from "./ThemedText";

interface DraggableTaskListProps {
  tasks: any[];
  onTasksReorder: (reorderedTasks: any[]) => void;
  onTaskClick: (task: any) => void;
}

export default function DraggableTaskList({
  tasks,
  onTasksReorder,
  onTaskClick,
}: DraggableTaskListProps) {
  const handleDragEnd = (reorderedTasks: any[]) => {
    // Update priority based on new order
    const tasksWithUpdatedPriority = reorderedTasks.map((task, index) => ({
      ...task,
      priority: index + 1,
    }));
    onTasksReorder(tasksWithUpdatedPriority);
  };

  const renderTaskItem = ({
    item: task,
    drag,
    isActive,
  }: RenderItemParams<any>) => {
    // Handle when date display logic
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
          const dateParts = task.when.split("T")[0].split(" ")[0].split("-");
          displayWhen = `${dateParts[2]}/${dateParts[1]}`;
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
      <TouchableOpacity
        style={[styles.taskItem, isActive && styles.activeTaskItem]}
        onPress={() => onTaskClick(task)}
        onLongPress={drag}
        activeOpacity={0.7}
      >
        <View style={styles.taskContent}>
          <ThemedText
            type="default"
            style={[styles.taskText, task.done && styles.strikethrough]}
          >
            - {task.name}
          </ThemedText>
          {(showWhen || (task.notes && task.notes !== "")) && (
            <ThemedText type="default" style={styles.taskNotes}>
              {showWhen && displayWhen}
              {showWhen && task.notes && task.notes !== "" && ", "}
              {task.notes && task.notes !== "" && task.notes}
            </ThemedText>
          )}
        </View>
        <View style={styles.dragHandle}>
          <ThemedText style={styles.dragHandleText}>⋮⋮</ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <DraggableList
        data={tasks}
        onDragEnd={handleDragEnd}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item._id}
        style={styles.tasksList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  tasksList: {
    flex: 0,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    marginVertical: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
  },
  activeTaskItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
  taskNotes: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 2,
    fontStyle: "italic",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    opacity: 0.6,
  },
  dragHandle: {
    padding: 8,
    marginLeft: 8,
  },
  dragHandleText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    fontWeight: "bold",
  },
});
