import React from "react";
import TransparentHeader from "../../common/TransparentHeader";
import { createStackNavigator } from "@react-navigation/stack";
import StackScreenRightToLeftAnimation from "../animation/ModalAnimation";
import ChatMessageScreen from "./ChatMessageScreen";
import ChatListScreen from "./ChatListScreen";
import ChatMemberForm from "./ChatMemberForm";
import ChatForm from "./ChatForm";
import ChatMessageHeader from "./components/ChatMeassageHeader";
import ChatDetailScreen from "./ChatDetailSceen";
import { ChatInviteScreen } from "./ChatInviteScreen";
import ChatImageScreen from "./ChatImageScreen";

const Stack = createStackNavigator();

export default function ChatSreen(){
  const _headerElement = ({ scene, previous, navigation }) => {
    return (
      <TransparentHeader
        previous={previous}
        navigation={navigation}
        scene={scene}
      />
    );
  };

  const _chatHeaderElement = ({ scene, previous, navigation }) => {
    return (
      <ChatMessageHeader
        previous={previous}
        navigation={navigation}
        scene={scene}
      />
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="chat"
                    component={ChatListScreen}
                    options={{ headerShown: false }}
      />
      <Stack.Screen name="chat_message"
                    options={{
                      headerTitle: "Messages",
                      header: _chatHeaderElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ChatMessageScreen}
      />
      <Stack.Screen name="create_chat.members"
                    options={{
                      headerTitle: "Select Chat Member",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ChatMemberForm}
      />
      <Stack.Screen name="create_chat.form"
                    options={{
                      headerTitle: "Group Detail",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ChatForm}
      />
      <Stack.Screen name="chat_detail"
                    options={{
                      headerTitle: "",
                      headerTransparent: true,
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ChatDetailScreen}
      />
      <Stack.Screen name="chat_invite"
                    options={{
                      headerTitle: "Invite Members",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ChatInviteScreen}
      />
      <Stack.Screen name="chat_open_image"
                    options={{
                      headerTitle: "",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ChatImageScreen}
      />
    </Stack.Navigator>
  );
}
