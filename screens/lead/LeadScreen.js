import TransparentHeader from "../../common/TransparentHeader";
import StackScreenRightToLeftAnimation from "../animation/ModalAnimation";
import UpdateLeadScreen from "./UpdateLeadScreen";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LeadListScreen from "./LeadListScreen";
import ViewLeadScreen from "./ViewLeadScreen";
import EventForm from "../event/EventForm";

const Stack = createStackNavigator();

export default function LeadScreen(){
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
      <Stack.Screen name="lead"
                    component={LeadListScreen}
                    options={{ headerShown: false }}
      />
      <Stack.Screen name="update_lead"
                    options={{
                      headerTitle: "Update Lead",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={UpdateLeadScreen}

      />
      <Stack.Screen name="view_lead"
                    options={{
                      headerTitle: "View Lead",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ViewLeadScreen}

      />
      <Stack.Screen name="add_meeting"
                    options={{
                      headerTitle: "Add Meeting",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={EventForm}

      />
    </Stack.Navigator>
  );
}
