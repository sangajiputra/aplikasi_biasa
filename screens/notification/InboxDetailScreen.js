import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import axios from "axios";
import config from "../../config";
import HTML from "react-native-render-html";
import baseFontStyle, { HTMLOpenLink } from "../../html-style";
import Text from "../../common/Text";
import analytics from "@react-native-firebase/analytics";

export default class InboxDetailScreen extends React.Component {
  state = {
    loading: false,
    data: {}
  };

  componentDidMount(){
    this.load();
  }

  async load(){
    this.setState({ loading: true });

    const result = await axios.get("/moment/inbox/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        id: this.props.route.params.id,
        expand: "picture_url"
      }
    });

    if (result.data.success) {
      analytics().logEvent('inbox_detail', {
        id: result.data.data.id,
        item: result.data.data.title,
      });

      await this.setState({ data: result.data.data });
    }

    await this.setState({ loading: false });

    return result;
  }

  render(){
    return (
      <ScrollView>
        {this.state.data.picture_url && <View style={styles.header}>
          <Image style={styles.image} source={{ uri: this.state.data.picture_url }} />
        </View>}
        <View style={styles.content}>
          <Text style={styles.title}>{this.state.data.title}</Text>
          <HTML baseFontStyle={baseFontStyle}
                onLinkPress={HTMLOpenLink}
                html={this.state.data.content} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 15
  },
  title: {
    fontSize: 16,
    fontFamily: "QuicksandBold"
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 3 / 2
  }
});
