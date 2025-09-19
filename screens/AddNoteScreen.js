// screens/AddNoteScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, Image, StyleSheet, Alert } from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";

export default function AddNoteScreen({ navigation }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  // pick from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is needed to take photos.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (text.trim()) {
      await addDoc(collection(db, "notes"), { 
        text,
        category: category || "General",   // default if empty
        favorite: false,                   // default value
        createdAt: serverTimestamp(),      // firebase timestamp
        image: image || null,              // attach image if exists
      });
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter note"
        style={styles.input}
        value={text}
        onChangeText={setText}
      />
      <TextInput
        placeholder="Category (optional)"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />
      <Button title="Pick from Gallery" onPress={pickImage} />
      <Button title="Take a Photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <Button title="Save Note" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  preview: { width: "100%", height: 200, marginVertical: 10, borderRadius: 5 },
});
