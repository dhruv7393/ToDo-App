import { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatGrid } from "react-native-super-grid";

const { width } = Dimensions.get("window");

// Array of strings to display above images
const visionTexts = [
  "Tane, mane, dhane, atmae, antar, kaame, family ane friends thi sukhi thavai",
  "Family Photos",
  "Friends Photos",
  "50 Acer nu farmland",
];

// Image data with names sorted alphabetically
const visionImages = [
  {
    id: "1",
    name: "001Swamiji",
    source: require("../../assets/vision/001Swamiji.jpeg"),
    height: 200,
    notes: ["Bhato kevad bramh ni murti"],
  },
  {
    id: "2",
    name: "002Prabodh_Swami",
    source: require("../../assets/vision/002Prabodh_Swami.jpeg"),
    height: 250,
    notes: [
      "Tamari Anuvritti ane Abhipray ma revai",
      "Bhajan karta karta tara baade ahobhave seva thai",
      "Atmiyata to che, Mithas na jai",
    ],
  },
  {
    id: "3",
    name: "Dhoni",
    source: require("../../assets/vision/Dhoni.jpeg"),
    height: 250,
    notes: [
      "Mithas na jai",
      "Sau mota che, sambandh vada che ane mare techique sikhi levi che",
    ],
  },
  {
    id: "4",
    name: "Sachin",
    source: require("../../assets/vision/Sachin.jpeg"),
    height: 250,
    notes: ["Mai khelega", "Nirantar swadyay"],
  },
  {
    id: "5",
    name: "Warren",
    source: require("../../assets/vision/warren.jpeg"),
    height: 250,
    notes: ["Financially independent - 1.5M 22%PF/A"],
  },
  {
    id: "6",
    name: "005 Looks",
    source: require("../../assets/vision/005 Looks.jpeg"),
    height: 190,
  },
  {
    id: "7",
    name: "006 Looks",
    source: require("../../assets/vision/006 Looks.jpeg"),
    height: 240,
  },
  {
    id: "8",
    name: "007 Looks",
    source: require("../../assets/vision/007 Looks.jpeg"),
    height: 210,
  },
  {
    id: "6",
    name: "003Bhutan",
    source: require("../../assets/vision/003Bhutan.jpeg"),
    height: 180,
  },
  {
    id: "7",
    name: "004RV",
    source: require("../../assets/vision/004RV.jpeg"),
    height: 220,
  },
  {
    id: "8",
    name: "Thought1",
    source: require("../../assets/vision/Thought1.jpeg"),
    height: 220,
  },
  {
    id: "9",
    name: "Thought2",
    source: require("../../assets/vision/Thought2.jpeg"),
    height: 220,
  },
];

export default function VisionScreen() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openImage = (item: any) => {
    setSelectedImage(item);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => openImage(item)}
    >
      <Image
        source={item.source}
        style={[styles.image, { width: "100%", height: item.height }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.textListContainer}>
      {visionTexts.map((text, index) => (
        <Text key={index} style={styles.visionText}>
          • {text}
        </Text>
      ))}
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/images/Nishan.jpeg")}
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <FlatGrid
            itemDimension={160} // Minimum item width
            data={visionImages}
            style={styles.grid}
            spacing={5}
            renderItem={renderItem}
            staticDimension={width}
            fixed={false}
            maxItemsPerRow={2}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
          />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImage}
      >
        <TouchableOpacity style={styles.modalContainer} onPress={closeImage}>
          <View style={styles.modalImageContainer}>
            {selectedImage && (
              <>
                <Image
                  source={selectedImage.source}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                {selectedImage.notes && selectedImage.notes.length > 0 && (
                  <View style={styles.notesContainer}>
                    {selectedImage.notes.map((note: string, index: number) => (
                      <Text key={index} style={styles.noteText}>
                        • {note}
                      </Text>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  content: {
    flex: 1,
    paddingTop: 50, // 30px + 20px for extra spacing
  },
  textListContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  visionText: {
    fontSize: 16,
    color: "#fff",
    paddingVertical: 5,
    fontWeight: "500",
  },
  grid: {
    flex: 1,
  },
  imageContainer: {
    margin: 5,
    backgroundColor: "transparent",
  },
  image: {
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImageContainer: {
    width: "90%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
  },
  notesContainer: {
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 20,
    maxHeight: "25%",
  },
  noteText: {
    fontSize: 16,
    color: "#fff",
    paddingVertical: 3,
    fontWeight: "400",
    lineHeight: 20,
  },
});
