import React from "react";
import { Image, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import TextInput from "../../../common/TextInput";
import { connect } from "react-redux";
import database from "@react-native-firebase/database/lib/index";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import axios from "axios";
import config from "../../../config";

export class MessageForm extends React.Component {
  messageInput = null;

  state = {
    message: "",
    image: null
  };

  constructor(props){
    super(props);
  }

  cancelImage(){
    this.setState({ image: null });
  }

  async send(){
    const qs = require("qs");

    const message = this.state.message.trim();
    const image = this.state.image;
    let imageUrl = null;

    if (!message && !image) {
      return;
    }

    this.setState({ message: "", image: null });
    this.messageInput.input.clear();

    this.forceUpdate();

    const ref = (new Date()).getTime() + "-" + Math.ceil(Math.random() * 1000000) + "-" + Math.ceil(Math.random() * 1000000);

    if (image) {
      let formData = new FormData();

      let uriParts = image.split(".");
      let fileType = uriParts[uriParts.length - 1];
      let rand = (Math.random().toFixed(5) * 10000).toString();

      formData.append("image", {
        uri: image,
        name: `${uriParts[0]}.${fileType}`,
        type: `image/${fileType}`
      });

      const uploadedImage = await axios.request({
        url: "/moment/chat/upload-image",
        method: "POST",
        baseURL: config.baseUrl,
        data: formData,
        params: {
          access_token: config.accessToken
        },
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (uploadedImage.data.success) {
        imageUrl = uploadedImage.data.data;
      }
    }

    if (this.props.onBeforeSave) {
      this.props.onBeforeSave({
        content: message,
        picture_url: image,
        client_id: ref
      });
    }

    const messageRef = database().ref(`/chat_messages/${this.props.chatId}/${ref}`);
    const sentAt = Math.floor((new Date()).getTime());

    await messageRef.set({
      client_id: ref,
      content: message,
      chat_id: this.props.chatId,
      picture_url: imageUrl,
      sent_at: sentAt,
      user_id: this.props.user.profile.firebase_uid
    });

    axios.request({
      url: "/moment/chat/send-notification",
      method: "POST",
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        chatId: this.props.chatId,
        message: message
      }
    });

    const groupMembersRef = database().ref(`/chats/${this.props.chatId}/members`);
    const groupMembersSnapshot = await groupMembersRef.once("value");
    const groupMembers = groupMembersSnapshot.val() || {};

    for (const uid in groupMembers) {
      if (uid === this.props.user.profile.firebase_uid && groupMembers[uid]["joined"]) {
        continue;
      }

      const unread = groupMembers[uid]["unread_count"] || 0;

      groupMembers[uid]["unread_count"] = unread + 1;

      const memberRef = database().ref(`/chat_members/${uid}/unread_count`);
      const unreadCountSnapshot = await memberRef.once("value");
      const unreadCount = unreadCountSnapshot.val() || 0;

      memberRef.set(unreadCount + 1);
    }

    groupMembersRef.set(groupMembers);

    const lastMessageRef = database().ref(`/chats/${this.props.chatId}/last_message`);
    const lastMessageAtRef = database().ref(`/chats/${this.props.chatId}/last_message_at`);

    let lastMessage = message;

    if(!lastMessage && image){
      lastMessage = "📷 Picture";
    }

    lastMessageRef.set(lastMessage);
    lastMessageAtRef.set(sentAt);
  }

  componentDidMount(){
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render(){
    return (
      <View style={styles.container}>
        {this.state.image && <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: this.state.image }} />

          <TouchableOpacity style={styles.cancelContainer} onPress={() => this.cancelImage()}>
            <Image style={styles.cancelImage} source={require("../../../assets/icons/close.png")} />
          </TouchableOpacity>
        </View>}

        <View style={styles.formContainer}>
          <View style={styles.form}>

            <TextInput ref={component => this.messageInput = component}
                       style={styles.message}
                       multiline={true}
                       onChangeText={value => this.setState({ message: value })}
                       placeholder="New Message..." />
          </View>
          <View style={styles.actions}>
            <TouchableNativeFeedback delayPressIn={0} background={TouchableNativeFeedback.SelectableBackgroundBorderless()} onPress={() => this._pickImage()}>
              <View style={styles.attachmentAction}>
                <Image style={styles.attachmentActionIcon} source={require("../../../assets/icons/photo.png")} />
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback delayPressIn={0} background={TouchableNativeFeedback.SelectableBackgroundBorderless()} onPress={() => this.send()}>
              <View style={styles.sendAction}>
                <Image style={styles.sendActionIcon} source={require("../../../assets/icons/send.png")} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(MessageForm);

const styles = StyleSheet.create({
  container: {
    elevation: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    paddingRight: 7,
    borderTopRightRadius: 27,
    borderTopLeftRadius: 27,
    marginTop: 4,
    overflow: "hidden"
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  message: {
    paddingVertical: 18,
    paddingHorizontal: 15,
    fontSize: 16
  },
  form: {
    flex: 1
  },
  actions: {
    flexDirection: "row"
  },
  sendActionIcon: {
    tintColor: "#FFF",
    height: 20,
    width: undefined,
    aspectRatio: 1
  },
  sendAction: {
    backgroundColor: "#68c4de",
    width: 43,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 43,
    marginBottom: 10
  },
  attachmentAction: {
    width: 43,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 43,
    marginBottom: 10,
    marginRight: 10
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25
  },
  imageContainer: {
    padding: 8,
    paddingRight: 0,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderColor: "#DDD",
    marginRight: -8
  },
  cancelContainer: {
    position: "absolute",
    top: 20,
    right: 15,
    zIndex: 9999,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.6)"

  },
  cancelImage: {
    tintColor: "#000",
    width: 15,
    height: undefined,
    aspectRatio: 1
  }
});

