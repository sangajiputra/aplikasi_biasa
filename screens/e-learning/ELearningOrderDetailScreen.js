import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import axios from "axios";
import config from "../../config";
import Text from "../../common/Text";
import moment from "moment";
import numeral from "numeral";

export default class ELearningOrderDetailScreen extends React.Component {

  state = {
    order: {},
    loaded: false
  };

  bankIcon = {
    "bank_transfer.bca": require("../../assets/icons/bca.png"),
    "bank_transfer.bni": require("../../assets/icons/bni.png"),
    "bank_transfer.permata": require("../../assets/icons/permata.png"),
    "credit_card": require("../../assets/icons/mandiri.png"),
    "gopay": require("../../assets/icons/gopay.png")
  };

  bankLabel = {
    "bank_transfer.bca": "BCA Virtual Account",
    "bank_transfer.bni": "BNI Virtual Account",
    "bank_transfer.permata": "Permata Virtual Account",
    "bank_transfer.mandiri": "Mandiri Virtual Account",
    "credit_card": "Credit Card",
    "gopay": "Gopay"
  };

  componentDidMount(){
    this.load();
  }

  async load(){
    const result = await axios.get("/moment/ecommerce-order/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        id: this.props.route.params.id,
        expand: "items.product.thumbnail_url,paymentRecord"
      }
    });

    if (result.data.success) {
      await this.setState({ order: result.data.data, loaded: true });
    }

    return result.data;
  }

  render(){
    let content = <View></View>;

    if (this.state.loaded) {
      content = (
        <>
          <View style={styles.detail}>
            <View style={styles.meta}>
              <Text style={styles.metaLabel}>Number</Text>
              <Text style={styles.metaValue}>{this.state.order.number}</Text>
            </View>
            <View style={styles.meta}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={styles.metaValue}>{this.state.order.statusText}</Text>
            </View>
            <View style={styles.meta}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{moment(this.state.order.placed_at * 1000).format("dddd, DD MMMM YYYY HH:mm")}</Text>
            </View>
            <View style={styles.meta}>
              <Text style={styles.metaLabel}>Payment Method</Text>
              <Text style={styles.metaValue}>{this.bankLabel[this.state.order.payment_method]}</Text>
            </View>

            {
              ["bank_transfer.bca", "bank_transfer.bni", "bank_transfer.permata"].indexOf(this.state.order.payment_method) !== -1 &&

              <View style={styles.meta}>
                <Text style={styles.metaLabel}>Virtual Account</Text>
                <Text style={styles.metaValue}>{this.state.order.paymentRecord.data.virtual_account}</Text>
              </View>
            }

            {
              this.state.order.payment_method === "bank_transfer.mandiri" &&

              (
                <View>
                  <View style={styles.meta}>
                    <Text style={styles.metaLabel}>Company Code</Text>
                    <Text style={styles.metaValue}>{this.state.order.paymentRecord.data.biller_code}</Text>
                  </View>

                  <View style={styles.meta}>
                    <Text style={styles.metaLabel}>Payment Code</Text>
                    <Text style={styles.metaValue}>{this.state.order.paymentRecord.data.bill_key}</Text>
                  </View>
                </View>
              )
            }

          </View>

          <View style={styles.orderItemContainer}>
            {this.state.order.items.map(orderItem => (
              <View style={styles.product} key={orderItem.id.toString()}>
                <View style={styles.productThumbnailContainer}>
                  <Image style={styles.productThumbnail} source={{ uri: orderItem.product.thumbnail_url }} />
                </View>

                <View style={styles.productContent}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productName}>{orderItem.product.name}</Text>
                    <Text style={styles.productAmount}>{orderItem.amount} Item</Text>
                  </View>
                  <Text style={styles.productPrice}>{numeral(orderItem.total).format("$0,0")}</Text>
                </View>
              </View>
            ))}

            <View style={styles.orderSummary}>
              <Text style={styles.orderSummaryLabel}>Grand Total</Text>
              <Text style={styles.orderSummaryValue}>{numeral(this.state.order.grand_total).format("$0,0")}</Text>
            </View>
          </View>

        </>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {content}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  detail: {
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    elevation: 2
  },
  meta: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#EEE",
    paddingVertical: 15
  },
  metaLabel: {
    flex: 1
  },
  metaValue: {
    fontFamily: "QuicksandBold"
  },
  orderItemContainer: {
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    elevation: 3,
    borderRadius: 10,
    margin: 15
  },
  product: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#DDD"
  },
  productThumbnail: {
    width: 80,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 5,
    marginRight: 10
  },
  productName: {
    fontSize: 18,
    fontFamily: "QuicksandBold"
  },
  productHeader: {
    flex: 1
  },
  productPrice: {
    fontSize: 16,
    fontFamily: "QuicksandBold"
  },
  orderSummary: {
    flexDirection: "row",
    paddingVertical: 19
  },
  orderSummaryLabel: {
    flex: 1,
    fontSize: 16
  },
  orderSummaryValue: {
    fontSize: 16,
    fontFamily: "QuicksandBold"
  }
});
