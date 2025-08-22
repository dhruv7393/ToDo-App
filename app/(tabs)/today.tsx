import { ThemedText } from "@/components/ThemedText";
import getAllCategories, { CategoryData } from "@/helpers/getAllCategories";
import React, { useEffect } from "react";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";

export default function TodayScreen() {
  const [categories, setCategories] = React.useState<CategoryData[]>([]);
  const [error, setError] = React.useState<string | null>(null);

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
                <View key={index} style={styles.categoryBox}>
                  <ThemedText type="default" style={styles.categoryText}>
                    {category.name}
                  </ThemedText>
                </View>
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
