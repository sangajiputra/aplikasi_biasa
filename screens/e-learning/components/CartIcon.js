import React from "react";
import { connect } from "react-redux";
import { Animated, Image, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { getCart } from "../../../states/actionCreators";
import { useNavigation } from "@react-navigation/native";

export function CartIcon(props){
  const navigation = useNavigation();
  const [scaleCount] = React.useState(new Animated.Value(1));
  const [rotateCount] = React.useState(new Animated.Value(0));

  let cartPromise = null;

  React.useEffect(() => {
    if (props.count === 0) {
      cartPromise = props.getCart();
    }
  }, []);

  React.useEffect(() => {
    if (props.count === 0) {
      Animated.timing(scaleCount, {
        toValue: 0,
        friction: 3,
        duration: 200
      }).start();
    } else {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleCount, {
            toValue: 1.34,
            friction: 3,
            duration: 100
          }),
          Animated.spring(rotateCount, {
            toValue: 1,
            friction: 3,
            duration: 100
          })
        ]),
        Animated.parallel([
          Animated.timing(scaleCount, {
            toValue: 1,
            duration: 200
          }),
          Animated.spring(rotateCount, {
            toValue: 0,
            friction: 3,
            duration: 200
          })
        ])
      ]).start();
    }

  }, [props.count]);

  let icon = require("../../../assets/icons/shopping-cart-invert.png");

  if (props.theme === "light") {
    icon = require("../../../assets/icons/shopping-cart.png");
  }

  return (
    <TouchableNativeFeedback onPress={() => navigation.navigate("e_learning_cart")}
                             delayPressIn={0}
                             useForeground={true}
                             background={new TouchableNativeFeedback.Ripple(props.theme !== "light" ? "rgba(255,255,255,0.9)" : "rgba(118,148,255,0.2)", true)}
    >
      <View style={styles.container}>
        <Image style={styles.icon} source={icon} />
        <Animated.Text style={{
          ...styles.badge,
          transform: [
            { scale: scaleCount },
            { rotate: rotateCount.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "20deg"] }) }
          ]
        }
        }>
          {props.count}
        </Animated.Text>
      </View>
    </TouchableNativeFeedback>
  );
}

const mapStateToProps = state => {
  return {
    count: state.cart.items.length
  };
};

const mapDispatchToProps = {
  getCart
};

export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 8,
    margin: -8
  },
  icon: {
    width: 26,
    height: undefined,
    aspectRatio: 1
  },
  badge: {
    width: 18,
    height: 18,
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFF",
    backgroundColor: "#d44c34",
    textAlign: "center",
    position: "absolute",
    borderRadius: 18,
    top: 0,
    right: 0
  }
});
