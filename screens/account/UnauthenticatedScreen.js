import React from "react";
import { Image, ImageBackground, KeyboardAvoidingView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import Text from "../../common/Text";
import RegisterScreen from "./RegisterScreen";

const Stack = createStackNavigator();

function UnauthenticatedDefaultScreen(props){

  return (

    <View style={styles.container}>
      <ImageBackground style={styles.background} source={require("../../assets/bg/unauthenticated.jpg")}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../../assets/logo-invert.png")} resizeMode="contain" />
        </View>
        <View style={styles.actions}>
          <TouchableNativeFeedback delayPressIn={0} onPress={() => props.navigation.navigate("login")} useForeGround={true}>
            <View style={{ ...styles.loginButton, ...styles.button }}>
              <Text style={{ ...styles.buttonText, ...styles.loginButtonText }}>LOG IN</Text>
            </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback delayPressIn={0} onPress={() => props.navigation.navigate("register")} useForeGround={true}>
            <View style={{ ...styles.registerButton, ...styles.button }}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </ImageBackground>
    </View>
  );
}

export default function UnauthenticatedScreen(){
  return (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>

      <Stack.Navigator>
        <Stack.Screen name="unauthenticated_default_screen"
                      component={UnauthenticatedDefaultScreen}
                      options={{ headerShown: false }}
        />
        <Stack.Screen name="login"
                      component={LoginScreen}
                      options={{ headerShown: false }}

        />
        <Stack.Screen name="register"
                      component={RegisterScreen}
                      options={{ headerShown: false }}

        />
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {},
  button: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: "#FFF",
    marginBottom: 15,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "#FFF"
  },
  loginButton: {
    backgroundColor: "#FFF"
  },
  loginButtonText: {
    color: "#3dd0c4"
  },
  registerButton: {},
  background: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center"
  },
  actions: {
    width: "100%",
    paddingBottom: 50,
    paddingHorizontal: 30
  },
  logo: {
    width: 330,
    height: undefined,
    aspectRatio: 4.15282392027
  },
  logoContainer: {
    height: "100%",
    flexShrink: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
