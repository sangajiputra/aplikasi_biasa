import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import axios from "axios";
import config from "../../config";
import NewsItem from "../home-screen/components/NewsItem";
import analytics from "@react-native-firebase/analytics";

export default class NewsListScreen extends React.Component {
  state = {
    data: [],
    refreshing: false,
    loading: false,
    page: 0,
    pageCount: null
  };

  componentDidMount(){
    this.load();
  }

  async load(refresh){
    await this.setState({ loading: true });

    if (refresh) {
      await this.setState({ page: 0, pageCount: null, refreshing: true });
    }

    const result = await axios.get("/moment/news/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "picture_url",
        fields: "id,created_at,title",
        page_size: 10,
        page: this.state.page + 1
      }
    });

    if (result.data.success) {
      await this.setState({
        loading: false,
        data: refresh ? result.data.data : [...this.state.data,...result.data.data],
        page: parseInt(result.data.pagination.current_page),
        pageCount: parseInt(result.data.pagination.page_count)
      });

      analytics().logEvent('news');
    }

    if (refresh) {
      await this.setState({
        refreshing: false
      });
    }

    return result;
  }

  render(){
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.scroller}
          keyExtractor={news => news.id.toString()}
          data={this.state.data}
          refreshing={this.state.refreshing}
          onRefresh={() => this.load(true)}
          onEndReached={() => {
            if (!this.loading && (this.state.pageCount === null || this.state.pageCount > this.state.page)) {
              this.load(false);
            }
          }}
          renderItem={({ item }) => (
            <View style={styles.newsContainer}>
              <NewsItem data={item} />
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scroller: {
    flex: 1,
    paddingVertical: 15
  },
  newsContainer: {
    paddingHorizontal: 15,
    elevation: 3
  }
});
