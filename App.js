import React from "react";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import config from "./config";
import reducers from "./states/reducers";
import RootScreen from "./screens/RootScreen";
import { ActivityIndicator, Platform, StatusBar, ToastAndroid, UIManager, View } from "react-native";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import numeral from "numeral";
import NetInfo from "@react-native-community/netinfo";

const client = axios.create({
  baseURL: config.baseUrl,
  responseType: "json"
});

const store = createStore(reducers, applyMiddleware(axiosMiddleware(client)));

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default class App extends React.Component {
  state = {
    isCacheLoaded: true
  };

  async _loadCacheAsync(){
    const fonts = Font.loadAsync({
      "QuicksandBold": require("./assets/fonts/Quicksand-Bold.ttf"),
      "QuicksandMedium": require("./assets/fonts/Quicksand-Medium.ttf"),
      "QuicksandSemiBold": require("./assets/fonts/Quicksand-SemiBold.ttf"),
      "Quicksand": require("./assets/fonts/Quicksand-Regular.ttf")
    });

    const assets = Asset.loadAsync([
      require("./assets/bg/header.png"),
      require("./assets/icons/notification.png"),
      require("./assets/logo-invert.png"),

      require("./assets/icons/nav/e-health.png"),
      require("./assets/icons/nav/e-learning.png"),
      require("./assets/icons/nav/goal.png"),
      require("./assets/icons/nav/kpi.png"),
      require("./assets/icons/nav/moment.png"),
      require("./assets/icons/nav/note.png"),
      require("./assets/icons/nav/plan.png"),
      require("./assets/icons/nav/report.png"),

      require("./assets/icons/main-nav/account.png"),
      require("./assets/icons/main-nav/calendar.png"),
      require("./assets/icons/main-nav/chat.png"),
      require("./assets/icons/main-nav/home.png"),
      require("./assets/icons/main-nav/lead.png"),
      require("./assets/icons/main-nav/active/account.png"),
      require("./assets/icons/main-nav/active/calendar.png"),
      require("./assets/icons/main-nav/active/chat.png"),
      require("./assets/icons/main-nav/active/home.png"),
      require("./assets/icons/main-nav/active/lead.png")
    ]);

    return Promise.all([assets, fonts]);
  }

  static setDefaultStatusBar(){
    StatusBar.setBackgroundColor("rgba(0,0,0,0.4)");
    StatusBar.setBarStyle("dark-content");
    StatusBar.setTranslucent(true);
  }

  componentDidMount(){
    this._loadCacheAsync().then(result => {
      this.setState({ isCacheLoaded: true });
    });

    App.setDefaultStatusBar();

    if (!numeral.locales["id"]) {
      numeral.register("locale", "id", {
        delimiters: {
          thousands: ".",
          decimal: ","
        },
        abbreviations: {
          thousand: "k",
          million: "m",
          billion: "b",
          trillion: "t"
        },
        ordinal: function(number){
          return "";
        },
        currency: {
          symbol: "Rp. "
        }
      });
    }

// switch between locales
    numeral.locale("id");

    NetInfo.addEventListener(state => {
      if(!state.isConnected){
        ToastAndroid.show("You are offline", 20000);
      }
    });
  }

  render(){
    if (this.state.isCacheLoaded) {
      return (
        <Provider store={store}>

          {/*<KeyboardAvoidingView style={{ flex: 1 }}>*/}
          <RootScreen />
          {/*</KeyboardAvoidingView>*/}
        </Provider>
      );
    }

    return <View style={{ flex: 1 }}><ActivityIndicator size={40} />
    </View>;
  }
}
