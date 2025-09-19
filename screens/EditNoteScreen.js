// screens/EditNoteScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Switch, Text } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function EditNoteScreen({ route, navigation }) {
  const { id, text, category, favorite } = route.params;
  const [newText, setNewText] = useState(text);
  const [newCategory, setNewCategory] = useState(category || "General");
  const [isFavorite, setIsFavorite] = useState(favorite ?? false);

  const handleUpdate = async () => {
    await updateDoc(doc(db, "notes", id), {
      text: newText,
      category: newCategory,
      favorite: isFavorite,
      updatedAt: new Date()
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={newText}
        onChangeText={setNewText}
        style={styles.input}
        placeholder="Edit note text"
      />
      <TextInput
        value={newCategory}
        onChangeText={setNewCategory}
        style={styles.input}
        placeholder="Edit category"
      />
      <View style={styles.switchRow}>
        <Text style={{ marginRight: 10 }}>Favorite:</Text>
        <Switch value={isFavorite} onValueChange={setIsFavorite} />
      </View>
      <Button title="Update Note" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  }
});
