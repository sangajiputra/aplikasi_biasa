import React from "react";
import TransparentHeader from "../../common/TransparentHeader";
import EventDetailScreen from "./EventDetailScreen";
import { createStackNavigator } from "@react-navigation/stack";
import EventForm from "./EventForm";
import StackScreenRightToLeftAnimation from "../animation/ModalAnimation";
import EventListScreen from "./EventListScreen";

const Stack = createStackNavigator();

export default function EventStackScreen(){
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
      <Stack.Screen name="event"
                    component={EventListScreen}
                    options={{ headerShown: false }}
      />
      <Stack.Screen name="event_detail"
                    options={{
                      headerTitle: "Event",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={EventDetailScreen}
      />
      <Stack.Screen name="add_event"
                    options={{
                      headerTitle: "Add Event",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={EventForm}
      />
    </Stack.Navigator>
  );
}
