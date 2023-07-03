import React from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Tab from "./components/Tab";
import axios from "axios";
import config from "../../config";
import Text from "../../common/Text";
import { connect } from "react-redux";
import { getNotificationCount } from "../../states/actionCreators";
import analytics from "@react-native-firebase/analytics";

export class NotificationScreen extends React.Component {
  state = {
    loading: false,
    data: []
  };

  componentDidMount(){
    this.load();
  }

  async read(notification){
    const result = await axios.get("/moment/notification/read", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        id: notification.notification.id,
        expand: "notification"
      }
    });

    if (result.data.success) {
      const data = this.state.data.map(_notification => {
        if (result.data.data.notification.id === _notification.notification.id) {
          return result.data.data;
        }

        return _notification;
      });

      await this.setState({ data: data });
    }
  }

  async load(){
    await this.setState({ loading: true });

    const result = await axios.get("/moment/notification/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "notification"
      }
    });

    if (result.data.success) {
      await this.setState({ data: result.data.data });


      analytics().logEvent('notification');
    }

    await this.setState({ loading: false });

    return result;
  }

  async navigate(notification){
    if (!notification.is_read) {
      this.read(notification).then(result => {
        this.props.getNotificationCount();
      });
    }

    switch (notification.notification.data?.type) {
      case "vital_sign.review":
        this.props.navigation.navigate("vital_sign_downline", { id: notification.notification.data.member_id });
        break;
      case "vital_sign.approved":
        this.props.navigation.navigate("vital_sign");
        break;
      case "event.reminder":
        if (notification.notification.data.event_type === "U") {
          this.props.navigation.navigate("event", {screen: 'add_event',params: { "id": notification.notification.data.event_id },initial: false});
        }else{
          this.props.navigation.navigate('event_detail',{id:notification.notification.data.event_id});
        }
        break;
    }
  }

  renderNotification(notification){
    let icon = <Image style={styles.notificationIcon} source={require("../../assets/icons/notification.png")} />;

    switch (notification.notification.data?.type) {
      case "vital_sign.review":
        icon = <Image style={styles.notificationIcon} source={require("../../assets/icons/notif-vital-sign.png")} />;
        break;
      case "vital_sign.approved":
        icon = <Image style={styles.notificationIcon} source={require("../../assets/icons/notif-vital-sign-approved.png")} />;
        break;
    }

    return (
      <TouchableNativeFeedback onPress={() => this.navigate(notification)}>
        <View style={{ ...styles.notification, ...(notification.is_read ? styles.notificationRead : {}) }}>
          <View style={styles.notificationIconWrapper}>
            {icon}
          </View>
          <View style={styles.notificationContentWrapper}>
            <Text style={{ ...styles.notificationTitle, ...(notification.is_read ? styles.notificationTitleRead : {}) }}>{notification.notification.title}</Text>
            <Text style={styles.notificationContent}>{notification.notification.body}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  renderEmpty(){
    return (
      <View style={styles.empty}>
        <Image style={styles.emptyIcon} source={require("../../assets/icons/notification.png")} />
        <Text style={styles.emptyText}>You have no notification</Text>
      </View>
    );
  }

  render(){
    return (
      <View style={styles.container}>
        <Tab active="default" />

        {!this.state.loading && <FlatList
          style={styles.scroller}
          data={this.state.data}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={notification => notification.id.toString()}
          ListEmptyComponent={this.renderEmpty}
          renderItem={item => this.renderNotification(item.item)}
        />}

        {this.state.loading && <View style={styles.containerLoading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>}
      </View>
    );
  }
}

const mapDispatchToProps = {
  getNotificationCount
};

export default connect(null, mapDispatchToProps)(NotificationScreen);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  notification: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,149,0.14)"
  },
  notificationRead: {
    backgroundColor: "transparent"
  },
  notificationTitle: {
    fontFamily: "QuicksandBold",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 3
  },
  notificationTitleRead: {
    fontWeight: undefined
  },
  notificationIconWrapper: {
    padding: 10,
    backgroundColor: "#399dff",
    borderRadius: 60,
    marginRight: 15
  },
  notificationIcon: {
    width: 20,
    height: undefined,
    aspectRatio: 1,
    tintColor: "#FFF"
  },
  notificationContentWrapper: {
    flex: 1
  },
  scroller: {
    flex: 1
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.2
  },
  emptyIcon: {
    tintColor: "#555",
    width: 80,
    height: undefined,
    aspectRatio: 1,
    marginBottom: 8
  },
  emptyText: {
    fontSize: 20
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 35
  }
});
