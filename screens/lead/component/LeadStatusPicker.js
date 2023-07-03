import React from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../../common/Text";

export default class LeadStatusPicker extends React.Component {
  static STATUS_WARM = "W";
  static STATUS_HOT = "H";
  static STATUS_COLD = "C";
  static STATUS_CONVERTED = "X";

  static STATUSES = [
    {
      value: LeadStatusPicker.STATUS_COLD,
      "label": "Cold",
      color: "#95b3ff",
      softColor: "#ebf2ff"
    },
    {
      value: LeadStatusPicker.STATUS_WARM,
      "label": "Warm",
      color: "#dc7858",
      softColor: "#ffe3b6"
    },
    {
      value: LeadStatusPicker.STATUS_HOT,
      "label": "Hot",
      color: "#f04a59",
      softColor: "#ffcccf"
    },
    {
      value: LeadStatusPicker.STATUS_CONVERTED,
      "label": "Converted",
      color: "#74ce67",
      softColor: "#deffdc"
    }
  ];

  static getStatusOption(id){
    return LeadStatusPicker.STATUSES.find(status => status.value == id);
  }

  constructor(props){
    super(props);

    this.state = {
      selected: props.value ? props.value : null
    };
  }

  select(value){
    this.setState({ selected: value });

    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
  }

  render(){
    return (
      <View style={styles.container}>
        {LeadStatusPicker.STATUSES.map(status => (
          <TouchableNativeFeedback useForeground={true}
                                   key={status.value}
                                   delayPressIn={0}
                                   onPress={() => this.select(status.value)}>
            <View style={{
              ...styles.status,
              ...(this.state.selected === status.value ? {
                backgroundColor: status.softColor,
                borderColor: status.color,
                borderLeftWidth: 5
              } : {
                backgroundColor: status.softColor,
                borderColor: status.softColor,
                borderLeftWidth: 5
              })
            }}>
              <Text style={{
                ...styles.statusText,
                ...(this.state.selected === status.value ? {
                  color: status.color,
                  fontWeight: "bold"
                } : {
                  color: status.color
                })
              }}>
                {status.label}
              </Text>
            </View>
          </TouchableNativeFeedback>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    // borderWidth: 1,
    borderColor: "#AAA",
    marginRight: 10,
    borderRadius: 5
  },
  statusText: {
    fontSize: 16,
    lineHeight: 26
  }
});
