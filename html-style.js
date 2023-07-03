import { Linking } from "react-native";

export function HTMLOpenLink(event, link){
  Linking.canOpenURL(link).then(supported => {
    if (supported) {
      Linking.openURL(link);
    } else {
      console.log("Don't know how to open URI: " + this.props.url);
    }
  });
}

const baseFontStyle = {
  lineHeight: 24,
  color: "#555",
  fontSize: 15,
  fontFamily: 'QuicksandSemiBold'
};

export default baseFontStyle;
