import React from 'react';
import { Image,StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../../common/Text";
import {useNavigation} from '@react-navigation/native';

export default function EmptyGoal(props){
  const navigation = useNavigation();

  return (
    <View style={styles.empty}>
      <Image style={styles.emptyImage} source={require("../../../assets/dream.png")} />
      <Text style={styles.emptyText}>Have you ever have a dream or a goal? How many times those dream are just become a dream?</Text>
      <Text style={styles.emptySecondText}>Well, thats not your fault, maybe you are just less motivated or you just simply forgot. We are here to help you to keep track of your dreams and to motivate you to keep pursuing your dream</Text>

      <TouchableNativeFeedback onPress={() => navigation.navigate("update_goal")}>
        <View style={styles.emptyAction}>
          <Image source={require("../../../assets/icons/send.png")} style={styles.emptyActionIcon} />
          <Text style={styles.emptyActionText}>Let us help you!</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  emptyImage: {
    width: 300,
    height: undefined,
    aspectRatio: 1.73
  },
  emptyText: {
    maxWidth: 350,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 21,
    fontSize: 16,
    marginTop: 15,
    color: "#777"
  },
  emptySecondText: {
    maxWidth: 350,
    textAlign: "center",
    lineHeight: 21,
    fontSize: 16,
    color: "#777"
  },
  emptyAction: {
    marginTop: 35,
    paddingVertical: 13,
    paddingHorizontal: 30,
    backgroundColor: "#3498df",
    borderRadius: 5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  emptyActionText: {
    fontSize: 20,
    color: "#FFF",
    lineHeight: 20
  },
  emptyActionIcon: {
    marginRight: 10,
    width: 26,
    height: undefined,
    aspectRatio: 1
  }
});
