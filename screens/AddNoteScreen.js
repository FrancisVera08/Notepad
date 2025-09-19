// screens/AddNoteScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function AddNoteScreen({ navigation }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");

  const handleAdd = async () => {
    if (text.trim()) {
      await addDoc(collection(db, "notes"), { 
        text,
        category: category || "General",   // default if empty
        favorite: false,                   // default value
        createdAt: serverTimestamp(),      // firebase timestamp
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
      <Button title="Save Note" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
