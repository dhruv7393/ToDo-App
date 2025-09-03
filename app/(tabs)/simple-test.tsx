import { StyleSheet, Text, View } from "react-native";

export default function SimpleTestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Simple Test Screen</Text>
      <Text style={styles.text}>If you see this, the app is working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
});
