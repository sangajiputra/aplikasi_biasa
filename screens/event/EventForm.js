import React, { Fragment } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../common/Text";
import TextInput from "../../common/TextInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { connect } from "react-redux";
import { deleteEvent, getEvent, saveEvent } from "../../states/actionCreators";
import analytics from "@react-native-firebase/analytics";

export class EventForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      isCalendarShowd: false,
      isTimePickerShowed: false,
      date: new Date(),
      data: {},
      errors: {}
    };

    if (props.route.params?.id) {
      const event = props.events.find(event => event.id == props.route.params.id);

      if (event) {
        this.state.data = event;
      }
    } else if (props.route.params?.event) {
      this.state.data = props.route.params.event;
    }

    if (this.state.data?.date) {
      this.state.date = new Date(this.state.data.date * 1000);
    }
  }

  delete(){
    Alert.alert("Confirmation", "You are about to delete this note, are you sure?", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            this.props.navigation.goBack();

            this.props.deleteEvent(this.state.data.id).then(() => {
              if(this.props.route.params.callback){
                this.props.route.params.callback();
              }
            });
          }
        }
      ],
      { cancelable: true }
    );
  }

  componentDidMount(){
    if (this.props.route.params?.lead_id) {
      this.setState({
        data: {
          ...this.state.data,
          lead_id: this.props.route.params.lead_id,
          lead: {
            name: this.props.route.params.lead_name
          }
        }
      });
    }

    if (this.state.data.lead_id && !this.state.data.lead) {
      this.props.getEvent({
        id: this.state.data.id,
        expand: "picture_url,lead"
      }).then(result => {
        if (result.payload.data.success) {
          this.setState({ data: result.payload.data.data });
        }
      });
    }

    if (this.state.data.id) {
      this.props.navigation.setOptions({
        headerTitle: this.state.data.name,
        headerRight: () => {
          return (
            <TouchableNativeFeedback onPress={() => this.delete()}>
              <View style={styles.topBarAction}>
                <Image style={styles.topBarActionIcon} source={require("../../assets/icons/delete.png")} />
              </View>
            </TouchableNativeFeedback>
          );
        }
      });
    }


    analytics().logEvent('event_form');
  }

  async onDateChange(selectedDate){
    const currentDate = selectedDate || this.state.date;

    this.setState({ isCalendarShowed: Platform.OS === "ios" });
    await this.setState({ date: currentDate });
    this.setState({ isTimePickerShowed: Platform.OS !== "ios" });
  };

  onTimeChange(selectedTime){
    this.setState({ isTimePickerShowed: false });

    let date = this.state.date;

    date.setHours(selectedTime.getHours());
    date.setMinutes(selectedTime.getMinutes());
    date.setSeconds(selectedTime.getSeconds());

    this.setState({ date: date });
  }

  save(){
    this.setState({ loading: true });

    return this.props.saveEvent({
      name: this.state.data.name,
      description: this.state.data.description,
      address: this.state.data.address,
      lead_id: this.state.data.lead_id,
      date: moment(this.state.date).format("YYYY-MM-DD HH:mm")
    }, this.state.data.id).then(result => {
      this.setState({ loading: false });

      if (result.payload.data.success) {
        this.props.navigation.goBack();
      } else {
        this.setState({ errors: result.payload.data.data });
      }

      if(this.props.route.params.callback){
        this.props.route.params.callback();
      }
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <ScrollView style={styles.form}>
          <View style={formStyles.section}>
            <Text style={formStyles.label}>
              Event Name
            </Text>
            <View style={formStyles.inputContainer}>
              <TextInput style={formStyles.textInput}
                         autoFocus={!this.state.data.id}
                         placeholder="Eg: meeting with new prospect"
                         value={this.state.data.name}
                         onChangeText={value => this.setState({ data: { ...this.state.data, name: value } })}
                         placeholderTextColor="#CCC"
              />
            </View>
            {this.state.errors.name && <Text style={formStyles.validation}>{this.state.errors.name}</Text>}
          </View>

          {(this.props.route.params?.lead_id || this.state.data.lead?.name) && (
            <View style={formStyles.section}>
              <Text style={formStyles.label}>
                Related to Lead
              </Text>
              <View style={formStyles.inputContainer}>
                {(this.state.data.lead?.name && !this.props.route.params?.lead_id) &&
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("lead", { screen: "update_lead", params: { id: this.state.data.lead_id } })}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <TextInput editable={false}
                               value={this.state.data.lead?.name}
                               style={formStyles.textInput} />
                    <Image style={{ width: 16, aspectRatio: 1, height: undefined }}
                           source={require("../../assets/icons/chevron-right-black.png")} />
                  </View>
                </TouchableNativeFeedback>
                }
                {this.props.route.params?.lead_id &&
                <TextInput editable={false}
                           value={this.state.data.lead?.name}
                           style={formStyles.textInput} />
                }
              </View>
              {this.state.errors.lead_id && <Text style={formStyles.validation}>{this.state.errors.lead_id}</Text>}
            </View>)
          }

          <View style={formStyles.section}>
            <Text style={formStyles.label}>
              Event Date
            </Text>
            <View style={formStyles.inputContainer}>
              <Text style={formStyles.textInput}
                    onPress={() => this.setState({ isCalendarShowed: true })}
              >
                {moment(this.state.date).format("dddd, DD-MM-YYYY HH:mm")}
              </Text>
              {this.state.isCalendarShowed && (
                <DateTimePicker
                  testID="dateTimePicker"
                  mode="datetime"
                  value={this.state.date}
                  is24Hour={true}
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, date) => this.onDateChange(date)}
                />
              )}

              {this.state.isTimePickerShowed && (
                <DateTimePicker
                  testID="dateTimePicker"
                  mode="time"
                  value={this.state.date}
                  is24Hour={true}
                  display="spinner"
                  minimumDate={new Date()}
                  onChange={(event, date) => this.onTimeChange(date)}
                />
              )}
            </View>
            {this.state.errors.date && <Text style={formStyles.validation}>{this.state.errors.date}</Text>}
          </View>

          <View style={formStyles.section}>
            <Text style={formStyles.label}>
              Event Description
            </Text>
            <View style={formStyles.inputContainer}>
              <TextInput style={formStyles.textInput}
                         placeholder="Eg: Presentation to the new prospect"
                         value={this.state.data.description}
                         multiline={true}
                         numberOfLines={4}
                         onChangeText={value => this.setState({ data: { ...this.state.data, description: value } })}
                         placeholderTextColor="#CCC"
              />
            </View>
            {this.state.errors.description && <Text style={formStyles.validation}>{this.state.errors.description}</Text>}
          </View>

          <View style={formStyles.section}>
            <Text style={formStyles.label}>
              Event Location
            </Text>
            <View style={formStyles.inputContainer}>
              <TextInput style={formStyles.textInput}
                         placeholder="Eg: Coffe Shop Tunjungan Plaza"
                         value={this.state.data.address}
                         multiline={true}
                         numberOfLines={4}
                         onChangeText={value => this.setState({ data: { ...this.state.data, address: value } })}
                         placeholderTextColor="#CCC"
              />
            </View>
            {this.state.errors.address && <Text style={formStyles.validation}>{this.state.errors.address}</Text>}
          </View>
        </ScrollView>

        {/* START OF ACTION*/}

        <View style={styles.action}>
          <TouchableNativeFeedback disabled={this.state.isLoading} onPress={() => this.save()}>
            <View style={styles.saveButton}>
              {this.state.loading ? <ActivityIndicator color="#FFF" size={26} /> : <Fragment>
                <Image source={require("../../assets/icons/send.png")} style={styles.saveButtonIcon} />
                <Text style={styles.saveButtonText}>Save</Text>
              </Fragment>
              }
            </View>
          </TouchableNativeFeedback>
        </View>

        {/* END OF ACTION*/}
      </View>
    );
  }
}

const mapDispatchToProps = {
  saveEvent,
  getEvent,
  deleteEvent
};

const mapStateToProps = state => ({
  events: state.event.events
});

export default connect(mapStateToProps, mapDispatchToProps)(EventForm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  form: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  action: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#FFF"
  },
  saveButton: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    backgroundColor: "#3498df",
    borderRadius: 5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  saveButtonText: {
    fontSize: 20,
    color: "#FFF",
    lineHeight: 20
  },
  saveButtonIcon: {
    marginRight: 10,
    width: 26,
    height: undefined,
    aspectRatio: 1
  },
  topBarActionIcon: {
    width: 20,
    height: undefined,
    aspectRatio: 1,
    tintColor: "#d45e4a"
  }
});

const formStyles = StyleSheet.create({
  section: {
    paddingTop: 10,
    marginBottom: 8
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#EEE",
    marginBottom: 0
    // flex: 1
  },
  label: {
    fontSize: 14,
    color: "#888"
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 10,
    textAlignVertical: "top"
  },
  validation: {
    color: "#d55a46"
  }
});
