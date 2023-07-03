import React from "react";
import { Dimensions, Image, StatusBar, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../common/Text";
import * as ScreenOrientation from "expo-screen-orientation";
import { connect } from "react-redux";
import { showNav } from "../states/actionCreators";
import analytics from "@react-native-firebase/analytics";

export class PlanScreen extends React.Component {
  carousel = null;

  _onScreenOrientationChangeSubscribtion;

  constructor(props){
    super(props);

    this.state = {
      active: 0,
      orientation: false,
      images: [
        require("../assets/marketing-plan/0.jpg"),
        require("../assets/marketing-plan/1.jpg"),
        require("../assets/marketing-plan/2.jpg"),
        require("../assets/marketing-plan/3.jpg"),
        require("../assets/marketing-plan/4.jpg"),
        require("../assets/marketing-plan/5.jpg"),
        require("../assets/marketing-plan/6.jpg"),
        require("../assets/marketing-plan/7.jpg"),
        require("../assets/marketing-plan/8.jpg"),
        require("../assets/marketing-plan/9.jpg"),
        require("../assets/marketing-plan/10.jpg"),
        require("../assets/marketing-plan/11.jpg"),
        require("../assets/marketing-plan/12.jpg"),
        require("../assets/marketing-plan/13.jpg"),
        require("../assets/marketing-plan/14.jpg"),
        require("../assets/marketing-plan/15.jpg"),
        require("../assets/marketing-plan/16.jpg"),
        require("../assets/marketing-plan/17.jpg"),
        require("../assets/marketing-plan/18.jpg"),
        require("../assets/marketing-plan/19.jpg"),
        require("../assets/marketing-plan/20.jpg"),
        require("../assets/marketing-plan/21.jpg")
      ],
      landscapeImages: [
        require("../assets/marketing-plan/landscape/0.jpg"),
        require("../assets/marketing-plan/landscape/1.jpg"),
        require("../assets/marketing-plan/landscape/2.jpg"),
        require("../assets/marketing-plan/landscape/3.jpg"),
        require("../assets/marketing-plan/landscape/4.jpg"),
        require("../assets/marketing-plan/landscape/5.jpg"),
        require("../assets/marketing-plan/landscape/6.jpg"),
        require("../assets/marketing-plan/landscape/7.jpg"),
        require("../assets/marketing-plan/landscape/8.jpg"),
        require("../assets/marketing-plan/landscape/9.jpg"),
        require("../assets/marketing-plan/landscape/10.jpg"),
        require("../assets/marketing-plan/landscape/11.jpg"),
        require("../assets/marketing-plan/landscape/12.jpg"),
        require("../assets/marketing-plan/landscape/13.jpg"),
        require("../assets/marketing-plan/landscape/14.jpg"),
        require("../assets/marketing-plan/landscape/15.jpg"),
        require("../assets/marketing-plan/landscape/16.jpg"),
        require("../assets/marketing-plan/landscape/17.jpg"),
        require("../assets/marketing-plan/landscape/18.jpg"),
        require("../assets/marketing-plan/landscape/19.jpg"),
        require("../assets/marketing-plan/landscape/20.jpg"),
        require("../assets/marketing-plan/landscape/21.jpg")
      ]
    };
  }

  componentDidMount(){
    this.setScreenOrientation();
    analytics().logEvent('plan');
  }

  componentWillUnmount(){
    ScreenOrientation.removeOrientationChangeListener(this._onScreenOrientationChangeSubscribtion);
    ScreenOrientation.unlockAsync();
  }

  async setScreenOrientation(){
    const currentOrientation = await ScreenOrientation.getOrientationAsync();

    this.setState({ orientation: currentOrientation <= 2 ? "portrait" : "landscape" });

    this._onScreenOrientationChangeSubscribtion = ScreenOrientation.addOrientationChangeListener(async (event) => {
      this.setState({ orientation: event.orientationInfo.orientation <= 2 ? "portrait" : "landscape" }, () => {
        setTimeout(() => {
          this.props.showNav(this.state.orientation === "portrait");
        }, 20);
      });
    });
  }

  _renderItem = (item) => {
    return (
      <View style={{ ...styles.slide, ...(this.state.orientation === "landscape" ? styles.slideLandscape : {}) }}>
        <Image source={item.item} style={this.state.orientation === "portrait" ? styles.slideImage : styles.slideImageLandscape} />
      </View>
    );
  };

  fullScreen(){
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }

  render(){
    const { width: viewportWidth } = Dimensions.get("window");

    return (
      <View style={{ ...styles.container, ...(this.state.orientation === "landscape" ? styles.containerLandscape : {}) }}>
        <LinearGradient
          colors={["rgba(246,185,65,0.37)", "rgba(193,143,52,0.8)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }}
        />
        <Carousel
          ref={component => this.carousel = component}
          data={this.state.orientation === "portrait" ? this.state.images : this.state.landscapeImages}
          renderItem={this._renderItem}
          layout="default"
          sliderWidth={viewportWidth}
          containerCustomStyle={{ flex: 1 }}
          contentContainerCustomStyle={{ alignItems: "center" }}
          itemWidth={viewportWidth}
          onSnapToItem={(index) => this.setState({ active: index })}
        />

        {this.state.orientation === "portrait" && <View style={styles.navigation}>
          <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.5)", true)} delayPressIn={0} onPress={() => this.carousel.snapToPrev()}>
            <View style={styles.navigationIconWrapper}>
              <Image style={styles.navigationIcon} source={require("../assets/icons/back.png")} />
            </View>
          </TouchableNativeFeedback>

          <Text style={styles.navigationInformation}>{this.state.active + 1} / {this.state.images.length}</Text>

          <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.5)", true)} delayPressIn={0} onPress={() => this.carousel.snapToNext()}>
            <View style={styles.navigationIconWrapper}>
              <Image style={{ ...styles.navigationIcon, ...styles.navigationIconNext }} source={require("../assets/icons/back.png")} />
            </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.5)", true)} delayPressIn={0} onPress={() => this.fullScreen()}>
            <View style={styles.navigationIconWrapper}>
              <Image style={{ ...styles.navigationIcon, ...styles.navigationIconNext }} source={require("../assets/icons/expand.png")} />
            </View>
          </TouchableNativeFeedback>
        </View>}
      </View>
    );
  }
}

const mapDispatchToProps = {
  showNav
};

export default connect(null, mapDispatchToProps)(PlanScreen);

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight + 13,

    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  containerLandscape: {
    paddingTop: StatusBar.currentHeight
  },
  slideImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 0.56
  },
  slideImageLandscape: {
    width: "100%",
    height: undefined,
    aspectRatio: 2.83
  },
  slide: {
    elevation: 6,
    borderWidth: 2,
    borderColor: "rgba(246,176,50,0.8)",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    overflow: "hidden"
  },
  slideLandscape: {
    marginHorizontal: 0,
    borderRadius: 0
  },
  navigation: {
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "center"
  },
  navigationInformation: {
    color: "#FFF",
    fontSize: 20,
    marginHorizontal: 20
  },
  navigationIcon: {
    width: 20,
    height: undefined,
    aspectRatio: 1,
    tintColor: "#FFF"
  },
  navigationIconNext: {
    transform: [
      {
        rotate: "180deg"
      }
    ]
  },
  navigationIconWrapper: {
    backgroundColor: "rgba(255,255,255,0.9)",
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginBottom: -3
  }
});
