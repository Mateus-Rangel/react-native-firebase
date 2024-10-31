import React, { useState } from "react";
import { Text, View } from "react-native";
import { TextInput, Button, Icon } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { app, db } from "../../firebase/configFirebase";
import {
  signInWithEmailAndPassword,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

console.log(process.env.EXPO_PUBLIC_APIKEY)

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFooterLinkPress = () => {
    navigation.navigate("Registration");
  };

  const onLoginPress = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (response) => {
        const uid = response.user.uid;
        const usersRef = collection(db, "users");

        const q = query(usersRef, where("id", "==", uid));

        const docSnap = await getDocs(q);
        docSnap.forEach(async (doc) => {
          console.log(doc.id, " => ", doc.data());
          const user = doc.data();
          const jsonValue = JSON.stringify(user);
          await AsyncStorage.setItem("userAtual", jsonValue);
          console.log(jsonValue);
          navigation.navigate("HomeScreen");
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always">
        <View style={styles.logo}>
          <Icon
            source={require("../../../assets/logoOilGasSolutions.png")}
            size={200}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Button style={styles.button} onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </Button>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
