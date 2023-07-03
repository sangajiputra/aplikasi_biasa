import React from "react";
import { Image, TouchableNativeFeedback } from "react-native";
import * as ImagePicker from "expo-image-picker/build/ImagePicker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

export default class PhotoPicker extends React.Component {
  state = {
    image: null
  };

  render(){
    let { image } = this.state;

    let source = this.props.default ? this.props.default : require("../assets/avatar.png");

    if(image) {
      source = { uri: image };
    }else if(this.props.value){
      source = this.props.value;
    }

    return (
      <TouchableNativeFeedback delayPressIn={0} onPress={() => this._pickImage()}>
        <Image {...this.props} source={source} />
      </TouchableNativeFeedback>
    );
  }

  componentDidMount(){
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: this.props.ratio ? this.props.ratio : [1, 1],
        quality: 0.9
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });

        if(this.props.onPick){
          this.props.onPick(result.uri)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}
