import React from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../../common/Text";

export default class Toggle extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      active: props.default ? props.default : null
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (prevState.active != this.state.active) {
      this.props.onChange(this.state.active);
    }
  }

  activate(value){
    this.setState({ active: value });
  }

  isActive(value){
    return this.state.active == value;
  }

  render(){
    return (
      <View style={styles.container}>
        {this.props.items.map(item => (
          <TouchableNativeFeedback key={item.value} delayPressIn={0} onPress={() => this.activate(item.value)}>
            <View style={{ ...styles.item, ...(this.isActive(item.value) ? styles.activeItem : {}) }}>
              <Text style={{ ...styles.itemText, ...(this.isActive(item.value) ? styles.activeItemText : {}) }}>{item.label}</Text>
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
  item: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  activeItem: {
    borderColor: "#888",
    backgroundColor: '#EEE'
  }
});
