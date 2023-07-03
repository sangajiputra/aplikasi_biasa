import React from "react";
import { connect } from "react-redux";
import { deleteLead } from "../../states/actionCreators";
import { createStackNavigator } from "@react-navigation/stack";
import MeetingScreen from "./MeetingScreen";
import UpdateLeadScreen from "./UpdateLeadScreen";
import { Alert, Image, LayoutAnimation, StyleSheet, TouchableNativeFeedback, View } from "react-native";

const Stack = createStackNavigator();

export class ViewLeadScreen extends React.Component {

  state = {
    lead: {},
    deleteVisible: true
  };

  delete(){
    Alert.alert("Confirmation", "You are about to delete this lead, are you sure?", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            this.props.navigation.goBack();

            this.props.deleteLead(this.state.lead.id).then(result => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            });
          }
        }
      ],
      { cancelable: true }
    );

  }

  componentDidMount(){
    this.props.navigation.setOptions({
      headerTitle: this.state.lead.name,
      headerRight: () => {
        if (!this.state.deleteVisible) {
          return null;
        }

        return (
          <TouchableNativeFeedback onPress={() => this.delete()}>
            <View style={styles.action}>
              <Image style={styles.actionIcon} source={require("../../assets/icons/delete.png")} />
            </View>
          </TouchableNativeFeedback>
        );
      }
    });
  }

  static getDerivedStateFromProps(props, state){
    let _state = { ...state, lead: {} };

    if (props.route.params.id && Object.keys(state.lead).length === 0) {
      _state.lead = props.leads.find(_lead => _lead.id == props.route.params.id);

    }


      props.navigation.setOptions({
        headerRight: () => {
          if (props.route?.state?.routes && props.route?.state?.routes.findIndex(routeState => routeState.name === "lead_meeting") > -1) {
            return null;
          }

          return (
            <TouchableNativeFeedback onPress={() => this.delete()}>
              <View style={styles.action}>
                <Image style={styles.actionIcon} source={require("../../assets/icons/delete.png")} />
              </View>
            </TouchableNativeFeedback>
          );
        }
      });

    return _state;
  }

  render(){
    return (
      <Stack.Navigator
        screenOptions={route => ({
          headerShown: false,
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 0
              }
            },
            close: {
              animation: "timing",
              config: {
                duration: 0
              }
            }
          }
        })}
      >
        <Stack.Screen name="_update_lead" component={UpdateLeadScreen} initialParams={{ id: this.props.route.params.id }} />
        <Stack.Screen name="lead_meeting" component={MeetingScreen} initialParams={{ id: this.props.route.params.id }} />
      </Stack.Navigator>
    );
  }
}

const mapDispatchToProps = {
  deleteLead
};

const mapStateToProps = state => ({
  leads: state.lead.leads
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewLeadScreen);

const styles = StyleSheet.create({
  actionIcon: {
    width: 20,
    height: undefined,
    aspectRatio: 1,
    tintColor: "#d45e4a"
  }
});
