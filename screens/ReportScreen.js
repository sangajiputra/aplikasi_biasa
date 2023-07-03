import React from "react";
import { View,StyleSheet } from "react-native";
import WebView from "react-native-webview";

export default function ReportScreen(){
  const url = "https://moment2u.com/loginMember.do";

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }}
               style={styles.WebViewStyle}
               javaScriptEnabled={true}
               domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#CCC'
  },
});
