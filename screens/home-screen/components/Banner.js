import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import axios from "axios/index";
import config from "../../../config.js";
import Carousel from "react-native-snap-carousel";


export default class Banner extends React.Component {

  state = {
    banners: []
  };

  componentDidMount(){
    this.load();
  }

  load(){
    return axios.get("/moment/banner/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "picture_url",
        fields: "id"
      }
    }).then(result => {
      if (result.data.success) {
        this.setState({ banners: result.data.data });
      }
    });
  };

  _renderItem({ item, index }){
    return (
      <View style={styles.slideContainer}>
        <Image style={styles.slide} source={{ uri: item.picture_url }} />
      </View>
    );
  };

  render(){
    const { width: viewportWidth } = Dimensions.get("window");

    return (

      <View style={{
        ...styles.container,
        minHeight: ((viewportWidth - 50) * (2 / 5)) + 7,
      }}>
        <Carousel
          slideStyle={styles.slider}
          data={this.state.banners}
          layout="default"
          activeAnimationType="spring"
          activeSlideOffset={10}
          inactiveSlideScale={0.97}
          inactiveSlideOpacity={0.5}
          renderItem={this._renderItem}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth - 50}
          loop={true}
          autoplay={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5
  },
  slideContainer: {
    borderRadius: 10,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.9,
    shadowRadius: 3,

    elevation: 8,
    margin: 5
  },
  slide: {
    aspectRatio: 5 / 2,
    width: "100%",
    height: undefined,
    backgroundColor: "rgba(255,255,255,0.4)"
  }
});
