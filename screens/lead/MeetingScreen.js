import React from "react";
import { FlatList, Image, LayoutAnimation, RefreshControl, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Tab from "./component/Tab";
import { connect } from "react-redux";
import axios from "axios";
import config from "../../config";
import Text from "../../common/Text";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";

export class MeetingScreen extends React.Component {

  state = {
    data: {},
    meetings: [],
    refreshing: false
  };

  componentDidMount(){
    this.load().then(() => analytics().logEvent("lead_meeting_list"));
  }

  async refresh(){
    this.setState({ refreshing: true });

    await this.load();

    this.setState({ refreshing: false });
  }

  static getDerivedStateFromProps(props, state){
    if (props.route.params?.id && Object.keys(state.data).length === 0) {
      state.data = props.leads.find(lead => lead.id == props.route.params.id);
    }

    return state;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (prevProps.events !== this.props.events) {
      let derivedFromEvents = this.props.events.filter(event => event.lead_id == this.state.data.id);

      let _meetings = [...this.state.meetings];

      derivedFromEvents.forEach(event => {
        const currentIndex = _meetings.findIndex(meeting => meeting.id == event.id);

        if (currentIndex !== -1) {
          _meetings[currentIndex] = { ..._meetings[currentIndex], ...event };
        } else {
          _meetings.unshift(event);
        }
      });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      this.setState({
        meetings: _meetings
      });
    }
  }

  load(){
    return axios.get("/moment/event/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "picture_url",
        lead_id: this.state.data.id
      }
    }).then(response => {
      if (response.data.success) {
        this.setState({ meetings: response.data.data });
      }
    });
  }

  renderMeeting({ item }){
    return (
      <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("add_meeting", { event: item, callback: () => this.refresh() })}>
        <View style={styles.meeting}>
          <Image source={require("../../assets/icons/calendar.png")} style={styles.icon} />
          <View style={styles.meta}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.date}>{moment(item.date * 1000).format("dddd, DD-MM-YYYY")}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  render(){
    return (
      <View style={styles.container}>
        <Tab active="meeting" />
        <View style={styles.addButton}>
          <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("add_meeting", { lead_id: this.state.data.id, lead_name: this.state.data.name })}
                                   useForeground={true}>
            <Image style={styles.addButtonIcon} source={require("../../assets/icons/add.png")} />
          </TouchableNativeFeedback>
        </View>
        <FlatList
          data={this.state.meetings}
          renderItem={this.renderMeeting.bind(this)}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  leads: state.lead.leads,
  events: state.event.events
});

export default connect(mapStateToProps)(MeetingScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
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
  meeting: {
    padding: 15,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#EEE"
  },
  icon: {
    width: 28,
    height: undefined,
    aspectRatio: 1,
    marginRight: 15,
    tintColor: "#53a3ff"
  },
  name: {
    fontSize: 16,
    marginBottom: 3,
    fontFamily: "QuicksandBold"
  }
});
