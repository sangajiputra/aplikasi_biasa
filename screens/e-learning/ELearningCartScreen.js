import React from "react";
import { connect } from "react-redux";
import { getCart, removeFromCart } from "../../states/actionCreators";
import CartItem from "./components/CartItem";
import ModalHeader from "./components/ModalHeader";
import { ActivityIndicator,Image, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import SlideUp from "../animation/SlideUp";
import {useNavigation} from '@react-navigation/native'
import Text from '../../common/Text';
import numeral from "numeral";

export function ELearningCartScreen(props){
  const [loading, setLoading] = React.useState(true);
  const navigation = useNavigation();

  React.useEffect(() => {
    props.getCart("detail").finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    if (props.cartCount > 0) {
      if (!isDetailLoaded()) {
        props.getCart("detail").finally(() => setLoading(false));
      }
    }
  }, [props.cartCount]);

  const isDetailLoaded = () => typeof props.cart.items[0] !== "undefined" &&
    typeof props.cart.items[0].product !== "undefined";

  let content = (
    <View style={styles.containerLoading}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  if (!loading) {
    if (props.cartCount > 0) {
      content = (
        <View style={styles.content}>
          <ScrollView style={styles.items}>
            {
              isDetailLoaded() ?
                props.cart.items.map(item => {
                  return (
                    <CartItem key={item.id.toString()} data={item} />
                  );
                }) : null
            }
          </ScrollView>

          <SlideUp style={styles.action}>
            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>Grand Total:</Text>
              <Text style={styles.summaryValue}>{numeral(props.cart.grand_total).format('$0,0')}</Text>
            </View>
            <View style={styles.checkoutButtonContainer}>
              <TouchableNativeFeedback onPress={() => navigation.navigate('e_learning_checkout')} delayPressIn={0} useForeground={true}>
                <View style={styles.checkoutButton}>
                  <Text style={styles.checkoutButtonText}>Checkout</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </SlideUp>
        </View>
      );
    } else {
      content = (
        <View style={styles.emptyCartContainer}>
          <Image style={styles.emptyCartIcon} source={require("../../assets/icons/shopping-cart-empty.png")} />
          <Text style={styles.emptyCartText}>You have no item in your cart</Text>
          <TouchableNativeFeedback onPress={() => navigation.goBack()} useForeground={true} delayPressIn={0}>
            <View style={styles.shopButton}>
              <Text style={styles.shopButtonText}>Continue Shopping</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }
  }

  return (
    <ModalHeader containerStyle={styles.container} showIcon={false} title={props.cartCount + " items in cart"}>
      {content}
    </ModalHeader>
  );
}

const mapStateToProps = state => {
  return {
    cart: state.cart,
    cartCount: state.cart.items.length
  };
};

const mapDispatchToProps = {
  removeFromCart,
  getCart
};

export default connect(mapStateToProps, mapDispatchToProps)(ELearningCartScreen);

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40
  },
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingTop: 20
  },
  items: {
    flex: 1
  },
  action: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#b3f0ff",
    elevation: 6,
    backgroundColor: "#cafaff",
    justifyContent: "space-between"
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#317fff"
  },
  checkoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#4c9bff",
    marginVertical: -5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -100
    },
    shadowOpacity: 0.8,
    shadowRadius: 9,

    elevation: 2
  },
  checkoutButtonText: {
    color: "#FFF"
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyCartIcon: {
    width: 64,
    height: undefined,
    aspectRatio: 1,
    marginBottom: 15,
    opacity: 0.5
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: "center",
    color: '#DDD'
  },
  shopButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#e3f6ff',
    borderRadius: 5,
    marginTop: 8
  },
  shopButtonText: {
    color: '#4295c3'
  }
});
