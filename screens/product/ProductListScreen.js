import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import axios from "axios";
import config from "../../config";
import ProductItem from "./components/ProductItem";
import analytics from "@react-native-firebase/analytics";

export default class ProductListScreen extends React.Component {
  state = {
    data: [],
    refreshing: false,
    loading: false,
    page: 1,
    pageCount: null
  };

  componentDidMount(){
    this.load(true).then(() => analytics().logEvent("product_list"));
  }

  async load(refresh){
    if (refresh) {
      await this.setState({ page: 1, pageCount: null, refreshing: true });
    }

    const result = await axios.get("/moment/product/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "picture_url",
        fields: "name,price,id",
        page: this.state.page
      }
    });

    if (result.data.success) {
      await this.setState({ data: result.data.data });
    }

    if (refresh) {
      await this.setState({
        refreshing: false,
        page: parseInt(result.data.pagination),
        pageCount: parseInt(result.data.pagination.page_count)
      });
    }

    return result;
  }

  render(){
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={news => news.id}
          data={this.state.data}
          refreshing={this.state.refreshing}
          onRefresh={() => this.load()}
          numColumns={2}
          onEndReach={() => {
            if (this.state.page === null || this.state.pageCount !== this.state.page) {
              this.load(false);
            }
          }}
          renderItem={({ item }) => (
            <ProductItem navigation={this.props.navigation} data={item} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: "#FFF"
  }
});
