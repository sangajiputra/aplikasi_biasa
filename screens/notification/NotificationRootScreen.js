import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import InboxScreen from "./InboxScreen";
import NotificationScreen from "./NotificationScreen";

const Stack = createStackNavigator();

export default class NotificationRootScreen extends React.Component {
  render(){
    return (
      <Stack.Navigator
        screenOptions={route => ({
          headerShown: false,
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 0
              }
            },
            close: {
              animation: "timing",
              config: {
                duration: 0
              }
            }
          }
        })}
      >
        <Stack.Screen name="notification.default" component={NotificationScreen} />
        <Stack.Screen name="notification.inbox" component={InboxScreen} />
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({});
