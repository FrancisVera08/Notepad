// screens/NotesScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebaseConfig";

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const user = auth.currentUser; // get the logged-in user

  const fetchNotes = async () => {
    const snapshot = await getDocs(collection(db, "notes"));
    setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    fetchNotes();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); // go back to login screen
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchNotes);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("EditNote", {
          id: item.id,
          text: item.text,
          category: item.category,
          favorite: item.favorite
        })
      }
    >
      <View style={styles.note}>
        <View style={{ flex: 1 }}>
          <Text style={styles.noteText}>
            {item.favorite ? "⭐ " : ""}{item.text}
          </Text>
          <Text style={styles.category}>
            Category: {item.category || "General"}
          </Text>
          {item.updatedAt ? (
            <Text style={styles.timestamp}>
              Updated: {new Date(item.updatedAt.seconds * 1000).toLocaleString()}
            </Text>
          ) : item.createdAt ? (
            <Text style={styles.timestamp}>
              Created: {new Date(item.createdAt.seconds * 1000).toLocaleString()}
            </Text>
          ) : null}
        </View>
        <Button title="Delete" onPress={() => handleDelete(item.id)} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {user && (
        <Text style={styles.welcome}>Welcome, {user.email}</Text>
      )}

      <Button title="Add Note" onPress={() => navigation.navigate("AddNote")} />

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  welcome: { fontSize: 16, marginBottom: 10, fontWeight: "600", textAlign: "center" },
  note: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5
  },
  noteText: { fontSize: 16, fontWeight: "bold" },
  category: { fontSize: 14, color: "gray" },
  timestamp: { fontSize: 12, color: "darkgray" }
});
