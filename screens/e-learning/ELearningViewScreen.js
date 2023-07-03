import React from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import axios from "axios";
import config from "../../config";
import Pdf from "react-native-pdf";
import Text from "../../common/Text";
import Video from "react-native-video";
import { showNav } from "../../states/actionCreators";
import { connect } from "react-redux";
import * as ScreenOrientation from "expo-screen-orientation";
import analytics from "@react-native-firebase/analytics";

export class ELearningViewScreen extends React.Component {
  state = {
    data: {},
    isLoaded: false
  };

  componentDidMount(){
    this.load().then(data => analytics().logEvent("e_learning_view", {id: data.id,name:data.name}));
  }

  componentWillUnmount(){
    this.props.showNav(true);
    ScreenOrientation.unlockAsync();
  }

  async load(){
    const result = await axios.get("/moment/ecommerce-collection/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        id: this.props.route.params.id,
        product_id: this.props.route.params.product_id,
        expand: "product.thumbnail_url",
        fields: "*,product.file_url,product.name"
      }
    });

    if (result.data.success) {
      await this.setState({ data: result.data.data, isLoaded: true });

      this.props.navigation.setOptions({
        headerTitle: this.state.data.product.name
      });
    }

    return result.data;
  }

  isPdf(){
    const extension = this.state.data.product.file_url.slice(-3).toLowerCase();

    return extension === "pdf";
  }

  render(){
    let content = (
      <View style={styles.containerLoading}>
        <ActivityIndicator style={styles.loadingIndicator} color="#0000ff" size={30} />
        <Text style={styles.loadingText}>Loading document...</Text>
      </View>
    );

    if (this.state.isLoaded) {
      const source = { uri: this.state.data.product.file_url, cache: true };

      if (this.isPdf()) {
        content = (
          <Pdf
            source={source}
            style={styles.pdf} />
        );
      } else {
        content = (
          <Video source={source}
                 controls={true}
                 fullscreen={true}
                 fullscreenAutorotate={true}
                 fullscreenOrientation="landscape"
                 onFullscreenPlayerDidPresent={() => {
                   this.props.showNav(false);
                   this.props.navigation.setOptions({
                     headerShown: false
                   });
                   ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                 }}
                 style={{
                   flex: 1,
                   backgroundColor: "#000",
                   width: "100%"
                 }} />
        );
      }
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }
}

const mapDispatchToProps = {
  showNav
};
export default connect(null, mapDispatchToProps)(ELearningViewScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loadingIndicator: {
    marginBottom: 10
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold"
  },
  pdf: {
    width: Dimensions.get("window").width,
    flex: 1,
    height: "100%"
  }
});
