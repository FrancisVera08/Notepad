// screens/LoginScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setError("");
        navigation.replace("Notes");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>

      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Don’t have an account? <Text style={styles.linkHighlight}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 5, textAlign: "center" },
  subtitle: { fontSize: 16, color: "gray", marginBottom: 20, textAlign: "center" },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 12, 
    marginVertical: 8, 
    borderRadius: 8, 
    backgroundColor: "#fff" 
  },
  buttonContainer: { marginVertical: 10 },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  link: { marginTop: 20, color: "gray", textAlign: "center" },
  linkHighlight: { color: "blue", fontWeight: "bold" }
});
