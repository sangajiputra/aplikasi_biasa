import React from "react";
import { Image, StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback, View } from "react-native";
import TextInput from "../../../common/TextInput";
import Text from "../../../common/Text";

export default class NoteItemCheck extends React.Component {
  state = {
    data: { ...this.props.data },
    index: this.props.index,
    faked: this.props.data.fake && !this.props.data.content
  };

  inputComponent;

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  async toggleCheck(){
    await this.setState({
      data: { ...this.state.data, is_checked: !this.state.data.is_checked }
    });

    this.changed();
  }

  async setContent(value){
    await this.setState({
      data: { ...this.state.data, content: value.replace(/\r?\n|\r/g,"") }
    });

    this.changed();
  }

  changed(){
    this.props.onChange(this.state.data, this.state.index);
  }

  delete(){
    this.props.onDelete(this.state.index);
  }

  async add(){
    await this.setState({ faked: false });

    this.inputComponent.focus();
  }

  onKeyPress(event){
    if(event.nativeEvent.key === 'Enter'){
      this.props.onAdd();
    }
  }

  render(){
    return (
      <View style={styles.item}>
        {!this.state.faked && (
          <>
            <TouchableNativeFeedback useForeground={true} background={TouchableNativeFeedback.SelectableBackgroundBorderless()} onPress={() => this.toggleCheck()}>
              <View style={{ ...styles.checkbox, ...(this.state.data.is_checked ? styles.checked : {}) }}>
                {!!this.state.data.is_checked && <Image style={styles.checkIcon} source={require("../../../assets/icons/check.png")} />}
              </View>
            </TouchableNativeFeedback>
            <TextInput ref={component => this.inputComponent = component?.input}
                       onChangeText={value => this.setContent(value)}
                       onKeyPress={event => this.onKeyPress(event)}
                       multiline={true}
                       style={{ ...styles.input, ...(this.state.data.is_checked ? styles.textChecked : {}) }}
                       value={this.state.data.content} />
            <TouchableNativeFeedback onPress={() => this.delete()}>
              <Image style={styles.delete} source={require("../../../assets/icons/close.png")} />
            </TouchableNativeFeedback>
          </>
        )}

        {this.state.faked && (
          <>
            <TouchableWithoutFeedback onPress={() => this.add()}>
              <View style={styles.fake}>
                <Text style={styles.fakeIcon}>+</Text>
                <Text style={styles.fakeText}>List Item</Text>
              </View>
            </TouchableWithoutFeedback>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    position: "relative"
  },
  checked: {
    backgroundColor: "#bae9ff",
    borderColor: "#3498df"
  },
  checkIcon: {
    tintColor: "#3498df"
  },
  textChecked: {
    textDecorationLine: "line-through",
    textDecorationColor: "red",
    textDecorationStyle: "solid"
  },
  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 1,
    borderColor: "#AAA",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingRight: 20,
    width: "100%",
    fontSize: 16
  },
  fake: {
    flexDirection: "row",
    alignItems: "center"
  },
  fakeIcon: {
    fontSize: 24,
    width: 20,
    textAlign: "center",
    opacity: 0.7
  },
  fakeText: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "100%",
    opacity: 0.7,
    fontSize: 16
  },
  delete: {
    position: "absolute",
    top: 13,
    right: 0,
    width: 16,
    height: 16,
    opacity: 0.35
  }
});
