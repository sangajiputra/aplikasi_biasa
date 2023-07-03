import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

export default class ChatImageScreen extends React.Component {
  state = {
    visible: true
  };
  backHandler = null;

  componentWillUnmount(){
    this.setState({ visible: false });
  }

  render(){
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {}
});
