import React from "react";
import { Image, StatusBar, StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback, View } from "react-native";
import Banner from "./Banner";
import { connect } from "react-redux";
import Text from "../../../common/Text";
import { getNotificationCount } from "../../../states/actionCreators";

export class Header extends React.Component {
  bannerComponent = null;

  load(){
    this.props.getNotificationCount();

    return this.bannerComponent.load();
  }

  componentDidMount(){
    this.props.getNotificationCount();
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Image style={styles.logo} source={require("../../../assets/logo-invert.png")} />
            <View style={styles.usernameGreeting}>
              <Text style={styles.usernameGreetingText}>Hi, </Text>
              <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("account")}>
                <Text style={styles.username}>{this.props.user.profile.name}</Text>
              </TouchableWithoutFeedback>
            </View>
            <Text style={styles.greeting}>How are you today?</Text>
          </View>

          <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("account")}>
            <View style={styles.avatarContainer}>
              <Image style={styles.avatar} source={{ uri: this.props.user.avatar_thumbnail_url }} />
              {this.props.user.profile?.stage.priority !== 1 && <Image style={styles.badge} source={{ uri: this.props.user.profile?.stage.badge_url }} /> }
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.banner}>
          <Banner ref={component => this.bannerComponent = component} />
        </View>

        <View style={styles.notificationContainer}>
          <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("notification")}>
            <View style={styles.notification}>
              <View style={styles.notificationIconWrapper}>
                <Image style={styles.notificationIcon} source={require("../../../assets/icons/notification.png")} />
                {this.props.unseen_notification_count > 0 && <View style={styles.notificationIndicator} />}
              </View>

              {this.props.unseen_notification_count > 0 && <Text>{this.props.unseen_notification_count} new notifications</Text>}
              {this.props.unseen_notification_count <= 0 && <Text>No Notification</Text>}
            </View>
          </TouchableNativeFeedback>
        </View>

      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    unseen_notification_count: state.notification.unseen_count.total
  };
};
const mapDispatchToProps = {
  getNotificationCount
};
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Header);

const styles = StyleSheet.create({
  background: {
    width: "100%"
  },
  container: {
    marginBottom: 5
  },
  header: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight + 10
  },
  logo: {
    width: 175,
    height: undefined,
    aspectRatio: 4.4,
    marginBottom: 10
  },
  leftHeader: {},
  usernameGreeting: {
    flexDirection: "row",
    paddingLeft: 10
  },
  username: {
    fontWeight: "bold",
    color: "#FFF",
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2
  },
  usernameGreetingText: {
    color: "#FFF",
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2
  },
  greeting: {
    fontSize: 15,
    color: "#FFF",
    paddingLeft: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2
  },
  banner: {
    marginBottom: 10
  },
  avatar: {
    aspectRatio: 1,
    width: 60,
    height: undefined,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 60
  },
  avatarContainer: {
    borderRadius: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,

    elevation: 8,
    position: "relative"
  },
  badge: {
    width: 30,
    height: undefined,
    aspectRatio: 1,
    position: "absolute",
    bottom: -5,
    right: -5,
    zIndex: 9,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF'
  },
  notification: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,

    elevation: 6
  },
  notificationIndicator: {
    width: 14,
    height: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "red",
    position: "absolute",
    top: -4,
    right: 8
  },
  notificationContainer: {
    alignItems: "center",
    marginBottom: 20
  },
  notificationIcon: {
    marginRight: 10,
    aspectRatio: 1,
    width: 20,
    height: undefined
  },
  notificationIconWrapper: {
    position: "relative"
  }
});
