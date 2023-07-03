import React from "react";
import { Image, Linking, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TransparentHeader from "../../common/TransparentHeader";
import ChangePasswordScreen from "./ChangePasswordScreen";
import ProfileScreen from "./ProfileScreen";
import { connect } from "react-redux";
import { logout } from "../../states/actionCreators";
import StackScreenRightToLeftAnimation from "../animation/ModalAnimation";
import Text from "../../common/Text";
import Header from "./components/Header";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-community/async-storage";
import ELearningOrderScreen from "../e-learning/ELearningOrderScreen";
import ELearningOrderDetailScreen from "../e-learning/ELearningOrderDetailScreen";
import AboutScreen from "./AboutScreen";
import RefundPolicyScreen from "./RefundPolicyScreen";

const Stack = createStackNavigator();

export default function AccountStackScreen(){
  const _headerElement = ({ scene, previous, navigation }) => {
    return (
      <TransparentHeader
        previous={previous}
        navigation={navigation}
        scene={scene}
      />
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="account"
                    component={AccountScreen}
                    options={{ headerShown: false }}
      />
      <Stack.Screen name="change_password"
                    options={{
                      headerTitle: "Change Password",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ChangePasswordScreen}

      />
      <Stack.Screen name="order"
                    options={{
                      headerTitle: "Order",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ELearningOrderScreen}

      />
      <Stack.Screen name="about-app"
                    options={{
                      headerTitle: "About MyMOMENT",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={AboutScreen}

      />
      <Stack.Screen name="order_detail"
                    options={{
                      headerTitle: "Order Detail",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ELearningOrderDetailScreen}

      />
      <Stack.Screen name="profile"
                    options={{
                      headerTitle: "Profile",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ProfileScreen}

      />
      <Stack.Screen name="refund"
                    options={{
                      headerTitle: "Refund Policy",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={RefundPolicyScreen}

      />
    </Stack.Navigator>
  );
}

export function _AccountScreen(props){
  const navigation = useNavigation();

  const logout = async () => {
    auth().signOut();

    AsyncStorage.removeItem("firebaseToken");

    props.logout();
  };

  return (
    <ScrollView style={styles.container}>
      <Header user={props.user} />
      <View style={styles.content}>
        <TouchableNativeFeedback delayPressIn={0} onPress={() => navigation.navigate("profile")}>
          <View style={styles.menuItem}>
            <Image style={styles.menuItemIcon} source={require("../../assets/icons/profile.png")} />
            <Text style={styles.menuItemText}>Profile</Text>
            <Image style={styles.menuItemMoreIcon} source={require("../../assets/icons/chevron-right-black.png")} />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback delayPressIn={0} onPress={() => navigation.navigate("change_password")}>
          <View style={styles.menuItem}>
            <Image style={styles.menuItemIcon} source={require("../../assets/icons/password.png")} />
            <Text style={styles.menuItemText}>Change Password</Text>
            <Image style={styles.menuItemMoreIcon} source={require("../../assets/icons/chevron-right-black.png")} />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback delayPressIn={0} onPress={() => navigation.navigate("order")}>
          <View style={styles.menuItem}>
            <Image style={styles.menuItemIcon} source={require("../../assets/icons/shopping-cart.png")} />
            <Text style={styles.menuItemText}>Order History</Text>
            <Image style={styles.menuItemMoreIcon} source={require("../../assets/icons/chevron-right-black.png")} />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback delayPressIn={0} onPress={() => Linking.openURL("https://momentsupport.net/app-privacy-policy/")}>
          <View style={styles.menuItem}>
            <Image style={styles.menuItemIcon} source={require("../../assets/icons/privacy.png")} />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Image style={styles.menuItemMoreIcon} source={require("../../assets/icons/chevron-right-black.png")} />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback delayPressIn={0} onPress={() => navigation.navigate("refund")}>
          <View style={styles.menuItem}>
            <Image style={styles.menuItemIcon} source={require("../../assets/icons/refund.png")} />
            <Text style={styles.menuItemText}>Refund Policy</Text>
            <Image style={styles.menuItemMoreIcon} source={require("../../assets/icons/chevron-right-black.png")} />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback delayPressIn={0} onPress={() => navigation.navigate("about-app")}>
          <View style={styles.menuItem}>
            <Image style={styles.menuItemIcon} source={require("../../assets/icons/information.png")} />
            <Text style={styles.menuItemText}>About Apps</Text>
            <Image style={styles.menuItemMoreIcon} source={require("../../assets/icons/chevron-right-black.png")} />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback delayPressIn={0} onPress={() => logout()}>
          <View style={styles.menuItem}>
            <Image style={styles.menuItemIcon} source={require("../../assets/icons/logout.png")} />
            <Text style={{ ...styles.menuItemText, color: "#FB5252" }}>Logout</Text>
            <Image style={styles.menuItemMoreIcon} source={require("../../assets/icons/chevron-right-black.png")} />
          </View>
        </TouchableNativeFeedback>
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  logout
};

const AccountScreen = connect(mapStateToProps, mapDispatchToProps)(_AccountScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },

  content: {
    paddingLeft: 15,
    paddingRight: 15
  },
  menuItem: {
    paddingTop: 17,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    flexDirection: "row",
    alignItems: "center"
  },
  menuItemMoreIcon: {
    aspectRatio: 1,
    width: 20,
    height: undefined
  },
  menuItemIcon: {
    aspectRatio: 1,
    width: 20,
    height: undefined,
    marginRight: 10
  },
  menuItemText: {
    width: "100%",
    flexShrink: 1
  }
});
