import React from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Dimensions, Image, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../common/Text";
import AsyncStorage from "@react-native-community/async-storage";

export default class SplashScreen extends React.Component {
  state = {
    active: 0
  };

  escape(){
    this.props.onEscape();

    AsyncStorage.setItem("splashed", "true");
  }

  _renderItem(item, index){
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={item.image} />
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{item.text}</Text>
          {index === 2 && <TouchableNativeFeedback onPress={() => this.escape()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>FINISH</Text>
            </View>
          </TouchableNativeFeedback>}
        </View>
      </View>
    );
  }

  render(){
    const { width: viewportWidth, heightL: viewportHeight } = Dimensions.get("window");

    const data = [
      {
        image: require("../assets/splash/login.png"),
        caption: "Login",
        text: "Untuk login cukup memasukkan ID member dan juga password yang sudah di daftar"
      },
      {
        image: require("../assets/splash/register.png"),
        caption: "Register",
        text: "Bagi anda yang belum terdaftar menjadi member silahkan kunjungi http://www.moment2u.com/"
      },
      {
        image: require("../assets/splash/welcome.png"),
        caption: "Welcome",
        text: "myMOMENT ini memudahkan anda untuk mengembangkan bisnis dengan fitur yang sangat lengkap"
      }
    ];

    return (
      <View>
        <Carousel
          slideStyle={styles.slider}
          data={data}
          layout="default"
          activeAnimationType="spring"
          activeSlideOffset={0}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth}
          loop={false}
          autoplay={true}
          onSnapToItem={(index) => this.setState({ active: index })}
        />

        <Pagination
          style={{ padding: 0, margin: 0 }}
          dotsLength={data.length}
          activeDotIndex={this.state.active}
          containerStyle={{ paddingVertical: 0, margin: 0, position: "absolute", bottom: 30, left: 0, right: 0 }}
          dotStyle={{
            width: 11,
            height: 11,
            borderRadius: 11,
            backgroundColor: "rgb(0, 0, 0)"
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.8}
          inactiveDotStyle={{
            width: 11,
            height: 11,
            borderRadius: 11,
            backgroundColor: "rgba(0, 0, 0,0.6)"
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    alignItems: "center",
    justifyContent: "center"
  },
  slide: {
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 300,
    height: undefined,
    aspectRatio: 1
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  textContainer: {
    paddingBottom: 140,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    width: 300,
    lineHeight: 24,
  },
  caption: {
    fontSize: 26,
    paddingTop: 60,
    fontFamily: "QuicksandBold",
    marginBottom: 10
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginTop: 20,
    maxWidth: 200,
    borderRadius: 5
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18
  }
});
