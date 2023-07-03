import React from "react";
import { Image, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Text from "../../../common/Text";

export default function Downline(props){
  const navigation = useNavigation();

  const review = () => {
    navigation.navigate("vital_sign_downline", { id: props.data.id });
  };

  return (
    <TouchableNativeFeedback onPress={() => review()} delayPressIn={0}>
      <View style={styles.container}>
        <Image style={styles.avatar} source={{uri: props.data.account.avatar_thumbnail_url}} />
        <View style={styles.meta}>
          <Text style={styles.name}>{props.data.name}</Text>
          <Text style={styles.rank}>{props.data.stage.name}</Text>
        </View>
        {
          props.data.is_need_review ?
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Review Needed</Text>
            </View> : null
        }
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    alignItems: "center"
  },
  avatar: {
    width: 50,
    height: undefined,
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 50
  },
  name: {
    fontSize: 16
  },
  meta: {
    flex: 1
  },
  badge: {
    backgroundColor: "#f2893d",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8
  },
  badgeText: {
    fontSize: 12,
    color: "#FFF"
  }
});
