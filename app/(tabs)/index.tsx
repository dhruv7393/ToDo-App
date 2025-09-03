import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";

export default function TodayScreen() {
  // Simplified version for testing
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <ThemedText type="default" style={styles.message}>
            App is working! Testing crash fix...
          </ThemedText>
        </View>
      </View>
    </View>
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
