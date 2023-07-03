import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ELearningCollectionScreen from "./ELearningCollectionScreen";
import ELearningListScreen from "./ELearningListScreen";

const Stack = createStackNavigator();

export default function ELearningScreen(props){
  return (
    <Stack.Navigator
      screenOptions={() => ({
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
      <Stack.Screen name="e_learning.browse" component={ELearningListScreen} />
      <Stack.Screen name="e_learning.collection" component={ELearningCollectionScreen} />
    </Stack.Navigator>
  );
}
