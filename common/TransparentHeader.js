import React from "react";
import { Image, StatusBar, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "./Text";
import App from "../App";

export default function TransparentHeader(props){
  const { options } = props.scene.descriptor;

  React.useEffect(() => {
    props.navigation.addListener("focus", setStatusBar);
    props.navigation.addListener("blur", App.setDefaultStatusBar);

    return () => {
      props.navigation.removeListener("focus", setStatusBar);
      props.navigation.removeListener("blur", App.setDefaultStatusBar);
    };
  }, []);

  const setStatusBar = () => {
    StatusBar.setBackgroundColor(options.headerTransparent ? "rgba(0,0,0,0)" : "#EEE");
    StatusBar.setBarStyle("dark-content");
    StatusBar.setTranslucent(true);
  };

  const title =
    options.headerTitle !== undefined ? options.headerTitle :
      options.title !== undefined ? options.title : props.scene.route.name;

  return (
    <View style={{
      ...styles.container,
      ...(options.headerTransparent ? styles.containerTransparent : {})
    }}>
      {
        props.previous ?
          (<TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.2)", true)}
                                    useForeground={true}
                                    delayPressIn={0}
                                    onPress={() => props.navigation.goBack()}
          >
            <View style={styles.backContainer}>
              <Image style={styles.backIcon} source={require("../assets/icons/back.png")} />
            </View>
          </TouchableNativeFeedback>) : null
      }
      <Text style={styles.title}>{title}</Text>

      {
        options.headerRight ?
          (<View style={styles.right}>
            {options.headerRight()}
          </View>) : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight + 13,
    paddingRight: 25,
    paddingVertical: 13,
    backgroundColor: "#EEE",
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    paddingLeft: 0
  },
  containerTransparent: {
    backgroundColor: "transparent",
    elevation: 0
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1
  },
  backIcon: {
    aspectRatio: 1,
    width: 20,
    height: undefined,
    marginRight: 15,
    marginLeft: -10,
  },
  backContainer: {
    paddingLeft: 25
  }
});
