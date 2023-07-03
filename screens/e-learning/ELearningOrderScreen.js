import React from "react";
import { FlatList, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import axios from "axios";
import config from "../../config";
import numeral from "numeral";
import moment from "moment";
import Text from '../../common/Text'

export default class ELearningOrderScreen extends React.Component {
  state = {
    orders: []
  };

  componentDidMount(){
    this.load();
  }

  async load(){
    const result = await axios.get("/moment/ecommerce-order/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "items"
      }
    });

    if (result.data.success) {
      await this.setState({ orders: result.data.data });
    }

    return result.data;
  }

  renderItem(order){
    return (
      <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("order_detail", { id: order.id })}>
        <View style={styles.order}>
          <View style={styles.orderContent}>
            <Text style={styles.orderNumber}>{order.number}</Text>
            <Text style={styles.orderDate}>{moment(order.placed_at * 1000).format("dddd, DD MMMM YYYY HH:mm")}</Text>
            <Text style={styles.orderItems}>{order.items.length} Items</Text>
            <Text style={styles.orderTotal}>Total: {numeral(order.grand_total).format("$0,0")}</Text>
          </View>
          <View style={styles.orderStatusContainer}>
            <View style={styles.orderStatus}>
              <Text style={styles.orderStatusText}>{order.statusText}</Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  render(){
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.orders}
          renderItem={item => this.renderItem(item.item)}
          keyExtractor={order => order.id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15
  },
  order: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#DDD",
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10
  },
  orderContent: {
    flex: 1
  },
  orderNumber: {
    fontSize: 16,
    fontFamily: "QuicksandBold"
  },
  orderStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#DDD"
  },
  orderStatusText: {
    textTransform: "uppercase"
  },
  orderDate: {
    fontSize: 12,
    marginBottom: 10,
    marginTop: 3
  }
});
