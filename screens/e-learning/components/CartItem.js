import React from "react";
import { removeFromCart } from "../../../states/actionCreators";
import { connect } from "react-redux";
import { Image, LayoutAnimation, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Text from '../../../common/Text';
import numeral from "numeral";

export function CartItem(props){
  const navigation = useNavigation();

  const removeFromCart = () => {
    props.removeFromCart(props.data.product_id, "detail").then(result => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback delayPressIn={0} onPress={() => navigation.push("e_learning_detail", { id: props.data.product_id })} useForeground={true}>
        <View>
          <Image style={styles.image} source={{ uri: props.data.product.thumbnail_url }} />
        </View>
      </TouchableNativeFeedback>

      <View style={styles.metadata}>
        <Text style={styles.productName}>{props.data.product.name}</Text>
        <Text style={styles.productPrice}>{numeral(props.data.price).format('$0,0')}</Text>
        <TouchableOpacity onPress={() => removeFromCart()}>
          <View style={styles.removeButton}>
            <Image style={styles.removeButtonIcon} source={require("../../../assets/icons/shopping-cart-remove.png")} />
            <Text style={styles.removeButtonText}>Remove</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mapDispatchToProps = {
  removeFromCart
};

export default connect(null, mapDispatchToProps)(CartItem);

const styles = StyleSheet.create({
  container: {
    borderColor: "#EEE",
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 4,
    backgroundColor: "#FFF",
    borderRadius: 8,
    flexDirection: "row"
  },
  productName: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold"
  },
  productPrice: {
    color: "#d45e4a"
  },
  metadata: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  image: {
    width: 100,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 10
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13
  },
  removeButtonIcon: {
    width: 15,
    height: undefined,
    aspectRatio: 1,
    marginRight: 5
  },
  removeButtonText: {
    color: "#d45e4a",
    fontSize: 11,
    marginTop: 5,
    top: -1
  }
});
