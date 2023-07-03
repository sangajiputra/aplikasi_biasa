import React from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

export default class ELearningCheckout3dsScreen extends React.Component{

  componentWillUnmount(){
    this.props.route.params.callback();
  }

  render(){
    return (
      <View style={styles.container}>
        <WebView source={{ uri: this.props.route.params.url }}
                 style={styles.WebViewStyle}
                 javaScriptEnabled={true}
                 domStorageEnabled={true}
                 injectedJavaScript={`(function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify(window.location.href));
                })();`}
                 onMessage={(event) => {
                   if (event.nativeEvent.data.indexOf("moment/cart/payment-finish") !== -1) {
                     this.props.navigation.goBack();
                   }
                 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#CCC"
  }
});
