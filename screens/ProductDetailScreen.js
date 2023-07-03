import React, { useEffect, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import config from "../config";
import Carousel, { Pagination } from "react-native-snap-carousel";
import HTML from "react-native-render-html";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import baseFontStyle, { HTMLOpenLink } from "../html-style";
import Text from "../common/Text";
import numeral from "numeral";
import analytics from "@react-native-firebase/analytics";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");
const _paralaxHeight = 290;

const DescriptionAnimation = (props) => {
  const [slideUp] = useState(new Animated.Value(300));
  const [fade] = useState(new Animated.Value(0));

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
  const [slideUp] = useState(new Animated.Value(-200));
  const [fade] = useState(new Animated.Value(0));

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

export default function ProductDetailScreen(){
  const [isLoaded, setIsLoaded] = useState(false);
  const [product, setProduct] = useState({});
  const [pictures, setPictures] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [paralaxHeight, setParalaxHeight] = useState(0);
  const route = useRoute();
  const navigation = useNavigation();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activePicture, setActivePicture] = useState(0);

  useEffect(() => {
    if (route.params.title) {
      navigation.setOptions({
        headerTitle: route.params.title
      });
    } else {
      setTimeout(() => null, 5000);
    }

    axios.get("/moment/product/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "picture_url,pictures.picture_url,testimonials.photo_url",
        id: route.params.id
      }
    }).then(response => {
      setProduct(response.data.data);

      let pictures = [];

      for (const picture of response.data.data.pictures) {
        pictures.push({ uri: picture.picture_url });
      }

      setTestimonials(response.data.data.testimonials);

      setPictures(pictures);
      setIsLoaded(true);
      setParalaxHeight(_paralaxHeight);

      navigation.setOptions({
        headerTitle: response.data.data.name
      });

      analytics().logEvent("product_detail", {
        id: response.data.data.id,
        name: response.data.data.name
      });
    });
  }, []);

  const renderPictures = () => {
    let view = <View />;

    if (isLoaded) {
      view = (
        <PictureAnimation style={styles.picturesContainer}>
          <Carousel
            slideStyle={styles.pictures}
            data={pictures}
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
            onSnapToItem={(index) => setActivePicture(index)}
          />

          {renderPicturePagination()}
        </PictureAnimation>
      );
    }

    return view;
  };

  const renderTestimonialPagination = () => {
    return (
      <Pagination
        style={{ padding: 0, margin: 0, height: 0 }}
        dotsLength={testimonials.length}
        activeDotIndex={activeTestimonial}
        containerStyle={{ paddingVertical: 0, margin: 0, marginRight: -20 }}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.8}
        inactiveDotStyle={{
          width: 8,
          height: 8,
          borderColor: "#000",
          borderWidth: 2,
          borderRadius: 5,
          backgroundColor: "transparent"
        }}
      />
    );
  };

  const renderPicturePagination = () => {
    return (
      <Pagination
        dotsLength={pictures.length}
        activeDotIndex={activePicture}
        containerStyle={{ paddingVertical: 30, margin: 0 }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: "rgba(0, 0, 0, 0.8)"
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.8}
        inactiveDotStyle={{
          width: 10,
          height: 10,
          borderColor: "#000",
          borderWidth: 2,
          borderRadius: 5,
          backgroundColor: "transparent"
        }}
      />
    );
  };

  const _renderPictureSlide = ({ item, index }) => {
    return (
      <View style={styles.pictureContainer}>
        <Image resizeMode="contain" style={styles.picture} source={item} />
      </View>
    );
  };

  const _renderTestimonialSlide = ({ item, index }) => {
    return (
      <View style={styles.testimonial}>
        <View style={styles.testimonialAvatarContainer}>
          <Image style={styles.testimonialAvatar} source={{ uri: item.photo_url }} />
        </View>
        <View style={styles.testimonialContentContainer}>
          <Text style={styles.testimonialContent}>{item.content}</Text>
          <Text style={styles.testimonialGiver}>&mdash; {item.name}</Text>
        </View>
      </View>
    );
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
        style={styles.container}
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
                  <Image style={styles.sectionHeaderIcon} source={require("../assets/icons/package.png")} />
                  <Text style={styles.sectionHeader}>
                    Description
                  </Text>
                </View>
                <HTML baseFontStyle={baseFontStyle}
                      onLinkPress={HTMLOpenLink}
                      html={product.description} />
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeaderContainer}>
                  <Image style={styles.sectionHeaderIcon} source={require("../assets/icons/hand-wash.png")} />
                  <Text style={styles.sectionHeader}>
                    How to use
                  </Text>
                </View>

                <HTML baseFontStyle={baseFontStyle}
                      onLinkPress={HTMLOpenLink}
                      html={product.usage} />
              </View>

              {product.medicinal_properties && <View style={styles.section}>
                <View style={styles.sectionHeaderContainer}>
                  <Image style={styles.sectionHeaderIcon} source={require("../assets/icons/cure.png")} />
                  <Text style={styles.sectionHeader}>
                    Benefits
                  </Text>
                </View>

                <HTML baseFontStyle={baseFontStyle}
                      onLinkPress={HTMLOpenLink}
                      html={product.medicinal_properties} />
              </View>}

              <View style={styles.section}>
                <View style={styles.sectionHeaderContainer}>
                  <Image style={styles.sectionHeaderIcon} source={require("../assets/icons/recipe.png")} />
                  <Text style={styles.sectionHeader}>
                    Ingredients
                  </Text>
                </View>
                <HTML html={product.ingredients}
                      baseFontStyle={baseFontStyle}
                      tagsStyles={{
                        ul: { paddingTop: 10, paddingLeft: 0 }
                      }}
                />
              </View>

              {
                testimonials.length > 0 ?
                  <View style={styles.section}>
                    <View style={{ ...styles.testimonialHeader, ...styles.sectionHeaderContainer }}>
                      <Image style={styles.sectionHeaderIcon} source={require("../assets/icons/review.png")} />
                      <Text style={styles.sectionHeader}>
                        {testimonials.length} Testimonials
                      </Text>
                      {renderTestimonialPagination()}
                    </View>
                    <Carousel
                      slideStyle={styles.testimonials}
                      data={testimonials}
                      layout="default"
                      activeAnimationType="spring"
                      activeSlideOffset={0}
                      inactiveSlideScale={1}
                      inactiveSlideOpacity={0.5}
                      renderItem={_renderTestimonialSlide}
                      sliderWidth={viewportWidth - 40}
                      itemWidth={viewportWidth - 40}
                      loop={false}
                      autoplay={true}
                      onSnapToItem={(index) => setActiveTestimonial(index)}
                    />
                  </View> : null
              }

            </View>
          </DescriptionAnimation>
        </View>
      </ParallaxScrollView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#EEE",
    alignItems: "stretch",
    flexWrap: "nowrap",
    minHeight: viewportHeight - _paralaxHeight
  },
  picturesContainer: {
    backgroundColor: "#EEE",
    paddingTop: 20,
    paddingBottom: 60
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
    color: "#FF0000"
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
  testimonials: {
    marginTop: 20
  },
  testimonial: {
    flexDirection: "row",
    flex: 1
  },
  testimonialAvatar: {
    width: 50,
    aspectRatio: 1,
    height: undefined,
    borderRadius: 50
  },
  testimonialAvatarContainer: {
    width: 50,
    flexShrink: 0
  },
  testimonialContentContainer: {
    flexGrow: 0,
    flexShrink: 1,
    paddingLeft: 15
  },
  testimonialGiver: {
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 5
  },
  testimonialHeader: {
    flexDirection: "row"
  },
  testimonialContent: {
    color: "#444",
    lineHeight: 24,
    fontSize: 15
  }
});
