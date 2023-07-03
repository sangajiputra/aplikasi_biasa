import React from "react";
import { ActivityIndicator, FlatList, Image, LayoutAnimation, TouchableNativeFeedback, View } from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import config from "../../config";
import Text from "../../common/Text";
import TextInput from "../../common/TextInput";

export class ChatInviteScreen extends React.Component {
  state = {
    searchQuery: "",
    users: [],
    page: 1,
    fullLoaded: false,
    loading: false,
    selectedUsers: [],
    inviting: false
  };

  searchTimeout = null;
  searchInput;

  componentDidMount(){
  }

  async invite(){
    const qs = require("qs");

    await this.setState({ inviting: true });

    const result = await axios.request({
      url: "/moment/chat/invite",
      method: "POST",
      baseURL: config.baseUrl,
      data: qs.stringify({
        member_ids: this.state.selectedUsers.map(user => user.id)
      }),
      params: {
        id: this.props.route.params.id,
        access_token: config.accessToken
      }
    });

    if (result.data.success) {
      if (this.props.route.params.onSave) {
        this.props.route.params.onSave();
      }

      this.props.navigation.goBack();
    }
  }

  async requestUsers(){
    if (!this.state.searchQuery) {
      return {};
    }

    await this.setState({ loading: true });

    const result = await axios.get("/moment/member/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        username: this.state.searchQuery,
        page: this.state.page,
        page_size: 20,
        expand: "account,account.avatar_thumbnail_url"
      }
    });

    await this.setState({
      loading: false,
      fullLoaded: this.state.page === result.data.pagination.page_count
    });

    return result;
  }

  async search(query){
    await this.setState({ searchQuery: query });

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(async () => {

      await this.loadUsers();

      this.searchTimeout = null;
    }, 300);
  }

  async loadUsers(push = false){
    if (push) {
      await this.setState({ page: this.state.page + 1 });
    }

    const result = await this.requestUsers();

    const users = result?.data?.data ? result.data.data : [];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (push) {
      this.setState({ users: [...this.state.users, ...users] });
    } else {
      this.setState({ users: users });
    }

    return result;
  }

  isSelected(user){
    return this.state.selectedUsers.findIndex(selectedUser => selectedUser.id === user.id) !== -1;
  }

  async unselect(user){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    await this.setState({
      selectedUsers: this.state.selectedUsers.filter(selectedUser => selectedUser.id !== user.id)
    });
  }

  async select(user){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    await this.setState({
      selectedUsers: [user, ...this.state.selectedUsers]
    });

    if (this.state.searchQuery) {
      this.search("");
    }
  }

  toggleSelect(user){
    if (this.isSelected(user)) {
      this.unselect(user);
    } else {
      this.select(user);
    }
  }

  renderUser({ item }){
    return (
      <TouchableNativeFeedback onPress={() => this.toggleSelect(item)}>
        <View style={styles.user}>
          <Image style={styles.userAvatar} source={{ uri: item.account.avatar_thumbnail_url }} />
          <View style={styles.userMeta}>
            <Text style={styles.userName}>{item.account.username}</Text>
            <Text style={styles.userFulllName}>{item.name}</Text>
          </View>
          <View style={{
            ...styles.check,
            ...(this.isSelected(item) ? styles.checked : {})
          }}>
            <Image style={styles.checkIcon} source={require("../../assets/icons/check.png")} />
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  renderSelectedUser({ item }){
    return (
      <TouchableNativeFeedback onPress={() => this.unselect(item)}>
        <View style={styles.selectedUser}>
          <Image style={styles.selectedUserAvatar} source={{ uri: item.account.avatar_thumbnail_url }} />
          <Text style={styles.selectedUserName}>{item.account.username}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  render(){
    let content = (
      <View style={styles.container}>
        <View style={styles.addButton}>
          <TouchableNativeFeedback onPress={() => this.invite()}
                                   useForeground={true}>
            <Image style={styles.addButtonIcon} source={require("../../assets/icons/next.png")} />
          </TouchableNativeFeedback>
        </View>

        {this.state.selectedUsers.length > 0 && <FlatList
          horizontal={true}
          data={this.state.selectedUsers}
          showsHorizontalScrollIndicator={false}
          style={styles.selectedUsers}
          keyExtractor={user => user.id.toString()}
          renderItem={this.renderSelectedUser.bind(this)}
        />}

        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <Image style={styles.searchIcon} source={require("../../assets/icons/search.png")} />
            <TextInput onChangeText={value => this.search(value)}
                       ref={searchInput => this.searchInput = searchInput}
                       placeholderTextColor="#BBB"
                       autoFocus={true}
                       value={this.state.searchQuery}
                       style={styles.searchInput}
                       placeholder="Search member..." />
          </View>
        </View>

        {
          this.state.searchQuery.length > 0 && <FlatList
            style={styles.users}
            data={this.state.users}
            renderItem={this.renderUser.bind(this)}
            keyExtractor={user => user.id.toString()}
            initialNumToRender={20}
            onRefresh={() => this.loadUsers()}
            refreshing={this.state.loading}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={"always"}
            onEndReached={() => !this.state.fullLoaded && !this.state.loading && this.loadUsers(true)}
          />
        }

        {
          this.state.searchQuery.length === 0 && <View style={styles.hero}>
            <Image source={require("../../assets/icons/forum.png")} style={styles.heroImage} />
            <Text style={styles.heroText}>Invite member to this group</Text>
          </View>
        }
      </View>
    );

    if(this.state.inviting){
      content = (
        <View style={styles.containerLoading}>
          <ActivityIndicator style={styles.loadingIndicator} color="#0000ff" size={30} />
          <Text style={styles.loadingText}>Inviting Members to Chat...</Text>
        </View>
      );
    }

    return (
      <>
        {content}
        </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ChatInviteScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  users: {
    flex: 1,
    flexGrow: 1
  },
  selectedUsers: {
    flexShrink: 1,
    flexGrow: 0,
    backgroundColor: "#EEE",
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  user: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center"
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
  selectedUser: {
    alignItems: "center",
    paddingHorizontal: 5,
    marginRight: 10
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
  search: {
    borderRadius: 10,
    fontSize: 16,
    elevation: 5,
    backgroundColor: "#FFF",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15
  },
  searchInput: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1
  },
  searchContainer: {
    padding: 10,
    paddingTop: 13,
    paddingBottom: 13,
    position: "relative"
  },
  searchIcon: {
    width: 25,
    aspectRatio: 1,
    height: undefined,
    tintColor: "#CCC"
  },
  check: {
    borderWidth: 3,
    borderColor: "#DDD",
    borderRadius: 2,
    width: 20,
    height: 20
  },
  checked: {
    borderColor: "#3498df",
    backgroundColor: "#3498df"
  },
  userMeta: {
    flex: 1
  },
  checkIcon: {
    width: 14,
    height: undefined,
    aspectRatio: 1,
    tintColor: "#FFF"
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
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  heroImage: {
    width: 200,
    height: undefined,
    aspectRatio: 1,
    marginBottom: 15
  },
  heroText: {
    fontSize: 20
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
};
