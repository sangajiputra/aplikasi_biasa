import React from "react";
import { Image, StatusBar, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "./../../../common/Text";
import App from "../../../App";

export default function ChatMessageHeader(props){
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
    StatusBar.setBackgroundColor(options.headerTransparent ? "rgba(0,0,0,1)" : "#EEE");
    StatusBar.setBarStyle("dark-content");
    StatusBar.setTranslucent(true);
  };

  const title =
    options.headerTitle !== undefined ? options.headerTitle :
      options.title !== undefined ? options.title : props.scene.route.name;

  return (
    <View style={{ ...styles.container, ...(options.headerTransparent ? styles.containerTransparent : {}) }}>
      {
        props.previous ?
          (<TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.2)", true)}
                                    useForeground={true}
                                    delayPressIn={0}
                                    onPress={() => props.navigation.goBack()}
          >
            <View>
              <Image style={styles.backIcon} source={require("../../../assets/icons/back.png")} />
            </View>
          </TouchableNativeFeedback>) : null
      }

      <TouchableNativeFeedback onPress={() => props.navigation.navigate("chat_detail", { id: props.scene.route.params.id })}>
        <View style={styles.content}>
          {
            options.picture && <Image style={styles.picture} source={{ uri: options.picture }} />
          }

          <View style={styles.titleBar}>
            <Text style={styles.title}>{title}</Text>

            {
              options.members && <View style={styles.membersWrapper}>
                <Text numberOfLines={1} style={styles.members}>{options.members}</Text>
              </View>
            }
          </View>
        </View>
      </TouchableNativeFeedback>

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
    paddingLeft: 25,
    paddingRight: 25,
    paddingVertical: 13,
    backgroundColor: "#EEE",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 90,
    elevation: 3
  },
  containerTransparent: {
    backgroundColor: "transparent"
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  backIcon: {
    aspectRatio: 1,
    width: 20,
    height: undefined,
    marginRight: 15,
    marginLeft: -10
  },
  picture: {
    width: 35,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 35,
    marginRight: 10,
    marginVertical: -4
  },
  titleBar: {
    flex: 1
  },
  members: {
    flex: 1,
    fontSize: 12
  },
  membersWrapper: {
    flexDirection: "row"
  },
  content: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    marginVertical: -15,
    paddingVertical: 15
  }
});
