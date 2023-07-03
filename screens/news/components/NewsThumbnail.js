import React from "react";
import { StyleSheet, View } from "react-native";
import NewsItem from "../../home-screen/components/NewsItem";
import axios from "axios/index";
import config from "../../../config.js";

export default class NewsThumbnail extends React.Component {
  state = {
    news: []
  };

  componentDidMount(){
    this.load();
  }

  load(){
    return axios.get("/moment/news/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "picture_url",
        fields: "id,created_at,title"
      }
    }).then(response => {
      if (response.data.success) {
        this.setState({ news: response.data.data });
      }
    });
  };

  render(){
    return (
      <View style={styles.container}>
        {this.state.news.map((item, key) => {
          return (
            <NewsItem key={item.id.toString()} data={item} />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20
  }
});
