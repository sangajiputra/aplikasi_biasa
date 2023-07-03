import React, { Fragment } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios/index";
import config from "../../config";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { ActivityIndicator, Animated, Dimensions, Image, LayoutAnimation, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import HTML from "react-native-render-html";
import FadeIn from "../animation/FadeIn";
import { connect, useSelector } from "react-redux";
import { addToCart, addToCollection, removeFromCart } from "../../states/actionCreators";
import baseFontStyle, { HTMLOpenLink } from "../../html-style";
import Text from "../../common/Text";
import numeral from "numeral";
import analytics from "@react-native-firebase/analytics";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");
const _paralaxHeight = 260;

const DescriptionAnimation = (props) => {
  const [slideUp] = React.useState(new Animated.Value(300));
  const [fade] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.spring(
      slideUp,
      {
        toValue: 0,
        velocity: 1,
        tension: 2,
        friction: 8
      }
    ).start();

    Animated.timing(fade, {
      toValue: 1
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        translateY: slideUp,
        opacity: fade
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const PictureAnimation = (props) => {
  const [slideUp] = React.useState(new Animated.Value(-200));
  const [fade] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.spring(slideUp, {
      toValue: 0,
      velocity: 1,
      tension: 2,
      friction: 8
    }).start();

    Animated.timing(fade, {
      toValue: 1
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        translateY: slideUp,
        opacity: fade
      }}
    >
      {props.children}
    </Animated.View>
  );
};

export function ELearningDetailScreen(props){
  const [product, setProduct] = React.useState({});
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isModifyLoaded, setIsModifyLoaded] = React.useState(true);
  const [paralaxHeight, setParalaxHeight] = React.useState(0);
  const isAddedToCart = useSelector(state => {
    return state.cart.items.findIndex(item => item.product_id === product.id) !== -1;
  });

  const route = useRoute();
  const navigation = useNavigation();

  let loadPromise = null;
  let loadCancelToken = axios.CancelToken.source();

  React.useEffect(() => {
    if (route.params.title) {
      navigation.setOptions({
        headerTitle: route.params.title
      });
    }

    load(route.params.id);

    return () => {if (loadPromise) loadCancelToken.cancel("cancel");};
  }, [props.route]);

  const renderPictures = () => {
    let view = <View />;

    if (isLoaded) {
      view = (
        <PictureAnimation style={styles.picturesContainer}>
          <Carousel
            slideStyle={styles.pictures}
            data={product.pictures}
            layout="default"
            activeAnimationType="spring"
            activeSlideOffset={10}
            inactiveSlideScale={1}
            inactiveSlideOpacity={0.5}
            renderItem={_renderPictureSlide}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            loop={true}
            autoplay={true}
          />

        </PictureAnimation>
      );
    }

    return view;
  };

  const _renderPictureSlide = ({ item, index }) => {
    return (
      <View style={styles.pictureContainer}>
        <Image resizeMode="contain" style={styles.picture} source={{ uri: item.picture_url }} />
      </View>
    );
  };

  const load = (id) => {
    setIsLoaded(false);

    loadPromise = axios.get("/moment/ecommerce-product/get", {
      baseURL: config.baseUrl,
      cancelToken: loadCancelToken.token,
      params: {
        access_token: config.accessToken,
        expand: "picture_url,pictures.picture_url,is_added_to_cart",
        id: id
      }
    }).then(response => {
      if (response.data.success) {
        setProduct(response.data.data);
        setParalaxHeight(_paralaxHeight);

        navigation.setOptions({
          headerTitle: response.data.data.name
        });

        analytics().logEvent("e_learning_view", { id: response.data.data.id, name: response.data.data.name });
      }
    }).finally(() => setIsLoaded(true));
  };

  const addToCart = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setIsModifyLoaded(false);

    props.addToCart(product.id).finally(() => setIsModifyLoaded(true));
  };

  const removeFromCart = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setIsModifyLoaded(false);

    props.removeFromCart(product.id).finally(() => setIsModifyLoaded(true));
  };

  const addToCollection = () => {
    props.addToCollection(product.id).then(data => {
      if (data.payload.data.success) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        props.navigation.goBack();
        props.navigation.navigate("e_learning_collection");
      }
    });
  };

  let content = (
    <View style={styles.containerLoading}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  if (isLoaded) {
    content = (
      <ParallaxScrollView
        backgroundColor="#EEE"
        contentBackgroundColor="#FFF"
        style={styles.parallax}
        renderForeground={renderPictures}
        parallaxHeaderHeight={paralaxHeight}>
        <View style={styles.container}>
          <DescriptionAnimation style={styles.detail}>
            <View>
              <View style={styles.header}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>{numeral(product.price).format("$0,0")}</Text>
              </View>

              <View style={{ ...styles.section, ...styles.sectionDescription }}>
                <View style={styles.sectionHeaderContainer}>
                  <Image style={styles.sectionHeaderIcon} source={require("../../assets/icons/package.png")} />
                  <Text style={styles.sectionHeader}>
                    Description
                  </Text>
                </View>
                <HTML baseFontStyle={baseFontStyle} onLinkPress={HTMLOpenLink} html={product.description} />
              </View>
            </View>
          </DescriptionAnimation>
        </View>
      </ParallaxScrollView>
    );
  }

  return (
    <View style={styles.outerContainer}>
      {content}
      {
        isLoaded ?
          <FadeIn style={styles.action}>
            {product.price == 0 && <TouchableNativeFeedback
              delayPressIn={0}
              useForeground={true}
              onPress={() => addToCollection()}
            >
              <View style={{ ...styles.cartButton }}>
                <Image style={styles.cartButtonIcon}
                       source={require("../../assets/icons/shopping-cart-invert.png")}
                />
                <Text style={{ ...styles.cartButtonText, ...(isAddedToCart ? styles.removeCartButtonText : {}) }}>
                  Add to Collection
                </Text>
              </View>
            </TouchableNativeFeedback>}

            {product.price > 0 && <TouchableNativeFeedback
              delayPressIn={0}
              disabled={!isModifyLoaded}
              useForeground={true}
              onPress={() => isAddedToCart ? removeFromCart() : addToCart()}
            >
              <View style={{ ...styles.cartButton, ...(isAddedToCart ? styles.removeCartButton : {}) }}>
                {
                  isModifyLoaded ?
                    (
                      <Fragment>
                        <Image style={styles.cartButtonIcon}
                               source={isAddedToCart ? require("../../assets/icons/shopping-cart-remove.png") : require("../../assets/icons/shopping-cart-invert.png")}
                        />
                        <Text style={{ ...styles.cartButtonText, ...(isAddedToCart ? styles.removeCartButtonText : {}) }}>
                          {isAddedToCart ? "Remove From Cart" : "Add to Cart"}
                        </Text>
                      </Fragment>
                    ) :
                    (
                      <ActivityIndicator size={28} color={isAddedToCart ? "#d45e4a" : "#FFF"} />
                    )

                }
              </View>
            </TouchableNativeFeedback>}
          </FadeIn> : null
      }
    </View>
  );
}

const mapDispatchToProps = {
  addToCart,
  removeFromCart,
  addToCollection
};

export default connect(null, mapDispatchToProps)(ELearningDetailScreen);

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  outerContainer: {
    flex: 1
  },
  container: {
    backgroundColor: "#EEE",
    flex: 1
  },
  picturesContainer: {
    backgroundColor: "#EEE",
    paddingTop: 20,
    paddingBottom: 20
  },
  pictureContainer: {
    alignItems: "center"
  },
  picture: {
    aspectRatio: 1,
    width: 200,
    height: undefined
  },
  detail: {
    backgroundColor: "#FFF",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    paddingLeft: 0,
    paddingRight: 0,
    flexGrow: 1,
    height: "100%",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,

    elevation: 20
  },

  name: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 2
  },
  price: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#d44c34"
  },
  header: {
    borderBottomWidth: 5,
    borderBottomColor: "#FAFAFA",
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20
  },
  section: {
    paddingLeft: 20,
    paddingRight: 20,
    borderTopWidth: 3,
    borderTopColor: "#FAFAFA",
    marginBottom: 5,
    paddingTop: 10
  },
  sectionDescription: {
    borderTopWidth: 0,
    paddingTop: 0
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
    flexShrink: 1
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  sectionHeaderIcon: {
    width: 24,
    aspectRatio: 1,
    height: undefined,
    marginRight: 8
  },
  action: {
    backgroundColor: "#FFF",
    width: "100%",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    zIndex: 9999
  },
  cartButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#4c9bff",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4c9bff"
  },
  removeCartButton: {
    backgroundColor: "transparent",
    borderColor: "#d45e4a"
  },
  cartButtonText: {
    fontSize: 16,
    color: "#FFF",
    marginLeft: 10,
    fontWeight: "bold"
  },
  removeCartButtonText: {
    color: "#d45e4a"
  },
  cartButtonIcon: {
    width: 28,
    height: undefined,
    aspectRatio: 1
  }
});
