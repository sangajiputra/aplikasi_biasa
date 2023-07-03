import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import IndicatorsScreen from "./IndicatorsScreen";
import DownlinesScreen from "./DownlinesScreen";

const Stack = createStackNavigator();

export default function VitalSignScreen(){
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
      <Stack.Screen name="vital_sign_indicator" component={IndicatorsScreen} />
      <Stack.Screen name="vital_sign_review" component={DownlinesScreen} />
    </Stack.Navigator>
  );
}
