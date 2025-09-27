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

// Image data with names sorted alphabetically
const visionImages = [
  {
    id: "1",
    name: "001Swamiji",
    source: require("../../assets/vision/001Swamiji.jpeg"),
    height: 220,
    notes: [
      "Bhato kevad bramh ni murti",
      "Tane, mane, dhane, atmae, antar, kaame, family ane friends thi sukhi thavai",
      "Nirbhayta, Nischinta and Shubvichar",
    ],
  },
  {
    id: "2",
    name: "002Prabodh_Swami",
    source: require("../../assets/vision/002Prabodh_Swami.jpeg"),
    height: 220,
    notes: [
      "Tamari Anuvritti ane Abhipray ma revai",
      "Bhajan karta karta tamara baade ahobhave seva thai",
      "Atmiyata to che, Mithas na jai",
      "Sau khub mota che, sambandh vada che ane mare techique sikhi levi che",
    ],
  },
  {
    id: "3",
    name: "Dhoni",
    source: require("../../assets/vision/Dhoni.jpeg"),
    height: 220,
    notes: [
      "Mithas na jai",
      "Sau mota che, sambandh vada che ane mare techique sikhi levi che",
    ],
  },
  {
    id: "4",
    name: "Sachin",
    source: require("../../assets/vision/Sachin.jpeg"),
    height: 220,
    notes: ["Mai khelega", "Nirantar swadyay"],
  },
  {
    id: "5",
    name: "Warren",
    source: require("../../assets/vision/warren.jpeg"),
    height: 220,
    notes: ["Financially independent - 1.5M 750K Investment 22%PF/A"],
  },
  {
    id: "4",
    name: "004mind",
    source: require("../../assets/vision/004mind.jpeg"),
    height: 220,
  },
  {
    id: "6",
    name: "005 Looks",
    source: require("../../assets/vision/005 Looks.jpeg"),
    height: 220,
  },
  {
    id: "7",
    name: "006 Looks",
    source: require("../../assets/vision/006 Looks.jpeg"),
    height: 220,
  },
  {
    id: "8",
    name: "007 Looks",
    source: require("../../assets/vision/007 Looks.jpeg"),
    height: 220,
  },

  {
    id: "7",
    name: "Home1",
    source: require("../../assets/vision/Home1.jpeg"),
    height: 220,
  },
  {
    id: "8",
    name: "Home2",
    source: require("../../assets/vision/Home2.jpeg"),
    height: 220,
  },
  {
    id: "8",
    name: "Home3",
    source: require("../../assets/vision/Home3.jpeg"),
    height: 220,
  },
  {
    id: "7",
    name: "Farm1",
    source: require("../../assets/vision/Farm1.jpeg"),
    height: 220,
    notes: ["50 Acers nu farmland"],
  },
  {
    id: "8",
    name: "Farm2",
    source: require("../../assets/vision/Farm2.jpeg"),
    height: 220,
  },
  {
    id: "8",
    name: "Farm3",
    source: require("../../assets/vision/Farm3.jpeg"),
    height: 220,
  },
  {
    id: "7",
    name: "Work3",
    source: require("../../assets/vision/Work3.jpeg"),
    height: 220,
  },
  {
    id: "8",
    name: "Work2",
    source: require("../../assets/vision/Work2.jpeg"),
    height: 220,
  },
  {
    id: "8",
    name: "Work1",
    source: require("../../assets/vision/Work1.jpeg"),
    height: 220,
  },
  {
    id: "6",
    name: "003Bhutan",
    source: require("../../assets/vision/003Bhutan.jpeg"),
    height: 220,
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
    notes: [
      "O Heavenly Father, make me better. Change my attitude, my approach, my mind and my reactions.",
      "Heavenly Father, if I'm chasing the wrong things, please redirect me.",
      "Dear God, please bring me closer to what's meant for me.",
      "O Heavenly Father, please make my days useful, my night restful, my home peaceful and my efforts fruitful.",
    ],
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
