import React, { Fragment } from "react";
import { ActivityIndicator, Image, ImageBackground, KeyboardAvoidingView, LayoutAnimation, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { connect } from "react-redux";
import Text from "../../common/Text";
import TextInput from "../../common/TextInput";
import moment from "moment/moment";
import { saveGoal, showNav, setCurrentGoal } from "../../states/actionCreators";
import axios from "axios";
import config from "../../config";
import PhotoPicker from "../../common/PhotoPicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInputMask } from "react-native-masked-text";

export class GoalUpdateScreen extends React.Component {
  valueInput = null;

  current = false;

  constructor(props){
    super(props);

    this.state = {
      id: null,
      name: "",
      value: "",
      description: "",
      deadline: new Date(),
      createdAt: new Date(),
      photo: null,
      isLoading: false,
      isCalendarShowed: false,
      estimations: []
    };
  }

  componentDidMount(){
    if (this.props.route.params && this.props.route.params.current) {
      this.current = true;
    }

    this.props.showNav(false);

    if (this.props.route.params && this.props.route.params.id) {
      axios.get("/moment/goal/get", {
        baseURL: config.baseUrl,
        params: {
          access_token: config.accessToken,
          id: this.props.route.params.id,
          expand: "photo_thumbnail_url"
        }
      }).then(response => {
        if (response.data.success && response.data.data) {
          let deadlineAt = moment(response.data.data.deadline * 1000);
          let createdAt = moment(response.data.data.created_at * 1000);

          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

          this.setState({
            id: response.data.data.id,
            name: response.data.data.name,
            description: response.data.data.description,
            deadline: deadlineAt.toDate(),
            value: response.data.data.value,
            _value: "",
            photo: response.data.data.photo_thumbnail_url,
            createdAt: createdAt.toDate()
          });
        }
      });
    }
  }

  componentWillUnmount(){
    this.props.showNav(true);
  }

  deadlineToDate(){
    return moment(this.state.deadline).format("YYYY-MM-DD");
  }

  onDateChange(selectedDate){
    const currentDate = selectedDate || this.state.deadline;

    this.setState({ isCalendarShowed: Platform.OS === "ios" });
    this.setState({ deadline: currentDate });
  };

  save(){
    this.setState({ isLoading: true });

    this.props.saveGoal({
      name: this.state.name,
      value: this.valueInput.getRawValue(),
      description: this.state.description,
      uploaded_photo: this.state.photo,
      deadline: this.deadlineToDate()
    }, this.state.id).then(result => {
      let data = result.error ? result.error.response.data : result.payload.data;

      if (data.success) {
        if (!this.state.id || this.current) {
          this.props.setCurrentGoal(data.data);
        }

        this.props.navigation.goBack();
      }

    }).finally(result => {
      this.setState({ isLoading: false });
    });
  };

  render(){
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <ImageBackground style={styles.headerBackground} source={require("../../assets/bg/header.png")}>
              <PhotoPicker default={require("../../assets/icons/goal-placeholder.png")}
                           onPick={value => {this.setState({ photo: value });}}
                           value={this.state.photo ? { uri: this.state.photo } : null}
                           style={styles.picture} />
            </ImageBackground>
          </View>

          <View style={styles.form}>
            <View style={formStyles.section}>
              <Text style={formStyles.label}>
                What are you dream of?
              </Text>
              <View style={formStyles.inputContainer}>
                <TextInput style={formStyles.textInput}
                           value={this.state.name} onChangeText={(value) => this.setState({ name: value })}
                           placeholder="eg: New Smartphone, Travelling"
                           placeholderTextColor="#CCC"
                />
              </View>
            </View>
            <View style={formStyles.section}>
              <Text style={formStyles.label}>
                How much is it?
              </Text>
              <View style={formStyles.inputContainer}>
                <TextInputMask
                  type={"money"}
                  style={formStyles.textInput}
                  ref={(ref) => this.valueInput = ref}
                  options={{
                    precision: 0,
                    separator: ",",
                    delimiter: ".",
                    unit: "Rp. ",
                    suffixUnit: ""
                  }}
                  value={this.state.value.toString()}
                  placeholder="eg: 4000000"
                  placeholderTextColor="#CCC"
                  keyboardType="decimal-pad"
                  onChangeText={(text, a) => {
                    this.setState({ value: text });
                  }}
                />
              </View>
            </View>
            <View style={formStyles.section}>
              <Text style={formStyles.label} onPress={() => this.deadlineInput.input.focus()}>
                When exactly do you want it? {this.state.deadline && <Text>({moment(this.state.deadline).set({ minutes: 59, second: 59, hours: 23 }).fromNow()})</Text>}
              </Text>
              <View style={formStyles.inputContainer}>
                <View style={styles.deadlineContainer}>

                  {this.state.isCalendarShowed && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={this.state.deadline}
                      is24Hour={true}
                      display="default"
                      minimumDate={new Date()}
                      onChange={(event, date) => this.onDateChange(date)}
                    />
                  )}
                  <Text onPress={() => this.setState({ isCalendarShowed: true })}
                        style={{ ...formStyles.textInput, flex: 1 }}
                  >
                    {moment(this.state.deadline).format("dddd, DD-MM-YYYY")}
                  </Text>
                </View>
              </View>
            </View>
            <View style={formStyles.section}>
              <Text style={formStyles.label}>
                Describe why do you want it so bad?
              </Text>
              <View style={formStyles.inputContainer}>
                <TextInput style={formStyles.textInput}
                           multiline={true}
                           numberOfLines={3}
                           placeholderTextColor="#CCC"
                           value={this.state.description}
                           onChangeText={(value) => this.setState({ description: value })}
                           placeholder="Remembering why you want it in the first place can help you to stay  motivated"
                />
              </View>
            </View>

          </View>

          <View style={styles.action}>
            <TouchableNativeFeedback disabled={this.state.isLoading} onPress={() => this.save()}>
              <View style={styles.saveButton}>
                {this.state.isLoading ? <ActivityIndicator color="#FFF" size={26} /> : <Fragment>
                  <Image source={require("../../assets/icons/send.png")} style={styles.saveButtonIcon} />
                  <Text style={styles.saveButtonText}>Set the Dream</Text>
                </Fragment>
                }
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = {
  saveGoal,
  setCurrentGoal,
  showNav
};
export default connect(null, mapDispatchToProps)(GoalUpdateScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center"
  },
  headerBackground: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 80,
    alignItems: "center",
    justifyContent: "center"
  },
  picture: {
    width: 150,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.6)"
  },
  form: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    paddingTop: 15
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
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  deadlineSuffix: {
    fontSize: 18,
    flex: 1
  }
});

const formStyles = StyleSheet.create({
  section: {
    borderBottomWidth: 2,
    borderBottomColor: "#DDD",
    paddingTop: 10
  },
  label: {
    fontSize: 14,
    color: "#888"
  },
  labelEmoji: {
    fontSize: 20
  },
  textInput: {
    fontSize: 18,
    paddingVertical: 13,
    textAlignVertical: "top"
  }

});
