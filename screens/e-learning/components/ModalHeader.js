import React from "react";
import { Image, ImageBackground, ScrollView, StatusBar, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import CartIcon from "./CartIcon";
import { useNavigation } from "@react-navigation/native";
import Text from '../../../common/Text';

export default function ModalHeader(props){
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{ width: "100%" }}
        source={require("../../../assets/bg/header.png")}
        imageStyle={{
          height: 400,
          width: "100%",
          resizeMode: "contain",
          top: (StatusBar.currentHeight + 10) * -1
        }}
      >
      </ImageBackground>
      <View style={styles.headerContainer}>
        <TouchableNativeFeedback onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require("../../../assets/icons/back.png")} />
        </TouchableNativeFeedback>

        <Text style={styles.title}>{props.title}</Text>

        {props.showIcon !== false ? <CartIcon /> : null}
      </View>

      <View style={{ ...styles.body, ...props.containerStyle }}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  body: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 6,
    flex: 1,
    flexDirection: "column"
  },
  headerContainer: {
    paddingTop: StatusBar.currentHeight + 14,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 14,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    flexShrink: 1,
    color: "#FFF",
    fontFamily: 'Quicksand'
  },
  backIcon: {
    aspectRatio: 1,
    width: 20,
    height: undefined,
    marginRight: 15,
    marginLeft: -10,
    tintColor: '#FFF'
  }
});
