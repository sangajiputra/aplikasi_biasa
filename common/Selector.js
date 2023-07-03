import React from "react";
import { FlatList, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import BottomModal from "./BottomModal";
import Text from "./Text";

export default class Selector extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      selected: {},
      visible: false
    };
  }

  static getDerivedStateFromProps(props, state){
    let _state = { ...state };

    if (props.value) {
      _state.selected = props.options.find(option => option.value == props.value);
    }

    return _state;
  }

  close(){
    this.setState({ visible: false });
  }

  open(){
    this.setState({ visible: true });
  }

  select(option){
    this.setState({ selected: option }, () => {
      if (this.props.onSelect) {
        this.props.onSelect(option);
      }

      this.close();
    });
  }

  getSelected(){
    return this.state.selected;
  }

  renderOption(option){
    return (
      <TouchableNativeFeedback delayPressIn={0} onPress={() => this.select(option)}>
        <View style={styles.option}>
          <Text style={styles.optionText}>{option.label}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  render(){
    return (
      <BottomModal
        onRequestClose={() => this.close()}
        visible={this.state.visible}
        transparent={true}
      >
        <View style={styles.container}>
          {this.props.title && <View style={styles.title}>
            <Text style={styles.titleText}>{this.props.title}</Text>
          </View>}
          <FlatList
            data={this.props.options}
            renderItem={item => this.renderOption(item.item)}
            keyExtractor={item => item.value.toString()}
          />
        </View>
      </BottomModal>
    );
  }
}

export const styles = StyleSheet.create({
  option: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  optionText: {
    fontSize: 15,
    flex: 1,
    flexShrink: 0
  },
  optionIcon: {
    width: 16,
    height: undefined,
    aspectRatio: 1,
    marginRight: 13,
    marginVertical: -2
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1
  },
  title: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDD",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    alignItems: 'center',
  },
  titleIcon: {
    width: 18,
    height: undefined,
    aspectRatio: 1
  },
  titleIconLeft: {
    marginRight: 5
  }
});
