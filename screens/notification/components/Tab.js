import React from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Text from "../../../common/Text";
import { connect } from "react-redux";

export function Tab(props){
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.tab}>
        <TouchableNativeFeedback style={styles.touchable} delayPressIn={0} useForeground={true} onPress={() => navigation.navigate("notification.default")}>
          <View style={{
            ...styles.tabAction,
            ...(props.active === "default" ? styles.tabActionActive : {})
          }}>
            <Text
              style={{
                ...styles.tabLabel,
                ...(props.active === "default" ? styles.tabLabelActive : {})
              }}>
              Notification
            </Text>

            {props.unseen_count.notification > 0 && <Text style={styles.badge}>{props.unseen_count.notification}</Text>}
          </View>
        </TouchableNativeFeedback>
      </View>


      <View style={styles.tab}>
        <TouchableNativeFeedback style={styles.touchable} delayPressIn={0} useForeground={true} onPress={() => navigation.navigate("notification.inbox")}>
          <View style={{
            ...styles.tabAction,
            ...(props.active === "inbox" ? styles.tabActionActive : {})
          }}>
            <Text
              style={{
                ...styles.tabLabel,
                ...(props.active === "inbox" ? styles.tabLabelActive : {})
              }}>
              Inbox
            </Text>

            {props.unseen_count.inbox > 0 && <Text style={styles.badge}>{props.unseen_count.inbox}</Text>}
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

const mapStateToProps = state => ({
  unseen_count: state.notification.unseen_count
});

export default connect(mapStateToProps, null)(Tab);

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
    borderBottomColor: "transparent",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
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
  },
  badge: {
    backgroundColor: "#FF0000",
    borderRadius: 20,
    minWidth: 20,
    textAlign: "center",
    height: 20,
    color: '#FFF',
    marginLeft: 5
  },
  touchable: {
    flex: 1
  }
});
