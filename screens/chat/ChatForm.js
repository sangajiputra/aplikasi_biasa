import React from "react";
import { ActivityIndicator, FlatList, Image, LayoutAnimation, StyleSheet, ToastAndroid, TouchableNativeFeedback, View } from "react-native";
import Text from "../../common/Text";
import PhotoPicker from "../../common/PhotoPicker";
import TextInput from "../../common/TextInput";
import axios from "axios";
import config from "../../config";
import { toFormData } from "../../common/helpers";
import database from "@react-native-firebase/database/lib/index";

export default class ChatForm extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      users: props.route.params.users,
      title: "",
      loading: false
    };
  }

  renderUser({ item }){
    return (
      <View style={styles.selectedUser}>
        <Image style={styles.selectedUserAvatar} source={{ uri: item.account.avatar_thumbnail_url }} />
        <Text style={styles.selectedUserName}>{item.account.username}</Text>
      </View>
    );
  }

  async save(){
    if(!this.state.title.trim()){
      ToastAndroid.show("Please provide the group name", 20000);
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    await this.setState({ loading: true });

    const members = this.state.users.map(user => {
      return user.id;
    });

    let formData = toFormData({
      title: this.state.title,
      member_ids: members
    });

    if (this.state.photo) {
      let uriParts = this.state.photo.split(".");
      let fileType = uriParts[uriParts.length - 1];
      let rand = Math.random().toFixed(5) * 100000;

      formData.append("uploaded_picture", {
        uri: this.state.photo,
        name: `${rand}.${fileType}`,
        type: `image/${fileType}`
      });
    }

    const result = await axios.post("/moment/chat/create", formData, {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken
      }
    });

    const chat = await database().ref(`/chats/${result.data.data.id}`).once("value");

    if (result.data.success) {
      this.props.navigation.popToTop();
      this.props.navigation.navigate("chat_message", { id: result.data.data.id, data: chat.val() });
    }

    await this.setState({ loading: false });

    return result;
  }

  render(){
    let content = <View style={styles.containerLoading}>
      <ActivityIndicator style={styles.loadingIndicator} color="#0000ff" size={30} />
      <Text style={styles.loadingText}>Creating Chat...</Text>
    </View>;

    if (!this.state.loading) {
      content = <View style={styles.container}>

        <View style={styles.form}>
          <PhotoPicker style={styles.icon}
                       default={require("../../assets/image-placeholder.png")}
                       onPick={value => this.setState({ photo: value })} />

          <View style={styles.inputContainer}>
            <TextInput style={styles.textInput}
                       value={this.state.title}
                       placeholder="Enter the subject of the group"
                       onChangeText={value => this.setState({ title: value })}
                       placeholderTextColor="#CCC"
            />
          </View>

          <View style={styles.addButton}>
            <TouchableNativeFeedback onPress={() => this.save()}
                                     useForeground={true}>
              <Image style={styles.addButtonIcon} source={require("../../assets/icons/next.png")} />
            </TouchableNativeFeedback>
          </View>
        </View>

        <FlatList
          style={styles.selectedUsers}
          data={this.state.users}
          columnWrapperStyle={styles.selectedUserColumn}
          keyExtractor={user => user.id.toString()}
          renderItem={this.renderUser.bind(this)}
          ListHeaderComponent={<Text style={styles.participant}>{this.state.users.length} members are participate in this group</Text>}
          numColumns={5}
        />
      </View>;
    }

    return content;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  selectedUserColumn: {
    flex: 1
  },
  selectedUsers: {
    backgroundColor: "#EEE",
    flex: 1
  },
  selectedUser: {
    alignItems: "center",
    paddingHorizontal: 5,
    marginBottom: 15,
    width: "20%"
  },
  selectedUserAvatar: {
    width: 50,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 50,
    marginBottom: 4
  },
  selectedUserName: {
    fontSize: 12,
    fontFamily: "QuicksandBold",
    marginBottom: 2
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#DDD",
    marginBottom: 0,
    flex: 1
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 8,
    textAlignVertical: "top"
  },
  form: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    paddingVertical: 25,
    position: "relative"
  },
  icon: {
    marginRight: 15,
    height: 60,
    width: 60,
    borderRadius: 60,
    aspectRatio: 1
  },
  addButton: {
    position: "absolute",
    bottom: -55,
    right: 0,
    zIndex: 99
  },
  addButtonIcon: {
    width: 90,
    height: undefined,
    aspectRatio: 1
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loadingIndicator: {
    marginBottom: 10
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold"
  },
  participant: {
    fontSize: 16,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 15,
    backgroundColor: "#FAFAFA"
  }
});
