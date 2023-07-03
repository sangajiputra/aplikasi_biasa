import React from "react";
import { Image, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../../common/Text";
import numeral from "numeral";

export default class ProductItem extends React.Component {
  render(){
    return (
      <View style={{ width: '50%' }}>
        <TouchableNativeFeedback delayPressIn={0}
                                 useForeground={true}
                                 onPress={() => {
                                   this.props.navigation.navigate("product_detail", {
                                     "id": this.props.data.id,
                                     "title": this.props.data.name
                                   });
                                 }}>
          <View style={styles.product}>
            <View style={styles.productImageContainer}>
              <Image style={styles.productImage} source={{ uri: this.props.data.picture_url }} />
            </View>

            <View style={styles.productMeta}>
              <View style={styles.productCaption}>
                <Text style={styles.productTitle}>{this.props.data.name}</Text>
                <Text style={styles.productPrice}>{numeral(this.props.data.price).format("$0,0")}</Text>
              </View>


              <View style={styles.more}>
                <Image style={styles.moreIcon} source={require("../../../assets/icons/chevron-right.png")} />
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  productTitle: {
    fontSize: 16,
    lineHeight: 22
  },
  productPrice: {
    color: "#d45e4a",
    fontWeight: "bold",
    marginTop: 3
  },
  product: {
    flex: 1,
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 10,

    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -100
    },
    shadowOpacity: 0.8,
    shadowRadius: 9,

    elevation: 4
  },
  productCaption: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 10,
    flex: 1
  },
  productImage: {
    aspectRatio: 1,
    width: "100%",
    height: undefined
  },
  productImageContainer: {
    padding: 20,
    marginTop: 3,
    position: "relative",
    overflow: "hidden"
  },
  moreIcon: {
    aspectRatio: 1,
    width: 30,
    height: undefined,
    tintColor: "#DDD"
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#f1f1f1",
    paddingRight: 10
  }
});


