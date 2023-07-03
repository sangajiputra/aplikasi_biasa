import React from "react";
import { Image, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient/build/index";
import { useNavigation } from "@react-navigation/native";
import Text from "../../../common/Text";
import moment from "moment";

export default function NewsItem(props){
  const navigation = useNavigation();

  return (
    <TouchableNativeFeedback delayPressIn={0} onPress={() => {navigation.navigate("news_detail", { "id": props.data.id });}} useForeground={true}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: props.data.picture_url }} />
        <LinearGradient
          style={styles.caption}
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}>

          <Text style={styles.date}>{moment(props.data.created_at * 1000).format("dddd, DD MMMM YYYY")}</Text>
          <Text style={styles.title}>{props.data.title}</Text>

        </LinearGradient>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 2
  },
  caption: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    paddingTop: 40
  },
  title: {
    color: "#FFF",
    fontSize: 16
  },
  date: {
    fontSize: 11,
    color: "#FFF",
    fontStyle: "italic"
  }
});
