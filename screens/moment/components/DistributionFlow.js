import React from "react";
import { Dimensions, StatusBar, View,StyleSheet } from "react-native";
import Pdf from "react-native-pdf";

export class DistributionFlow extends React.Component {
  render(){
    return (
      <View style={{flex: 1}}>
        <Pdf
          source={{uri:'https://archonproject.com/demo-moment/public/distribution-flow.pdf'}}
          style={styles.pdf} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pdf: {
    width: Dimensions.get("window").width,
    flex: 1,
    height: '100%'
  }
});
