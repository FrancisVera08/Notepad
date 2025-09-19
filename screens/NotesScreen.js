import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Picker,
} from "react-native";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebaseConfig";

export default function NotesScreen({ navigation }) {
  // -------------------- STATE --------------------
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // Sort state
  const user = auth.currentUser;

  // -------------------- FIREBASE ACTIONS --------------------
  const fetchNotes = async () => {
    const snapshot = await getDocs(collection(db, "notes"));
    setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    fetchNotes();
  };

  const toggleFavorite = async (id, currentStatus) => {
    await updateDoc(doc(db, "notes", id), {
      favorite: !currentStatus,
      updatedAt: new Date(),
    });
    fetchNotes();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchNotes);
    return unsubscribe;
  }, [navigation]);

  // -------------------- SORTING --------------------
  const sortedNotes = notes.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt.seconds - a.createdAt.seconds; // Newest first
      case "oldest":
        return a.createdAt.seconds - b.createdAt.seconds; // Oldest first
      case "favorites":
        return b.favorite - a.favorite; // Favorite first
      default:
        return 0;
    }
  });

  // -------------------- FILTERING --------------------
  const filteredNotes = sortedNotes.filter(
    (note) =>
      note.text.toLowerCase().includes(search.toLowerCase()) ||
      (note.category &&
        note.category.toLowerCase().includes(search.toLowerCase()))
  );

  // -------------------- RENDER NOTE --------------------
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("EditNote", {
          id: item.id,
          text: item.text,
          category: item.category,
          favorite: item.favorite,
        })
      }
    >
      <View style={styles.note}>
        <View style={{ flex: 1 }}>
          <Text style={styles.noteText}>
            {item.favorite ? "⭐ " : ""}
            {item.text}
          </Text>
          <Text style={styles.category}>
            Category: {item.category || "General"}
          </Text>
          {item.updatedAt ? (
            <Text style={styles.timestamp}>
              Updated:{" "}
              {new Date(item.updatedAt.seconds * 1000).toLocaleString()}
            </Text>
          ) : item.createdAt ? (
            <Text style={styles.timestamp}>
              Created:{" "}
              {new Date(item.createdAt.seconds * 1000).toLocaleString()}
            </Text>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Button
            title={item.favorite ? "Unstar" : "Star"}
            onPress={() => toggleFavorite(item.id, item.favorite)}
          />
          <Button
            title="Delete"
            color="red"
            onPress={() => handleDelete(item.id)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  // -------------------- UI --------------------
  return (
    <View style={styles.container}>
      {user && <Text style={styles.welcome}>Welcome, {user.email}</Text>}

      <TextInput
        placeholder="Search notes..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {/* Sort Dropdown */}
      <Picker
        selectedValue={sortBy}
        style={styles.picker}
        onValueChange={(itemValue) => setSortBy(itemValue)}
      >
        <Picker.Item label="Sort by Newest" value="newest" />
        <Picker.Item label="Sort by Oldest" value="oldest" />
        <Picker.Item label="Sort by Favorites" value="favorites" />
      </Picker>

      <Button
        title="Add Note"
        onPress={() => navigation.navigate("AddNote")}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <View style={styles.logoutContainer}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  search: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 15,
  },
  note: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  noteText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "gray",
  },
  timestamp: {
    fontSize: 12,
    color: "darkgray",
  },
  actions: {
    justifyContent: "space-between",
    gap: 5,
  },
  logoutContainer: {
    marginTop: 20,
  },
});
