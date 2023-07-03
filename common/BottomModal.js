import React from "react";
import { Animated, Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

export default class BottomModal extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      _visible: props.visible,
      visible: props.visible,
      stage: 0,
      slideAnimation: new Animated.Value(900),
      fadeAnimation: new Animated.Value(0)
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (prevProps.visible != this.props.visible) {
      this.setState({ visible: this.props.visible });
    }

    if (prevState.visible != this.state.visible) {
      if (this.state.visible) {
        this.setState({ _visible: true }, () => {
          this.animate();
        });
      } else {
        this.animate(() => {
          this.setState({ _visible: false });
        });
      }
    }
  }

  animate(callback = null){
    Animated.parallel([
      Animated.timing(this.state.slideAnimation, {
        duration: 300,
        toValue: this.state.visible ? 0 : 900
      }),
      Animated.timing(this.state.fadeAnimation, {
        duration: 300,
        toValue: this.state.visible ? 1 : 0
      })
    ]).start(callback);
  }

  close(){
    const shouldClose = this.props.onRequestClose();

    if(shouldClose === true || shouldClose === undefined){
      this.setState({ visible: false });
    }
  }

  render(){
    return (
      <Modal {...this.props}
             animationType="none"
             visible={this.state._visible}
             style={{ ...this.props.style }}
             onRequestClose={() => {
               this.close();
             }}
      >

        <Animated.View style={{ ...styles.overlay, opacity: this.state.fadeAnimation }} />

        <View style={styles.container}>
          <View style={{ ...styles.spacer }}>
            <TouchableWithoutFeedback onPress={() => this.close()}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
          </View>
          <Animated.View style={{ ...styles.content, transform: [{ translateY: this.state.slideAnimation }] }}>
            {this.props.children}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    flexDirection: "column"
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  spacer: {
    flex: 1,
    flexGrow: 1
  },
  content: {
    backgroundColor: "#FFF",
    elevation: 5,
    borderRadius: 15,
    overflow: 'hidden',
    margin: 10
  }
});
