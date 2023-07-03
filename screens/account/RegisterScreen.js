import React, { Fragment } from "react";
import { ActivityIndicator, Image, LayoutAnimation, ScrollView, StyleSheet, ToastAndroid, TouchableNativeFeedback, View } from "react-native";
import Text from "../../common/Text";
import TextInput from "../../common/TextInput";
import axios from "axios/index";
import config from "../../config";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen(props){
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [upline, setUpline] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [identification, setIdenfication] = React.useState("");
  const [passwordRepeat, setPasswordRepeat] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const navigation = useNavigation();

  const save = () => {
    const qs = require("qs");

    setIsLoading(true);

    return axios.post("/moment/member/register", qs.stringify({
      name,
      email,
      password,
      phone,
      username,
      identification,
      password_repeat: passwordRepeat,
      upline_name: upline
    }), {
      baseURL: config.baseUrl
    }).then(result => {

      if (result.error) {
      } else if (result.data.success) {

        ToastAndroid.show("You\'ve been registered, you'll be notified when your account is verified", 20000);

        // ToastAndroid.showWithGravityAndOffset(
        //   "You\'ve been registered, you'll be notified when your account is verified",
        //   ToastAndroid.LONG,
        //   ToastAndroid.BOTTOM,
        //   25,
        //   50
        // );

        navigation.replace("login");
      }
    }).catch((error) => {
      let _errors = {};

      if (error.response?.data.type === "raw") {
        error.response.data.data.forEach(field => {
          _errors[field.field] = field.message;
        });

        ToastAndroid.show("Some data is invalid", 20000);
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setErrors(_errors);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return <View style={styles.container}>
    <Image style={styles.headerBackground} source={require("../../assets/bg/unauthenticated-header.png")} />

    <View style={styles.logoContainer}>
      <Image style={styles.logo} source={require("../../assets/logo.png")} />
    </View>

    <View style={styles.form}>
      <ScrollView>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput onChangeText={(value) => setName(value)} value={name} placeholder="Enter your name" style={styles.formControl} />
          {errors.name && <Text style={styles.validation}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Username</Text>
          <TextInput onChangeText={(value) => setUsername(value)} value={username} placeholder="Enter your username" style={styles.formControl} />
          {errors.username && <Text style={styles.validation}>{errors.username}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Moment ID</Text>
          <TextInput maxLength={7} onChangeText={(value) => setIdenfication(value)} value={identification} placeholder="Enter User ID" style={styles.formControl} />
          {errors.identification && <Text style={styles.validation}>{errors.identification}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Email</Text>
          <TextInput onChangeText={(value) => setEmail(value)} value={email} placeholder="Enter your email" style={styles.formControl} />
          {errors.email && <Text style={styles.validation}>{errors.email}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Phone</Text>
          <TextInput onChangeText={(value) => setPhone(value)} value={phone} placeholder="Enter your phone number" style={styles.formControl} />
          {errors.phone && <Text style={styles.validation}>{errors.phone}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Sponsor ID</Text>
          <TextInput onChangeText={(value) => setUpline(value)} value={upline} placeholder="Enter your upline" style={styles.formControl} />
          {errors.upline_name && <Text style={styles.validation}>{errors.upline_name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Password</Text>
          <TextInput secureTextEntry={true} textContentType="password" onChangeText={(value) => setPassword(value)} value={password} placeholder="Enter your password" style={styles.formControl} />
          {errors.password && <Text style={styles.validation}>{errors.password}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Confirm</Text>
          <TextInput secureTextEntry={true} textContentType="password" onChangeText={(value) => setPasswordRepeat(value)} value={passwordRepeat} placeholder="Retype your password." style={styles.formControl} />
          {errors.password_repeat && <Text style={styles.validation}>{errors.password_repeat}</Text>}
        </View>
      </ScrollView>
    </View>


    <View style={styles.action}>
      <TouchableNativeFeedback disabled={isLoading} onPress={() => save()}>
        <View style={styles.saveButton}>
          {isLoading ? <ActivityIndicator color="#FFF" size={26} /> : <Fragment>
            <Image source={require("../../assets/icons/send.png")} style={styles.saveButtonIcon} />
            <Text style={styles.saveButtonText}>Register Now</Text>
          </Fragment>
          }
        </View>
      </TouchableNativeFeedback>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBackground: {
    width: "100%",
    height: undefined,
    aspectRatio: 4.09378531073
  },
  form: {
    marginTop: 20,
    flex: 1
  },
  formGroup: {
    backgroundColor: "#FFF",
    marginBottom: 10,
    elevation: 3,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingBottom: 15
  },
  formControl: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 16
  },
  validation: {
    paddingHorizontal: 15,
    color: "#d55a46"
  },
  formLabel: {
    fontSize: 11,
    paddingHorizontal: 15,
    paddingTop: 10
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: -20
  },
  logo: {
    width: 270,
    height: undefined,
    aspectRatio: 4.15282392027
  }, action: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#FFF"
  },
  saveButton: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    backgroundColor: "#5edff4",
    borderRadius: 5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  saveButtonText: {
    fontSize: 20,
    color: "#FFF",
    lineHeight: 20
  },
  saveButtonIcon: {
    marginRight: 10,
    width: 26,
    height: undefined,
    aspectRatio: 1
  }
});
