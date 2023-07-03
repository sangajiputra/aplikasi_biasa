import React from "react";
import { Animated, Image, LayoutAnimation, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { addToCart,addToCollection, removeFromCart } from "../../../states/actionCreators";
import { connect, useSelector } from "react-redux";
import Text from "../../../common/Text";
import numeral from "numeral";

export function ProductThumbnail(props){
  const [product, setProduct] = React.useState(props.product);
  const navigation = useNavigation();
  const [isActionShow, setIsActionShow] = React.useState(false);
  const isAddedToCart = useSelector(state => {
    return state.cart.items.findIndex(item => item.product_id === product.id) !== -1;
  });
  let actionTimeout = null;

  React.useEffect(() => {
    actionTimeout = setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

      setIsActionShow(true);
    }, 300);

    return () => clearTimeout(actionTimeout);
  }, []);

  const addToCart = () => {
    props.addToCart(props.product.id).then(data => {
      if (data.payload.data.success) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        setProduct({
          ...product,
          is_added_to_cart: true
        });
      }
    });
  };

  const removeFromCart = () => {
    props.removeFromCart(props.product.id).then(data => {
      if (data.payload.data.success) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        setProduct({
          ...product,
          is_added_to_cart: false
        });
      }
    });
  };

  const viewCollection = () => {
    navigation.navigate("e_learning_view", { product_id: props.product.id });
  };

  const addToCollection = () => {

    props.addToCollection(props.product.id).then(data => {
      if (data.payload.data.success) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        setProduct({
          ...product,
          is_bought: true
        });
      }
    });
  };

  return (
    <Animated.View style={styles.product}>
      <View style={styles.content}>
        <TouchableNativeFeedback
          delayPressIn={0}
          onPress={() => {
            if (product.is_bought) {
              viewCollection();
            } else {
              navigation.navigate("e_learning_detail", { "id": product.id, "title": product.name });
            }
          }}
          useForeground={true}
        >
          <View style={styles.contentWrapper}>
            <Image style={styles.thumbnail} source={{ uri: product.thumbnail_url }} />
            <View style={styles.meta}>
              <Text style={styles.name}>{product.name}</Text>
              {!props.product.is_bought && props.product.price > 0 && <Text style={styles.price}>{numeral(product.price).format("$0,0")}</Text>}
              {!props.product.is_bought && props.product.price == 0 && <Text style={styles.price}>FREE</Text>}
              {props.product.is_bought && <Text style={styles.price}>OWNED</Text>}
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
      {
        isActionShow ?
          <View style={styles.actions}>
            {/*{*/}
            {/*  !isAddedToCart &&*/}
            {/*  <TouchableNativeFeedback delayPressIn={0} onPress={() => addToCart()}>*/}
            {/*    <View style={styles.action}>*/}
            {/*      <Image style={styles.actionIcon} source={require("../../../assets/icons/shopping-cart.png")} />*/}
            {/*      <Text style={styles.actionText}>ADD TO CART</Text>*/}
            {/*    </View>*/}
            {/*  </TouchableNativeFeedback>*/}
            {/*}*/}
            {
              !isAddedToCart && !product.is_bought && props.product.price > 0 &&
              <TouchableNativeFeedback delayPressIn={0} onPress={() => addToCart()}>
                <View style={styles.action}>
                  <Image style={styles.actionIcon} source={require("../../../assets/icons/shopping-cart.png")} />
                  <Text style={styles.actionText}>ADD TO CART</Text>
                </View>
              </TouchableNativeFeedback>
            }

            {
              !product.is_bought && props.product.price == 0 &&
              <TouchableNativeFeedback delayPressIn={0} onPress={() => addToCollection()}>
                <View style={styles.action}>
                  <Image style={styles.actionIcon} source={require("../../../assets/icons/shopping-cart.png")} />
                  <Text style={styles.actionText}>ADD TO COLLECTION</Text>
                </View>
              </TouchableNativeFeedback>
            }

            {
              isAddedToCart && !product.is_bought &&
              <TouchableNativeFeedback delayPressIn={0} onPress={() => removeFromCart()}>
                <View style={{ ...styles.action, ...styles.dangerAction }}>
                  <Image style={styles.actionIcon} source={require("../../../assets/icons/shopping-cart-remove.png")} />
                  <Text style={{ ...styles.actionText, ...styles.dangerActionText }}>REMOVE FROM CART</Text>
                </View>
              </TouchableNativeFeedback>
            }

            {
              product.is_bought &&
              <TouchableNativeFeedback delayPressIn={0} onPress={() => viewCollection()}>
                <View style={{ ...styles.action, ...styles.successAction }}>
                  <Image style={styles.actionIcon} source={require("../../../assets/icons/study.png")} />
                  <Text style={{ ...styles.actionText, ...styles.successActionText }}>VIEW COLLECTION</Text>
                </View>
              </TouchableNativeFeedback>
            }
          </View> : null
      }
    </Animated.View>
  );
}

ProductThumbnail.time = 300;

const mapDispatchToProps = {
  addToCart,
  removeFromCart,
  addToCollection
};

export default connect(null, mapDispatchToProps)(ProductThumbnail);

const styles = StyleSheet.create({
  product: {
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#f9f9f9",
    borderWidth: 1,
    backgroundColor: "#FFF",

    shadowColor: "#AAA",
    shadowOffset: {
      width: 0,
      height: -100
    },
    shadowOpacity: 0.4,
    shadowRadius: 9,

    elevation: 3
  },
  meta: {
    padding: 10
  },
  thumbnail: {
    width: "100%",
    height: undefined,
    aspectRatio: 3 / 4
  },
  name: {
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 22
  },
  price: {
    color: "#d45e4a",
    fontWeight: "bold"
  },
  action: {
    backgroundColor: "rgba(122,164,239,0.15)",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "transparent"
  },
  dangerAction: {
    backgroundColor: "transparent",
    borderTopColor: "#EEE"
  },
  successAction: {
    backgroundColor: "transparent",
    borderTopColor: "#EEE"
  },
  actionText: {
    fontWeight: "bold",
    color: "#79a7f4"
  },
  dangerActionText: {
    color: "#d45e4a",
    fontSize: 12
  },
  successActionText: {
    color: "#2f2f2f",
    fontSize: 12
  },
  actionIcon: {
    marginRight: 8,
    width: 20,
    height: undefined,
    aspectRatio: 1
  }
});
