import React from "react";
import { connect } from "react-redux";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import UnauthenticatedScreen from "./account/UnauthenticatedScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Image, Keyboard, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import ChatScreen from "./chat/ChatScreen";
import EventStackScreen from "./event/EventScreen";
import { HomeStackScreen } from "./home-screen/HomeScreen";
import LeadScreen from "./lead/LeadScreen";
import AccountStackScreen from "./account/AccountScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getNotificationCount, getVitalSigns, loggedIn, showNav } from "../states/actionCreators";
import Text from "../common/Text";
import AsyncStorage from "@react-native-community/async-storage";
import database from "@react-native-firebase/database";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import config from "../config";
import SplashScreen from "./SplashScreen";

const MainTab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }){

  return (
    <View style={tabBarStyles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        if (!options.tabBarVisible) {
          return;
        }

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key
          });
        };

        return (
          <View style={tabBarStyles.tabBarItem} key={route.key}>
            <TouchableNativeFeedback
              delayPressIn={0}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ["selected"] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              background={new TouchableNativeFeedback.Ripple("rgba(0,0,0,0.1)", true)}
              style={{ flex: 1 }}
            >
              <View style={tabBarStyles.tabBarItemWrapper}>
                {options.tabBarIcon({ focused: isFocused })}
                <Text style={{ ...tabBarStyles.tabBarItemText, ...(isFocused ? tabBarStyles.tabBarItemTextFocused : {}) }}>
                  {label}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
      })}
    </View>
  );
}

const tabBarStyles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#fbfbfb"
  },
  tabBarItem: {
    flex: 1
  },
  tabBarItemText: {
    textAlign: "center",
    marginTop: 2,
    fontSize: 12,
    color: "#AAA",
    fontWeight: "bold"
  },
  tabBarItemTextFocused: {
    color: "#587dff"
  },
  tabBarItemWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8
  }
});

function RootScreen(props){
  const [chatUnreadCount, setChatUnreadCount] = React.useState(0);
  const [splashed, setSplashed] = React.useState(true);

  const getProfile = async () => {
    return axios.get("/moment/member/profile", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "profile,profile.stage,profile.stage.badge_url,avatar_thumbnail_url,profile.upline,profile.city,profile.province"
      }
    });
  };

  React.useEffect(() => {
    AsyncStorage.getItem("userData").then(userData => {
      props.loggedIn(JSON.parse(userData));
    });

    const unsubscribe = messaging().onMessage(remoteMessage => {
      if (remoteMessage.data.type === "vital_sign.approved") {
        getProfile().then(result => {
          props.loggedIn({
            access_token: config.accessToken,
            data: result.data.data
          });
          props.getVitalSigns(result.data.data.profile.stage_id);
        });
      }

      props.getNotificationCount();
    });

    props.getNotificationCount();

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (props.isLoggedIn) {
      const ref = database().ref(`/chat_members/${props.user.profile.firebase_uid}/unread_count`);
      const handler = snapshot => {
        setChatUnreadCount(snapshot.val());
      };

      ref.on("value", handler);

      return () => {
        ref.off("value", handler);
      };
    }
  }, [props.isLoggedIn]);

  React.useEffect(() => {
    const hide = () => {
      if (!props.showTabBar) {
        return;
      }

      props.showNav(false);

      const show = () => {
        props.showNav(true);

        Keyboard.removeListener("keyboardDidHide", show);
      };

      Keyboard.addListener("keyboardDidHide", show);
    };

    Keyboard.addListener("keyboardDidShow", hide);

    return () => {
      Keyboard.removeListener("keyboardDidShow", hide);
    };
  }, [props.showTabBar]);

  React.useEffect(() => {
    AsyncStorage.getItem('splashed').then(data => {
      if(data){
        setSplashed(true);
      }else{
        setSplashed(false);
      }
    });
  },[]);

  let content = (
    <NavigationContainer>
      {!splashed && <SplashScreen onEscape={() => setSplashed(true)}/>}
      {splashed && <UnauthenticatedScreen />}
    </NavigationContainer>
  );

  if (props.isLoggedIn) {
    content = (
      <SafeAreaProvider style={styles.container}>
        <NavigationContainer>
          <MainTab.Navigator
            initialRouteName="home"
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
              tabBarVisible: props.showTabBar,
              tabBarIcon: ({ focused, color, size }) => {

                const icons = {
                  home: [require("../assets/icons/main-nav/home.png"), require("../assets/icons/main-nav/active/home.png")],
                  event: [require("../assets/icons/main-nav/calendar.png"), require("../assets/icons/main-nav/active/calendar.png")],
                  chat: [require("../assets/icons/main-nav/chat.png"), require("../assets/icons/main-nav/active/chat.png")],
                  account: [require("../assets/icons/main-nav/account.png"), require("../assets/icons/main-nav/active/account.png")],
                  lead: [require("../assets/icons/main-nav/lead.png"), require("../assets/icons/main-nav/active/lead.png")]
                };

                if (icons[route.name]) {
                  const icon = focused ? icons[route.name][1] : icons[route.name][0];

                  const iconImage = <Image source={icon} style={{ width: 26, height: undefined, aspectRatio: 1 }} />;

                  if (route.name === "chat") {
                    return <View>{iconImage}{chatUnreadCount > 0 && <Text style={styles.chatUnreadCount}>{chatUnreadCount}</Text>}</View>;
                  }

                  return iconImage;
                }
              }
            })}>

            <MainTab.Screen name="chat" component={ChatScreen} options={{ title: "Chat" }} />
            <MainTab.Screen name="event" component={EventStackScreen} options={{ title: "Event" }} />
            <MainTab.Screen name="home" component={HomeStackScreen} options={{ title: "Home" }} />
            <MainTab.Screen name="lead" component={LeadScreen} options={{ title: "Leads" }} />
            <MainTab.Screen name="account" component={AccountStackScreen} options={{ title: "Account" }} />
          </MainTab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

  return content;
}

const mapStateToProps = state => {
  return {
    user: state.user,
    isLoggedIn: typeof state.user.id !== "undefined",
    showTabBar: state.showTabBar
  };
};

const mapDispatchToProps = {
  showNav,
  loggedIn,
  getNotificationCount,
  getVitalSigns
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    height: 60
  },
  tabLabel: {
    top: -7
  },
  chatUnreadCount: {
    backgroundColor: "#FF0000",
    borderWidth: 2,
    borderColor: "#FFF",
    color: "#FFF",
    position: "absolute",
    top: -7,
    minWidth: 20,
    height: 20,
    borderRadius: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
    right: -7,
    lineHeight: 19
  }
});
