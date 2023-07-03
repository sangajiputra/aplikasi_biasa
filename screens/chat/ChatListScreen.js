import React from "react";
import { FlatList, Image, StatusBar, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../common/Text";
import database from "@react-native-firebase/database/lib/index";
import { SafeAreaView } from "react-native-safe-area-context";
import App from "../../App";
import { connect } from "react-redux";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";

const today = moment();

export class ChatListScreen extends React.Component {
  chatsRef = null;
  chatListeners = {};
  chatsCallback = null;

  constructor(props){
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount(){
    this.chatsRef = database().ref(`/chat_members/${this.props.user.profile.firebase_uid}/chats`);

    this.chatsCallback = this.chatChangeHanlder.bind(this);
    this.chatsRef.on("value", this.chatsCallback);

    this.props.navigation.addListener("focus", ChatListScreen.setStatusBar);
    this.props.navigation.addListener("blur", App.setDefaultStatusBar);

    analytics().logEvent("chat_list")
  }

  static setStatusBar(){
    StatusBar.setBackgroundColor("rgba(255,255,255,1)");
    StatusBar.setBarStyle("dark-content");
    StatusBar.setTranslucent(true);
  }

  async chatChangeHanlder(snapshot){
    let chatIds = snapshot.val();

    if (Array.isArray(chatIds)) {
      let _chatIds = {};

      snapshot.forEach(chatId => {
        if (!chatId) {
          return;
        }

        _chatIds[chatId.key] = chatId;
      });

      chatIds = _chatIds;
    }

    for (const id in chatIds) {
      let chat = chatIds[id] && typeof chatIds[id].val === "function" ? chatIds[id].val() : chatIds[id];


      if (!chat || !chat.joined) {
        if (chat && !chat.joined) {
          await this.setState({ data: this.state.data.filter(_chat => _chat.id != id) });
        }

        continue;
      }

      if (typeof this.chatListeners[id] === "undefined") {

        const handler = (snapshot) => {
          const chat = snapshot.val();

          if (chat === null) {
            return;
          }

          const index = this.state.data.findIndex(_chat => _chat.id == chat.id);

          let data = [...this.state.data];

          if (index !== -1) {

            data[index] = { ...data[index], ...chat };
          } else {
            data.push(chat);
          }

          data.sort((a, b) => a.last_message_at < b.last_message_at);

          this.setState({ data: data });
        };

        const ref = database().ref(`/chats/${id}`);
        const _handler = handler.bind(this);

        ref.on("value", _handler);

        this.chatListeners[id] = { ref, _handler };
      }
    }

  }

  componentWillUnmount(){
    this.chatsRef.off("value", this.chatsCallback);

    this.props.navigation.removeListener("focus", ChatListScreen.setStatusBar);
    this.props.navigation.removeListener("blur", App.setDefaultStatusBar);

    for (const id in this.chatListeners) {
      this.chatListeners[id]["ref"].off("value", this.chatListeners[id]["handler"]);
    }
  }

  renderItem({ item }){
    let time = null;
    const _time = moment(item.last_message_at);

    if (_time.isSame(today, "day")) {
      time = _time.format("HH:mm");
    } else {
      time = _time.fromNow(true);
    }

    let unreadCount = item.members[this.props.user.profile.firebase_uid]?.unread_count;

    if (!unreadCount) {
      unreadCount = 0;
    }

    return (
      <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("chat_message", { data: item, id: item.id })}>
        <View style={styles.chat}>
          <Image style={styles.avatar} source={item.picture_thumbnail ? { uri: item.picture_thumbnail } : require("../../assets/image-placeholder.png")} />
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.lastMessage}>{item.last_message ? item.last_message : "No message yet, say hi to the group"}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.time}>
              {time}
            </Text>
            {unreadCount > 0 && <Text style={styles.unread}>{unreadCount}</Text>}
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  render(){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.addButton}>
          <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("create_chat.members")}
                                   useForeground={true}>
            <Image style={styles.addButtonIcon} source={require("../../assets/icons/add.png")} />
          </TouchableNativeFeedback>
        </View>
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={chat => chat.id.toString()}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ChatListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  time: {
    opacity: 0.8,
    alignSelf: "flex-start"
  },
  chat: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDD",
    padding: 15,
    alignItems: "center"
  },
  title: {
    fontSize: 16,
    fontFamily: "QuicksandBold",
    marginBottom: 2
  },
  avatar: {
    width: 50,
    height: undefined,
    aspectRatio: 1,
    marginRight: 15,
    borderRadius: 50
  },
  content: {
    flex: 1
  },
  addButton: {
    position: "absolute",
    bottom: -5,
    right: 0,
    zIndex: 99
  },
  addButtonIcon: {
    width: 90,
    height: undefined,
    aspectRatio: 1
  },
  unread: {
    fontWeight: "bold",
    backgroundColor: "#68c4de",
    minWidth: 24,
    height: 24,
    borderRadius: 24,
    color: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 5
  },
  meta: {
    marginLeft: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  }
});
