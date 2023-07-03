import React from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Text from '../../../common/Text';

export default function Tab(props){
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.tab}>
        <TouchableNativeFeedback delayPressIn={0} useForeground={true} onPress={() => navigation.navigate("_update_lead",{id: props.leadId})}>
          <View style={{
            ...styles.tabAction,
            ...(props.active === "update" ? styles.tabActionActive : {})
          }}>
            <Text
              style={{
                ...styles.tabLabel,
                ...(props.active === "update" ? styles.tabLabelActive : {})
              }}>
              Detail
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
      <View style={styles.tab}>
        <TouchableNativeFeedback delayPressIn={0} useForeground={true} onPress={() => navigation.navigate("lead_meeting",{id: props.leadId})}>
          <View style={{
            ...styles.tabAction,
            ...(props.active === "meeting" ? styles.tabActionActive : {})
          }}>
            <Text
              style={{
                ...styles.tabLabel,
                ...(props.active === "meeting" ? styles.tabLabelActive : {})
              }}>
              Meetings
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
