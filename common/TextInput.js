import React from "react";
import { StyleSheet, TextInput as BaseTextInput } from "react-native";

export default class TextInput extends React.Component {
  input = null;

  render(){
    return (
      <BaseTextInput ref={component => this.input = component} {...this.props} style={{ ...styles.text, ...this.props.style }}>{this.props.children}</BaseTextInput>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "QuicksandSemiBold",
    fontWeight: "normal",
    color: "#5f5f5f",
    padding: 0,
    margin: 0,
    height: undefined
  }
});
