import React from "react";
import { FlatList, Image, LayoutAnimation, Modal, StatusBar, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../common/Text";
import database from "@react-native-firebase/database";
import App from "../../App";
import MessageForm from "./components/MessageForm";
import moment from "moment";
import { connect } from "react-redux";
import axios from "axios";
import config from "../../config";
import ImageViewer from "react-native-image-zoom-viewer";
import analytics from "@react-native-firebase/analytics";

const today = moment();

export class ChatMessageScreen extends React.Component {
  dbRef = null;
  chatMemberRef = null;
  chatRef = null;
  readedTimeout = null;
  childAddedCallback = null;
  chatMembersCallback = null;
  lastId = null;
  messagePerPage = 50;

  constructor(props){
    super(props);

    this.state = {
      data: [],
      uid: null,
      loading: false,
      members: [],
      memberUids: [],
      visibleImagePreview: false,
      imagePreview: null
    };
  }

  async componentDidMount(){
    this.readed();

    this.props.navigation.addListener("focus", ChatMessageScreen.setStatusBar);
    this.props.navigation.addListener("blur", App.setDefaultStatusBar);

    await this.load();

    this.dbRef = database().ref(`/chat_messages/${this.props.route.params.id}`).orderByChild("sent_at").limitToLast(1);

    if (this.state.data.length > 0) {
      this.dbRef = this.dbRef.startAt(this.state.data[this.state.data.length - 1].sent_at);
    }

    this.childAddedCallback = this.messageAddedHandler.bind(this);

    this.dbRef.on("child_added", this.childAddedCallback);

    this.chatMemberRef = database().ref(`/chats/${this.props.route.params.id}/members`);

    this.chatMembersCallback = this.chatMembersHandler.bind(this);

    this.chatMemberRef.on("value", this.chatMembersCallback);

    this.chatRef = database().ref(`/chats/${this.props.route.params.id}`);

    if (!this.props.route.params.data) {
      this.chatRef.once("value").then((snapshot) => {
        const data = snapshot.val();

        this.props.navigation.setOptions({
          headerTitle: data.title,
          picture: data.picture
        });
      });
    } else {
      let title = this.props.route.params.data?.title;
      let picture = this.props.route.params.data?.picture;

      this.props.navigation.setOptions({
        headerTitle: title,
        picture: picture
      });
    }

    analytics().logEvent("chat_view")
  }

  componentWillUnmount(){
    if (this.dbRef) {
      this.dbRef.off("child_added", this.childAddedCallback);
    }

    if (this.chatMemberRef) {
      this.chatMemberRef.off("value", this.chatMembersCallback);
    }

    this.props.navigation.removeListener("focus", ChatMessageScreen.setStatusBar);
    this.props.navigation.removeListener("blur", App.setDefaultStatusBar);
  }

  static setStatusBar(){
    StatusBar.setBackgroundColor("rgba(255,255,255,1)");
    StatusBar.setBarStyle("dark-content");
    StatusBar.setTranslucent(true);
  }

  readed(){
    clearTimeout(this.readedTimeout);

    this.readedTimeout = setTimeout(() => {
      axios.post("/moment/chat/read-chat", null, {
        baseURL: config.baseUrl,
        params: {
          access_token: config.accessToken,
          id: this.props.route.params.id
        }
      });
    }, 800);
  }

  async chatMembersHandler(snapshot){
    let members = snapshot.val();

    const currentMemberIds = [];

    for (const memberId in members) {
      if (members[memberId].joined) {
        currentMemberIds.push(memberId);
      }
    }

    if (currentMemberIds.indexOf(this.props.user.profile.firebase_uid) === -1) {
      this.props.navigation.navigate("chat");
    }

    if (this.state.memberUids.length !== currentMemberIds.length) {
      await this.setState({ memberUids: currentMemberIds });

      await this.loadMembers();
    }
  };

  async loadMembers(){
    const qs = require("qs");

    const result = await axios.post("/moment/member/get", qs.stringify({ "firebase_uid": this.state.memberUids }), {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        page: this.state.page,
        page_size: 20,
        expand: "account,account.avatar_thumbnail_url",
        fields: "name,id,account.username,account.avatar_thumbnail_url,firebase_uid"
      }
    });

    await this.setState({ members: result.data.data });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.props.navigation.setOptions({
      members: this.state.members.slice(0, 10).map(member => member.account.username).join(", ")
    });

    return result;
  }

  getMemberByUid(uid){
    return this.state.members.find(member => member.firebase_uid === uid);
  }

  messageAddedHandler(snapshot){

    let message = snapshot.val();

    message.loading = false;

    if (message) {
      const index = this.state.data.findIndex(item => item.client_id == message.client_id);

      if (message.user_id !== this.props.user.profile.firebase_uid) {
        this.readed();
      }

      if (index === -1) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        this.setState({ data: [message, ...this.state.data] });
      } else {
        let data = [...this.state.data];

        data[index] = { ...data[index], ...message };

        this.setState({ data: data });
      }
    }
  }

  openImagePreview(url){
    this.setState({
      imagePreview: url,
      visibleImagePreview: true
    });
  }

  renderMessage({ item }){
    const member = this.getMemberByUid(item.user_id);
    let bubleStyles = styles.message;
    const isMine = item.user_id === this.props.user.profile.firebase_uid;

    if (isMine) {
      bubleStyles = { ...bubleStyles, ...styles.myMessage };
    }

    if (item.loading) {
      bubleStyles = { ...bubleStyles, ...styles.messageLoading };
    }

    let time = null;
    const _time = moment(item.sent_at);

    if (item.loading) {
      time = "Sending...";
    } else if (_time.isSame(today, "day")) {
      time = _time.format("hh:mm");
    } else {
      time = _time.format("YYYY-MM-DD");
    }

    const timeComponent = <Text style={{ ...styles.time, ...(isMine ? styles.timeMine : {}) }}>{time}</Text>;

    return (
      <View style={styles.messageContainer}>
        <View style={bubleStyles}>
          {item.picture_url && <TouchableNativeFeedback onPress={() => this.openImagePreview(item.picture_url)} style={styles.messageImageContainer}>
            <Image style={styles.messageImage} source={{ uri: item.picture_url }} />
          </TouchableNativeFeedback>}

          <View style={styles.messageContent}>
            {isMine && timeComponent}

            <View style={{ flexShrink: 1 }}>
              {!isMine && <Text style={{ ...styles.messageSender, ...(!member?.account.username ? styles.messageSenderRemoved : null) }}>{member?.account.username ? member?.account.username : "Removed member"}</Text>}
              <Text style={styles.messageText}>{item.content}</Text>
            </View>

            {!isMine && timeComponent}
          </View>
        </View>
      </View>
    );
  }

  async load(){
    this.setState({ loading: true });

    let currentRef = database().ref(`/chat_messages/${this.props.route.params.id}`).orderByChild("sent_at");

    if (this.lastId !== null && this.lastId !== undefined) {
      currentRef = currentRef.endAt(this.lastId).limitToLast(this.messagePerPage + 1);
    } else {
      currentRef = currentRef.limitToLast(this.messagePerPage);
    }

    const snapshot = await currentRef.once("value");

    let data = snapshot.val();

    if (!data) {
      data = {};
    }

    let parsedData = Object.values(data);

    parsedData = parsedData.filter(item => item !== null).sort((a, b) => a.sent_at < b.sent_at);

    if (this.lastId) {
      parsedData.shift();
    }

    if (!parsedData[parsedData.length - 1]) {
      // console.log(parsedData);
    }

    this.lastId = parsedData.length > 0 ? parsedData[parsedData.length - 1].sent_at : undefined;

    if (parsedData.length < this.messagePerPage) {
      this.lastId = undefined;
    }

    await this.setState({ data: [...this.state.data, ...parsedData], loading: false });

    return snapshot;
  }

  render(){
    return (
      <View style={styles.container}>
        <Modal visible={this.state.visibleImagePreview}
               transparent={true}
               onRequestClose={() => {
                 this.setState({ visibleImagePreview: false });
               }}>
          <ImageViewer
            imageUrls={[
              { url: this.state.imagePreview }
            ]}
          />
        </Modal>
        <Image style={styles.bgChat} resizeMode="contain" source={require("../../assets/bg/chat.jpg")} />
        <FlatList
          style={styles.scroller}
          keyExtractor={message => message.client_id + (message.client_id ? message.client_id : "").toString()}
          data={this.state.data}
          inverted={true}
          onEndReached={() => {this.lastId !== undefined && !this.state.loading && this.load();}}
          renderItem={this.renderMessage.bind(this)}
        />
        <MessageForm
          memberUids={this.state.memberUids}
          onBeforeSave={(value) => {
            value.user_id = this.props.user.profile.firebase_uid;
            value.loading = true;

            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

            this.setState({ data: [value, ...this.state.data] });
          }}
          chatId={this.props.route.params.id} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ChatMessageScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    position: "relative"
  },
  bgChat: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#bcbcbc",
    zIndex: -1,
    opacity: 0.3
  },
  scroller: {
    backgroundColor: "transparent"
  },
  messageContainer: {
    alignItems: "flex-start",
    marginVertical: 3,
    width: "100%",
    paddingHorizontal: 10,
    flex: 1
  },
  messageLoading: {
    opacity: 0.9
  },
  message: {
    paddingVertical: 7,
    paddingHorizontal: 7,
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 15,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    elevation: 1,
    maxWidth: "80%"
  },
  messageContent: {
    flexDirection: "row"
  },
  myMessage: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 22,
    alignSelf: "flex-end",
    backgroundColor: "rgb(209,241,255)"
  },
  messageText: {
    fontSize: 16,
    marginHorizontal: 10
  },
  time: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 5,
    paddingTop: 18
  },
  messageSender: {
    color: "#66b2ff",
    fontWeight: "bold",
    paddingLeft: 10
  },
  timeMine: {
    paddingTop: 0
  },
  messageImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3
  },
  messageSenderRemoved: {
    color: "gray"
  }
});
