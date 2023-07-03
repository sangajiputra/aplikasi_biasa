import React from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../../common/Text";

export default function Tab(props){
  return (
    <View style={styles.container}>
      <View style={styles.tab}>
        <TouchableNativeFeedback delayPressIn={0} useForeground={true} onPress={() => props.navigation.navigate("e_learning.browse")}>
          <View style={{
            ...styles.tabAction,
            ...(props.active === "browse" ? styles.tabActionActive : {})
          }}>
            <Text
              style={{
                ...styles.tabLabel,
                ...(props.active === "browse" ? styles.tabLabelActive : {})
              }}>
              Browse
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
      <View style={styles.tab}>
        <TouchableNativeFeedback delayPressIn={0} useForeground={true} onPress={() => props.navigation.navigate("e_learning.collection")}>
          <View style={{
            ...styles.tabAction,
            ...(props.active === "collection" ? styles.tabActionActive : {})
          }}>
            <Text
              style={{
                ...styles.tabLabel,
                ...(props.active === "collection" ? styles.tabLabelActive : {})
              }}>
              My Collection
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    overflow: "hidden",
    paddingHorizontal: 20,
    elevation: 10
  },
  tab: {
    flex: 1
  },
  tabAction: {
    paddingVertical: 13,
    borderBottomWidth: 3,
    borderBottomColor: "transparent"
  },
  tabActionActive: {
    borderBottomColor: "#53a3ff"
  },
  tabLabel: {
    color: "#000",
    textAlign: "center",
    fontSize: 16
  },
  tabLabelActive: {
    color: "#53a3ff",
    fontWeight: "bold"
  }
});
