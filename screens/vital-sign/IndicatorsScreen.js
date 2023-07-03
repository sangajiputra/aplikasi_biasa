import React from "react";
import { ActivityIndicator, Dimensions, Image, ImageBackground, LayoutAnimation, RefreshControl, StyleSheet, View } from "react-native";
import { AnimatedGaugeProgress } from "react-native-simple-gauge";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Indicator from "./components/Indicator";
import { getCurrentIndicator, getVitalSigns, toggleVitalSignActivation } from "../../states/actionCreators";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Tab from "./components/Tab";
import Text from "../../common/Text";
import analytics from "@react-native-firebase/analytics";

const progressSize = 180;
const progressWidth = 15;
const cropDegree = 90;
const progressTextOffset = progressWidth;
const progressTextWidth = progressSize - (progressTextOffset * 2) + 5;
const progressTextHeight = progressSize * (1 - cropDegree / 360) + 10;
const parallaxHeaderHeight = 300;

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

export function IndicatorsScreen(props){
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (typeof props.currentIndicator.id !== "undefined") {
      props.toggleVitalSignActivation(props.currentIndicator.id, true);
    }else{
      load();
    }

    analytics().logEvent('vital_sign_indicators');
  }, []);

  const load = (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }

    props.getCurrentIndicator().then(currentIndicatorResult => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      return props.getVitalSigns(props.stage.id);
    }).then(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      props.toggleVitalSignActivation(props.currentIndicator.id, true);
    }).finally(() => {
      if (isRefresh) {
        setRefreshing(false);
      }
    });
  };

  const renderHeader = () => {

    let done = 0;
    let total = 0;

    props.indicators.forEach(indicator => {
      if(indicator.isDone){
        done++;
      }
      total++;
    });

    let progressRatio = props.indicators.length > 0 ? (done/props.indicators.length).toFixed(6) : 0;
    let progressPercent = parseInt(progressRatio * 100);

    return (
      <View style={styles.headerContainer}>
        <AnimatedGaugeProgress
          size={progressSize}
          width={progressWidth}
          fill={progressPercent}
          rotation={90}
          cropDegree={cropDegree}
          tintColor="rgba(67, 207, 229,0.5)"
          delay={9000}
          backgroundColor="rgba(255,255,255,0.5)"
          stroke={[0, 0]}
          strokeCap="circle">

          <View style={styles.progressTextView}>
            <Text style={styles.progressText}>{Math.round(progressRatio * 100)}%</Text>
            <Text style={styles.progressAlternateText}>{done} / {props.indicators.length}</Text>
            <Image style={styles.badge} source={{ uri: props.user.profile?.stage.badge_url }} />
          </View>

        </AnimatedGaugeProgress>

        <Text style={styles.progressLabel}>Journey to Champion</Text>

      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <Tab active="indicator" />
      <View style={{ flex: 1, overflow: "hidden" }}>
        <ParallaxScrollView
          backgroundColor="#EEE"
          style={styles.container}
          renderBackground={() => <ImageBackground source={require("../../assets/bg/header.png")} style={{ width: "100%", height: parallaxHeaderHeight }} resizeMode="stretch"><View /></ImageBackground>}
          renderForeground={() => renderHeader()}
          fadeOutForeground={false}
          outputScaleValue={19}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          parallaxHeaderHeight={parallaxHeaderHeight}>

          <View style={styles.body}>
            <Text style={styles.title}>Task To Do:</Text>

            {
              !props.loading ?

                <View style={styles.bodyWrapper}>
                  {props.indicators.map((indicator, index) => {
                    return (
                      <View key={indicator.id.toString()}>
                        <Indicator index={index} indicator={indicator} />
                      </View>
                    );
                  })}
                </View> :

                <View style={styles.containerLoading}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
            }
          </View>

        </ParallaxScrollView>
      </View>
    </View>
  );
}

const mapStateToProps = state => {

  return {
    user: state.user,
    indicators: state.vital_sign.vital_signs.map(indicator => {
      return {
        ...indicator,
        isDone: indicator.checker && indicator.checker.is_approved,
        disabled: false
      };
    }),
    stage: state.user.profile.stage,
    loading: state.vital_sign.loading,
    currentIndicator: state.vital_sign.currentIndicator,
  };
};

const mapDispatchToProps = {
  getVitalSigns,
  getCurrentIndicator,
  toggleVitalSignActivation
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorsScreen);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  badge: {
    width: 50,
    height: undefined,
    aspectRatio: 1,
    marginBottom: -25,
    marginTop: 10
  },
  container: {
    flex: 1,
    backgroundColor: "#EEE",
    alignItems: "stretch",
    flexWrap: "nowrap"
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40
  },
  progressTextView: {
    position: "absolute",
    top: progressTextOffset,
    left: progressTextOffset,
    width: progressTextWidth,
    height: progressTextHeight,
    alignItems: "center",
    justifyContent: "center"
  },
  progressText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.8)"
  },
  progressAlternateText: {
    fontSize: 18,
    color: "rgba(255,255,255,0.6)"
  },
  progressLabel: {
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
    marginTop: -10,
    fontWeight: "bold"
  },
  body: {
    marginTop: -40,
    backgroundColor: "#FFF",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    paddingLeft: 0,
    paddingRight: 0,
    flexGrow: 1,
    flex: 1,
    height: "100%",
    minHeight: viewportHeight - parallaxHeaderHeight + 80,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,

    elevation: 20
  },
  containerLoading: {
    paddingTop: 10,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20
  }
});
