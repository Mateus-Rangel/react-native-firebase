import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  HistoryScreen,
} from "./src/screens";
import { decode, encode } from "base-64";
import { PaperProvider } from "react-native-paper";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("userAtual");
    const parsedValue = JSON.parse(jsonValue);
    console.log("parsed value: " + parsedValue.fullName);
    return jsonValue != null ? parsedValue : null;
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

export default function App({navigation}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      getUser().then((user) => {
        console.log(user);
        setUser(user);
      });
    }
    fetchUser();
  }, []);


  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user ? "HomeScreen" : "Login"}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
