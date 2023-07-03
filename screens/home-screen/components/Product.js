import React from "react";
import axios from "axios/index";
import config from "../../../config.js";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../../common/Text";
import numeral from "numeral";

const { width: viewportWidth } = Dimensions.get("window");

export default class Product extends React.Component {
  state = {
    products: []
  };

  componentDidMount(){
    this.load();
  }

  load(){
    return axios.get("/moment/product/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "picture_url",
        fields: "name,price,id"
      }
    }).then(response => {
      if (response.data.success) {
        this.setState({ products: response.data.data });
      }
    });
  };

  render(){
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false} snapToInterval={120} pagingEnabled={true} horizontal={true} style={styles.products}>
          {this.state.products.map((item, key) => {
            return (
              <TouchableNativeFeedback delayPressIn={0} onPress={() => {this.props.navigation.navigate("product_detail", { "id": item.id, "title": item.name });}} useForeground={true} key={item.id}>
                <View style={styles.product}>
                  <View style={styles.productImageContainer}>
                    <Image style={styles.productImage} source={{ uri: item.picture_url }} />
                    <View style={styles.more}>
                      <Image style={styles.moreIcon} source={require("../../../assets/icons/chevron-right.png")} />
                    </View>
                  </View>
                  <Text style={styles.productTitle}>{item.name}</Text>
                  <Text style={styles.productPrice}>{numeral(item.price).format("$0,0")}</Text>
                </View>
              </TouchableNativeFeedback>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 5,
    minHeight: 160
  },
  products: {
    flexDirection: "row",
    flexWrap: "nowrap"
  },
  productTitle: {
    fontSize: 15
  },
  product: {
    flexShrink: 0,
    flexGrow: 0,
    paddingLeft: 6,
    paddingRight: 6,
    width: 120
  },
  productImage: {
    aspectRatio: 1,
    width: "100%",
    height: undefined
  },
  productImageContainer: {
    padding: 13,
    marginBottom: 10,
    marginTop: 3,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -100
    },
    shadowOpacity: 0.8,
    shadowRadius: 9,

    elevation: 4,
    position: "relative",
    overflow: "hidden"
  },
  productPrice: {
    fontWeight: "bold",
    marginTop: 3
  },
  more: {
    backgroundColor: "#444",
    position: "absolute",
    top: 0,
    right: 0
  },
  moreIcon: {
    aspectRatio: 1,
    width: 16,
    height: undefined
  }
});
