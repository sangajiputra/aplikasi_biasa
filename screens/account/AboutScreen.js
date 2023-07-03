import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Text from "../../common/Text";

export default class AboutScreen extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../../assets/apps-logo.png")} />

        <Text style={styles.text}>
          {
            `MyMOMENT merupakan salah satu aplikasi yang menjadi terobosan baru dari Momentlizer Academia untuk membantu Momentlizer dalam mengembangkan bisnis kapan saja dan dimana saja dari satu genggaman.
\nAplikasi ini di desain sesuai dengan kebutuhan Pebisnis Network yang Profesional, sehingga tidak hanya sangat  membantu tetapi juga bisa meningkatkan percepatan pertumbuhan Bisnis.`
          }
        </Text>
        <Text>
          Release Version 1.0.43
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 15,
    flex: 1,
    justifyContent: "center"
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30
  },
  logo: {
    aspectRatio: 1,
    width: 100,
    height: undefined,
    marginBottom: 30
  }
});
