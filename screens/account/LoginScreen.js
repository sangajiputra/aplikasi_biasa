import React, { Fragment } from "react";
import { ActivityIndicator, Image, Keyboard, ScrollView, StyleSheet, ToastAndroid, TouchableNativeFeedback, View } from "react-native";
import { login, logout } from "../../states/actionCreators";
import { connect } from "react-redux";
import Text from "../../common/Text";
import TextInput from "../../common/TextInput";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-community/async-storage";
import messaging from "@react-native-firebase/messaging";
import axios from 'axios';
export function LoginScreen(props){
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [keyboardShow, setKeyboardShow] = React.useState(false);
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);

  React.useEffect(() => {
    const onKeyBoardShow = () => {
      setKeyboardShow(true);
    };

    const onKeyBoardHide = () => {
      setKeyboardShow(false);
    };

    Keyboard.addListener("keyboardDidShow", onKeyBoardShow);
    Keyboard.addListener("keyboardDidHide", onKeyBoardHide);

    return () => {
      Keyboard.removeListener("keyboardDidShow", onKeyBoardShow);
      Keyboard.removeListener("keyboardDidHide", onKeyBoardHide);
    };
  }, []);

  const submitLoginForm = async () => {
    if (!submitting) {
      setSubmitting(true);

      const fcmToken = await messaging().getToken();

      props.login(username, password, fcmToken).then(async result => {
        if (result.error) {
          ToastAndroid.show("Your password or username is invalid", 20000);
        }

        if (result.payload && result.payload.data.success) {
          await auth().signInWithEmailAndPassword(result.payload.data.data.email, password);

          const token = await auth().currentUser.getIdTokenResult();

          if (token) {
            AsyncStorage.setItem("firebaseToken", JSON.stringify(token));
          } else {
            this.props.logout();
          }
        }
      }).finally(result => {
        setSubmitting(false);
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image style={styles.headerBackground} source={require("../../assets/bg/unauthenticated-header.png")} />

      <View style={styles.content}>
        {!keyboardShow && <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../../assets/logo.png")} />
        </View>}

        <View style={styles.text}>
          <Text style={styles.loginText}>Login</Text>
          <Text style={styles.greetingText}>Hello there!</Text>
          <Text style={styles.secondaryGreetingText}>Welcome back</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Username</Text>
            <TextInput onChangeText={(value) => setUsername(value)} value={username} placeholder="Enter your username here..." style={styles.formControl} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput secureTextEntry={!passwordVisibility} textContentType={passwordVisibility ? "none" : "password"} onChangeText={(value) => setPassword(value)} value={password} placeholder="Enter your password here..." style={styles.formControl} />
              <TouchableNativeFeedback onPress={() => setPasswordVisibility(!passwordVisibility)}>
                <Image style={styles.passwordVisibility} source={require("../../assets/icons/visibility.png")} />
              </TouchableNativeFeedback>
            </View>
          </View>

          <TouchableNativeFeedback delayPressIn={0} disabled={submitting} onPress={() => submitLoginForm()} useForeground={true}>
            <View style={styles.formSubmit}>
              {
                submitting ?
                  <ActivityIndicator size={24} color="#FFF" /> :
                  <Fragment>
                    <Image style={styles.formSubmitIcon} source={require("../../assets/icons/send.png")} />
                    <Text style={styles.formSubmitText}>LOG IN</Text>
                  </Fragment>
              }
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </ScrollView>
  );
}

const mapDispatcherToProps = {
  login,
  logout
};

export default connect(null, mapDispatcherToProps)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBackground: {
    width: "100%",
    height: undefined,
    aspectRatio: 4.09378531073
  },
  logo: {
    width: 330,
    height: undefined,
    aspectRatio: 4.15282392027
  },
  loginText: {
    color: "#5edff4",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20
  },
  greetingText: {
    fontSize: 30,
    fontWeight: "bold"
  },
  secondaryGreetingText: {
    fontSize: 24
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flexShrink: 1
  },
  content: {
    paddingHorizontal: 25,
    paddingBottom: 50,
    flex: 1
  },
  form: {
    marginTop: 20
  },
  formGroup: {
    marginBottom: 20
  },
  formControl: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 5,
    fontSize: 16
  },
  formLabel: {
    fontSize: 11
  },
  formSubmit: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#5edff4",
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -100
    },
    shadowOpacity: 0.8,
    shadowRadius: 9,

    elevation: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  formSubmitText: {
    fontSize: 20,
    textAlign: "center",
    color: "#FFF"
  },
  formSubmitIcon: {
    width: 24,
    height: undefined,
    aspectRatio: 1,
    marginRight: 10
  },
  passwordContainer: {
    position: "relative"
  },
  passwordVisibility: {
    width: 28,
    height: undefined,
    aspectRatio: 1,
    position: "absolute",
    top: 4,
    right: 0
  }
});
