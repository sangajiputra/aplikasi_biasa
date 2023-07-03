import React from "react";
import moment from "moment";
import { Image, StatusBar, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../common/Text";
import { Agenda } from "react-native-calendars";
import { getEvent } from "../../states/actionCreators";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import App from "../../App";
import analytics from "@react-native-firebase/analytics";

export class EventListScreen extends React.Component {
  state = {
    events: {},
    markedDates: {},
    from: null,
    to: null
  };

  componentDidMount(){
    this.props.navigation.addListener("focus", EventListScreen.setStatusBar);
    this.props.navigation.addListener("blur", App.setDefaultStatusBar);


    analytics().logEvent('event_list');
  }

  componentWillUnmount(){
    this.props.navigation.removeListener("focus", EventListScreen.setStatusBar);
    this.props.navigation.removeListener("blur", App.setDefaultStatusBar);
  }

  static setStatusBar(){
    StatusBar.setBackgroundColor("rgba(255,255,255,1)");
    StatusBar.setBarStyle("dark-content");
    StatusBar.setTranslucent(true);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (prevProps.events !== this.props.events) {
      this.reformatEvents();
    }
  }

  reformatEvents(){
    let _events = this.state.events;
    let _markedDates = {};

    this.props.events.forEach(event => {
      let date = moment(event.date * 1000).format("YYYY-MM-DD");

      if (typeof _events[date] === "undefined") {
        _events[date] = [];
      }

      if (typeof _markedDates[date] === "undefined") {
        _markedDates[date] = { dots: [] };
      }

      if (event.type === "U") {
        if(event.lead_id){
          _markedDates[date].dots.push({ color: "#ffaa4b" });
        }else{
          _markedDates[date].dots.push({ color: "#ff5b76" });
        }
      } else {
        _markedDates[date].dots.push({ color: "#45e9ff" });
      }

      const currentEventIndex = _events[date].findIndex(current => current.id == event.id);

      if (_events[date].length === 0 || currentEventIndex === -1) {
        _events[date].push(event);
      } else {
        _events[date][currentEventIndex] = {
          ..._events[date][currentEventIndex],
          ...event
        };
      }
    });

    let from = this.state.from.clone();
    let to = this.state.to.clone();

    while (from < to) {
      let date = from.format("YYYY-MM-DD");

      if (typeof _events[date] === "undefined") {
        _events[date] = [];
      }

      from.add(1, "d");
    }

    this.setState({ events: _events, markedDates: _markedDates });
  };

  load(month){
    let start = moment(month.timestamp).subtract(2, "month").startOf("month");
    let end = moment(month.timestamp).add(2, "month").endOf("month");

    this.setState({
      from: start < this.state.from || this.state.from === null ? start : this.state.from,
      to: end > this.state.to || this.state.to === null ? end : this.state.to
    });

    this.props.getEvent({
      date_start: start.format("YYYY-MM-DD"),
      date_end: end.format("YYYY-MM-DD"),
      page_size: 500
    });
  };

  renderEvent(item){
    let color = "#ff5b76";

    if (item.type === "C") {
      color = "#45e9ff";
    }else if(item.lead_id){
      color= '#ffaa4b';
    }

    return (
      <TouchableNativeFeedback onPress={() => {
        if (item.type == "U") {
          this.props.navigation.navigate("add_event", { "id": item.id });
        } else {
          this.props.navigation.navigate("event_detail", { "id": item.id, "title": item.name });
        }
      }}>
        <View style={{ ...styles.event, borderLeftWidth: 4, borderColor: color }}>
          <Text style={styles.eventName}>{item.name}</Text>
          {item.lead_id ? <Text style={styles.lead}>With: {item.lead.name}</Text> : null}
          {item.description ? <Text style={styles.eventDescription}>{item.description}</Text> : null}
        </View>
      </TouchableNativeFeedback>
    );
  };

  render(){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.addButton}>
          <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("add_event")}
                                   useForeground={true}>
            <Image style={styles.addButtonIcon} source={require("../../assets/icons/add.png")} />
          </TouchableNativeFeedback>
        </View>

        <Agenda
          items={this.state.events}
          renderItem={(item) => this.renderEvent(item)}
          loadItemsForMonth={(month) => this.load(month)}
          markedDates={this.state.markedDates}
          markingType={"multi-dot"}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  events: state.event.events,
  loading: state.event.loading
});

const mapDispatchToProps = {
  getEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(EventListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height: StatusBar.currentHeight,
    backgroundColor: "#FFF"
  },
  event: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    elevation: 1
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold"
  },
  eventDescription: {
    color: "#888"
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
  }
});
