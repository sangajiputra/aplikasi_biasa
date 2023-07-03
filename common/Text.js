import React from "react";
import { StyleSheet, Text as BaseText } from "react-native";

export default function Text(props){
  return (
    <BaseText {...props} style={{ ...styles.text,...props.style  }}>{props.children}</BaseText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "QuicksandSemiBold",
    fontSize: 14,
    color: '#5f5f5f',
  }
});
