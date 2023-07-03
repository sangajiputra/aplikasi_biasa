import React from "react";
import { Image, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import Text from "../../../common/Text";
import PhotoPicker from "../../../common/PhotoPicker";
import { changeAvatar } from "../../../states/actionCreators";
import { connect } from "react-redux";

export function Header(props){

  const changeAvatar = (value) => {
    props.changeAvatar(value, props.user.username);
  };

  return (
    <ImageBackground fadeDuration={0} source={require("../../../assets/bg/header.png")} style={styles.header} resizeMode="stretch">
      <View style={styles.avatarContainer}>
        <PhotoPicker onPick={(value) => changeAvatar(value)}
                     value={props.user.avatar_thumbnail_url ? { uri: props.user.avatar_thumbnail_url } : undefined}
                     style={styles.avatar} />
        {props.user.profile?.stage.priority !== 1 && <Image style={styles.badge} source={{ uri: props.user.profile?.stage.badge_url }} />}
      </View>
      <Text style={styles.name}>{props.user.profile.name}</Text>
      <Text style={styles.stage}>{props.user.profile.stage.name}</Text>
    </ImageBackground>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  changeAvatar
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const styles = StyleSheet.create({
  header: {
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight
  },
  name: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold"
  },
  stage: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15
  },
  avatar: {
    width: 100,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.5)",
    marginBottom: 15
  },
  avatarContainer: {
    position: "relative"
  },
  badge: {
    width: 35,
    height: undefined,
    aspectRatio: 1,
    position: "absolute",
    bottom: 8,
    right:0,
    zIndex: 9,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFF"
  }
});
