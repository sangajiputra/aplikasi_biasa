import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Dimensions, Image, ImageBackground, LayoutAnimation, RefreshControl, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { AnimatedGaugeProgress } from "react-native-simple-gauge";
import Text from "../../../common/Text";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import Estimate from "./Estimate";
import RecordProgress from "./RecordProgress";
import ProgressList from "./ProgressList";
import axios from "axios";
import config from "../../../config";
import { getCurrentGoal } from "../../../states/actionCreators";

const progressSize = 180;
const progressWidth = 15;
const cropDegree = 90;
const progressTextOffset = progressWidth;
const progressTextWidth = progressSize - (progressTextOffset * 2) + 5;
const progressTextHeight = progressSize * (1 - cropDegree / 360) + 10;
const parallaxHeaderHeight = 300;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

export function GoalProgress(props){
  const navigation = useNavigation();
  const [isRecordProgressMode, setIsRecordProgressMode] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  let recordProgressComponent = null;

  React.useEffect(() => {
    if (recordProgressComponent) {
      Object.values(recordProgressComponent.packageInputs)[0].input.focus();
    }

    navigation.setOptions({
      headerRight: () => {
        return <TouchableNativeFeedback onPress={() => reset()}>
          <Text>Reset Progress</Text>
        </TouchableNativeFeedback>;
      }
    });
  }, [isRecordProgressMode]);

  const reset = () => {
    axios.get("/moment/goal/reset", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken
      }
    }).then(result => {
      props.getCurrentGoal();
      navigation.setOptions({
        headerRight: null
      });
    });
  };

  const renderHeader = () => {
    let progressRatio = props.current.progress;

    return (
      <View style={styles.headerContainer}>
        <AnimatedGaugeProgress
          size={progressSize}
          width={progressWidth}
          fill={progressRatio * 100}
          rotation={90}
          cropDegree={cropDegree}
          tintColor="rgba(67, 220, 229,0.9)"
          delay={9000}
          backgroundColor="rgba(255,255,255,0.7)"
          stroke={[0, 0]}
          strokeCap="circle">

          <View style={styles.pictureOverlay} />
          <Image source={{ uri: props.current.photo_thumbnail_url }} style={styles.picture} />

          <View style={styles.progressTextView}>
            <Text style={styles.progressText}>{(progressRatio * 100).toFixed(0)}%</Text>
          </View>

        </AnimatedGaugeProgress>

        <View style={styles.progressInformation}>
          <Text style={styles.progressLabel}>{props.current.name}</Text>
          <Text style={styles.progressDeadline}>Deadline {moment(props.current.deadline * 1000).set({ minutes: 59, second: 59, hours: 23 }).fromNow()}</Text>
        </View>

      </View>
    );
  };

  const recordProgressMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setIsRecordProgressMode(true);
  };

  const cancelRecordProgressMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setIsRecordProgressMode(false);
  };

  let action = (
    <Fragment>
      <TouchableNativeFeedback onPress={() => navigation.navigate("update_goal", { id: props.current.id, current: true })} delayPressIn={0}>
        <View style={{ ...styles.action, ...styles.actionUpdate }}>
          <Image style={styles.actionOnlyIcon} source={require("../../../assets/icons/pencil.png")} />
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => recordProgressMode()} delayPressIn={0}>
        <View style={{ ...styles.action, ...styles.actionProgress }}>
          <Image style={styles.actionIcon} source={require("../../../assets/icons/progress.png")} />
          <Text style={styles.actionText}>Record Progress</Text>
        </View>
      </TouchableNativeFeedback>
    </Fragment>
  );

  if (isRecordProgressMode) {
    action = <RecordProgress onCancel={() => cancelRecordProgressMode()}
                             ref={component => {recordProgressComponent = component;}}
                             goal={props.current} />;

  }

  return (
    <View style={styles.outerContainer}>
      <ParallaxScrollView
        backgroundColor="#FFF"
        style={styles.container}
        renderBackground={() => <ImageBackground source={require("../../../assets/bg/header.png")} style={{ width: "100%", height: parallaxHeaderHeight }} resizeMode="stretch"><View /></ImageBackground>}
        renderForeground={() => renderHeader()}
        fadeOutForeground={false}
        outputScaleValue={19}
        refreshControl={<RefreshControl refreshing={refreshing}
                                        onRefresh={() => {
                                          setRefreshing(true);

                                          setTimeout(() => setRefreshing(false));
                                        }} />}
        parallaxHeaderHeight={parallaxHeaderHeight}>
        <View style={styles.body}>
          <Estimate style={styles.estimate}
                    refreshing={refreshing}
                    deadline={moment(props.current.deadline * 1000).set({ minute: 9, hour: 0, second: 0 }).diff(moment(props.current.created_at * 1000).set({ minute: 9, hour: 0, second: 0 }), "months")}
                    value={props.current.value} />

          <ProgressList refreshing={refreshing} />
        </View>
      </ParallaxScrollView>

      <View style={{ ...styles.actions, ...(isRecordProgressMode ? styles.recordModeAction : {}) }}>
        {action}
      </View>
    </View>
  );
}

const mapStateToProps = state => ({
  current: state.goal.current
});

const mapDispatchToProps = {
  getCurrentGoal
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalProgress);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
    color: "rgba(255,255,255,1)",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -5, height: 5 },
    textShadowRadius: 10
  },
  progressLabel: {
    fontSize: 24,
    color: "rgba(255,255,255,0.8)",
    marginTop: -10,
    fontWeight: "bold",
    marginBottom: 9,
    textAlign: "center"
  },
  progressDeadline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: -10,
    textAlign: "center"
  },
  progressInformation: {},
  body: {
    marginTop: -40,
    backgroundColor: "#FFF",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    flexGrow: 1,
    flex: 1,
    height: "100%",
    // minHeight: viewportHeight - parallaxHeaderHeight + 80,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,

    elevation: 20
  },
  actions: {
    flexShrink: 1,
    flexGrow: 0,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    flexDirection: "row",
    backgroundColor: "#FFF"
  },
  action: {
    paddingVertical: 11,
    paddingHorizontal: 30,
    backgroundColor: "#3498df",
    borderRadius: 5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#3498df",
    flex: 1
  },
  actionText: {
    fontSize: 20,
    color: "#FFF",
    lineHeight: 24,
    textAlign: "center"
  },
  actionIcon: {
    marginRight: 10,
    width: 26,
    height: undefined,
    aspectRatio: 1,
    tintColor: "#FFF"
  },
  actionOnlyIcon: {
    width: 24,
    height: undefined,
    aspectRatio: 1,
    tintColor: "#3498df"
  },
  actionUpdate: {
    flex: 0,
    marginRight: 15,
    backgroundColor: "#FFF",
    borderWidth: 2,
    paddingLeft: 17,
    paddingRight: 17,
    // borderColor: 'transparent',
    elevation: 0
  },
  estimate: {
    backgroundColor: "transparent",
    paddingHorizontal: 30,
    paddingVertical: 0,
    paddingBottom: 20,
    marginHorizontal: -20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  recordModeAction: {
    elevation: 10
  },
  picture: {
    width: progressSize - 30,
    position: "absolute",
    top: 15,
    left: 15,
    height: undefined,
    aspectRatio: 1,
    borderRadius: progressSize - 30,
    zIndex: -1
  },
  pictureOverlay: {
    width: progressSize - 30,
    position: "absolute",
    top: 15,
    left: 15,
    height: progressSize - 30,
    aspectRatio: 1,
    borderRadius: progressSize - 30,
    zIndex: 0,
    backgroundColor: "rgba(0,0,0,0.2)"
  }
});

