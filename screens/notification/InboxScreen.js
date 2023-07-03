import React from "react";
import { FlatList, Image, TouchableNativeFeedback, View } from "react-native";
import Tab from "./components/Tab";
import axios from "axios";
import config from "../../config";
import Text from "../../common/Text";
import { styles } from "./NotificationScreen";
import { connect } from "react-redux";
import { getNotificationCount } from "../../states/actionCreators";
import analytics from "@react-native-firebase/analytics";

export class InboxScreen extends React.Component {
  state = {
    loading: false,
    data: [],
    page: 1,
    pageCount: 0
  };

  componentDidMount(){
    this.load().then(() => analytics().logEvent("inbox"));
  }

  navigate(message){
    if (!message.is_read) {
      this.read(message).then(result => {
        this.props.getNotificationCount();
      });
    }

    if (message.content || message.picture_url) {
      this.props.navigation.navigate("inbox.detail", { id: message.id });
    }
  }

  async read(message){
    const result = await axios.get("/moment/inbox/read", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        id: message.id,
        expand: "is_read"
      }
    });

    if (result.data.success) {
      const data = this.state.data.map(_message => {
        if (result.data.data.id === _message.id) {
          return result.data.data;
        }

        return _message;
      });

      await this.setState({ data: data });
    }
  }

  async load(page, append){
    if (!page) {
      page = 1;
    }

    await this.setState({ loading: true });

    const result = await axios.get("/moment/inbox/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "is_read",
        page: page
      }
    });

    if (result.data.success) {
      if (append) {
        await this.setState({
          data: [...this.state.data, ...result.data.data],
          page: page,
          pageCount: result.data.pagination.page_count
        });
      } else {
        await this.setState({
          data: result.data.data,
          page: page,
          pageCount: result.data.pagination.page_count
        });
      }
    }

    await this.setState({ loading: false });

    return result;
  }

  renderMessage(message){
    let icon = <Image style={styles.notificationIcon} source={require("../../assets/icons/notification.png")} />;

    return (
      <TouchableNativeFeedback onPress={() => this.navigate(message)}>
        <View style={{ ...styles.notification, ...(message.is_read ? styles.notificationRead : {}) }}>
          <View style={styles.notificationIconWrapper}>
            {icon}
          </View>
          <View style={styles.notificationContentWrapper}>
            <Text style={{ ...styles.notificationTitle, ...(message.is_read ? styles.notificationTitleRead : {}) }}>{message.title}</Text>
            <Text style={styles.notificationContent}>{message.short_content}</Text>
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
        <Tab active="inbox" />

        <FlatList
          data={this.state.data}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={message => message.id.toString()}
          renderItem={item => this.renderMessage(item.item)}
          ListEmptyComponent={this.renderEmpty}
          onEndReached={() => {
            if (!this.state.loading && this.state.page < this.state.pageCount) {
              this.load(this.state.page + 1, true);
            }
          }}
        />

        {/*{this.state.loading && <View style={styles.containerLoading}>*/}
        {/*  <ActivityIndicator size="large" color="#0000ff" />*/}
        {/*</View>}*/}
      </View>
    );
  }
}

const mapDispatchToProps = {
  getNotificationCount
};

export default connect(null, mapDispatchToProps)(InboxScreen);
