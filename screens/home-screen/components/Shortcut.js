import React from "react";
import { Image, Linking, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Text from "../../../common/Text";

export default function Shortcut(props){
  const navigation = useNavigation();

  function go(){
    if (props.nav === "report") {
      Linking.openURL("https://moment2u.com/loginMember.do");
    } else {
      navigation.navigate(props.nav);
    }
  }

  return (
    <View style={styles.navigation}>
      <TouchableNativeFeedback delayPressIn={0}
                               useForeground={true}
                               onPress={() => go()}
      >
        <View style={styles.navigationWrapper}>
          <Image resizeMode="contain" fadeDuration={0} style={styles.navigationIcon} source={props.icon} />
          <Text style={styles.navigationText}>{props.title}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: {
    width: "25%",
    flexGrow: 0,
    justifyContent: "center"
  },
  navigationIcon: {
    width: 65,
    height: 65,
    marginLeft: 5
  },
  navigationText: {
    textAlign: "center"
  },
  navigationWrapper: {
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10
  }
});
