import React from "react";
import { FlatList, Image, ImageBackground, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import axios from "axios";
import config from "../../config";
import moment from "moment";
import Text from "../../common/Text";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import Selector from "../../common/Selector";
import { connect } from "react-redux";
import analytics from "@react-native-firebase/analytics";

export class ChatDetailScreen extends React.Component {
  state = {
    data: {
      members: []
    },
    image: null,
    loading: false,
    isMenuVisible: false,
    currentMember: null,
    member: null
  };

  memberMenu = null;

  componentDidMount(){
    this.getPermissionAsync();

    this.load();

    analytics().logEvent("chat_detail");
  }

  async load(){
    await this.setState({ loading: true });

    const result = await axios.get("/moment/chat/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        id: this.props.route.params.id,
        expand: "members.member.account.avatar_thumbnail_url,picture_url"
      }
    });

    await this.setState({
      data: result.data.data,
      member: result.data.data.members.find(member => {
        return member.member_id == this.props.user.profile.id
      }),
      loading: false
    });

    return result;
  }

  sendImage = async (image) => {
    let formData = new FormData();

    let uriParts = image.split(".");
    let fileType = uriParts[uriParts.length - 1];
    let rand = (Math.random().toFixed(5) * 10000).toString();

    formData.append("uploaded_picture", {
      uri: image,
      name: `${rand}.${fileType}`,
      type: `image/${fileType}`
    });

    await axios.request({
      baseURL: config.baseUrl,
      url: "/moment/chat/chat-avatar",
      method: "POST",
      data: formData,
      params: {
        access_token: config.accessToken,
        expand: "avatar_thumbnail_url,avatar_picture_url",
        id: this.state.data.id
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  };

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
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        this.sendImage(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderHeader(){
    let image = require("../../assets/image-placeholder.png");

    if (this.state.image) {
      image = { uri: this.state.image };
    } else if (this.state.data.picture_url) {
      image = { uri: this.state.data.picture_url };
    }

    return <>
      <TouchableNativeFeedback onPress={() => this._pickImage()}>
        <ImageBackground source={image} style={styles.header}>
          <LinearGradient
            style={styles.headerContainer}
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}>
            <Text style={styles.title}>{this.state.data.title}</Text>
            <Text style={styles.time}>Created at: {moment(this.state.data.created_at * 1000).format("dddd, DD MMMM YYYY")}</Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableNativeFeedback>

      <View style={styles.sectionHeader}>
        <Text>{this.state.data.members.filter(member => member.is_joined).length} members are participate in this group</Text>
      </View>
    </>;
  }

  removeFromGroup(memberId){
    axios.request({
      baseURL: config.baseUrl,
      url: "/moment/chat/kick",
      method: "POST",
      params: {
        access_token: config.accessToken,
        id: this.state.data.id,
        member_id: memberId
      }
    }).then(() => {
      this.load();
    });
  }

  showMemberMenu(member){
    if (member.is_admin || !this.state.member?.is_admin) {
      return;
    }

    this.setState({
      isMenuVisible: true,
      currentMember: member
    });

    this.memberMenu.open();
  }

  closeMemberMenu(){
    this.setState({ isMenuVisible: false, currentMember: null });
  }

  renderMember({ item }){
    return (
      <>
        <TouchableNativeFeedback onPress={() => this.showMemberMenu(item)}>
          <View style={styles.user}>
            <Image style={styles.userAvatar} source={{ uri: item.member.account.avatar_thumbnail_url }} />
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{item.member.account.username}</Text>
              <Text style={styles.userFulllName}>{item.member.name}</Text>
            </View>
            {item.is_admin && <Text style={styles.adminBadge}>
              Group Admin
            </Text>}
          </View>
        </TouchableNativeFeedback>
      </>
    );
  }

  invite(){
    this.props.navigation.navigate("chat_invite", {
      id: this.props.route.params.id,
      onSave: () => this.load()
    });
  }

  async leave(){
    axios.request({
      baseURL: config.baseUrl,
      url: "/moment/chat/leave",
      method: "POST",
      params: {
        access_token: config.accessToken,
        id: this.state.data.id
      }
    });

    this.props.navigation.navigate("chat");
  }

  renderFooter(){
    return (
      <View style={styles.footer}>
        {this.state.member?.is_admin && <TouchableNativeFeedback onPress={() => this.invite()}>
          <View style={styles.action}>
            <Image style={styles.actionIcon} source={require("../../assets/icons/invite.png")} />
            <Text style={styles.actionText}>Invite Members</Text>
          </View>
        </TouchableNativeFeedback>}
        <TouchableNativeFeedback onPress={() => this.leave()}>
          <View style={styles.action}>
            <Image style={styles.actionIcon} source={require("../../assets/icons/logout.png")} />
            <Text style={{ ...styles.actionText, ...styles.dangerActionText }}>Leave Group</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  render(){

    return (
      <View style={styles.container}>
        <Selector
          visible={this.state.isMenuVisible}
          ref={component => this.memberMenu = component}
          onRequestClose={() => this.closeMemberMenu()}
          options={[
            { label: "Remove from Group", value: "N" }
          ]}
          onSelect={option => this.removeFromGroup(this.state.currentMember.member.id)}
        >
        </Selector>
        <FlatList
          style={styles.scroller}
          refreshing={this.state.loading}
          onRefresh={() => this.load()}
          data={this.state.data.members.filter(member => member.is_joined)}
          keyExtractor={member => member.member.id.toString()}
          ListHeaderComponent={this.renderHeader.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)}
          renderItem={(item) => this.renderMember(item)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default connect(mapStateToProps)(ChatDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  scroller: {
    flex: 1
  },
  header: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    justifyContent: "flex-end"
  },
  headerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 30
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold"
  },
  time: {
    color: "rgba(255,255,255,0.7)"
  },
  user: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#EEE"
  },
  userAvatar: {
    width: 50,
    height: undefined,
    aspectRatio: 1,
    marginRight: 15,
    borderRadius: 50
  },
  userName: {
    fontSize: 16,
    fontFamily: "QuicksandBold",
    marginBottom: 2
  },
  userFullName: {
    fontSize: 12
  },
  userMeta: {
    flex: 1
  },
  adminBadge: {
    color: "#33973e",
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderColor: "#33973e",
    borderWidth: 1,
    borderRadius: 5
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#FAFAFA"
  },
  footer: {
    borderTopWidth: 10,
    borderColor: "#EEE"
  },
  action: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#EEE"
  },
  actionIcon: {
    width: 25,
    height: undefined,
    aspectRatio: 1,
    marginRight: 10
  },
  actionText: {
    fontSize: 16
  },
  dangerActionText: {
    color: "red"
  }
});
