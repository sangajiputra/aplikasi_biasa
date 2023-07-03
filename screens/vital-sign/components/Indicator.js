import React, { Fragment } from "react";
import { Alert, Animated, Image, LayoutAnimation, Platform, StyleSheet, TouchableNativeFeedback, UIManager, View } from "react-native";
import HTML from "react-native-render-html";
import { connect } from "react-redux";
import { checkIndicator, toggleVitalSignActivation } from "../../../states/actionCreators";
import moment from "moment/moment";
import baseFontStyle, { HTMLOpenLink } from "../../../html-style";
import Text from '../../../common/Text';

export function Indicator(props){
  const [iconCollapsableRotationAnimation] = React.useState(new Animated.Value(0));

  let iconCollapsableRotation = iconCollapsableRotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"]
  });

  const toggleHandle = () => {

    if (props.indicator.disabled) {
      Alert.alert("Information", "Please finish previous task before doing another task");
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      props.toggleVitalSignActivation(props.indicator.id);
    }
  };

  React.useEffect(() => {
      toggle();
  }, [props.indicator]);

  const toggle = () => {
    Animated.spring(iconCollapsableRotationAnimation, {
      toValue: props.indicator.active ? 1 : 0,
      useNativeDriver: true
    }).start();
  };

  const checkIndicator = () => {
    props.checkIndicator(props.indicator.id).then(result => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });
  };

  let label = null;

  if (props.indicator.isDone) {
    label = (
      <View style={{ ...styles.label, ...styles.labelDone }}>
        <Text style={styles.labelText}>Done</Text>
      </View>
    );
  } else {
    if (props.indicator.is_checked) {
      label = (
        <View style={{ ...styles.label, ...styles.labelReview }}>
          <Text style={styles.labelText}>In Review</Text>
        </View>
      );
    } else {
      label = (
        <View style={{ ...styles.label, ...styles.labelCurrent }}>
          <Text style={styles.labelText}>Pending</Text>
        </View>
      );
    }
  }

  let headerStyle = styles.header;

  if (props.indicator.disabled) {
    headerStyle = {
      ...headerStyle,
      ...styles.disabledHeader
    };
  }

  let action = null;

  if (!props.indicator.isDone) {
    if (!props.indicator.is_checked) {
      action = (
        <TouchableNativeFeedback onPress={() => checkIndicator()}>
          <View style={styles.action}>
            <Image style={styles.actionIcon} source={require("../../../assets/icons/send.png")} />
            <Text style={styles.actionText}>I Finish This Task</Text>
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      action = (
        <Fragment>
          <TouchableNativeFeedback onPress={() => Alert.alert("Information", "You already submit your task, please give your upline time to review your task")}>
            <View style={{ ...styles.action, ...styles.actionInReview }}>
              <Image style={styles.actionIcon} source={require("../../../assets/icons/verification.png")} />
              <Text style={{ ...styles.actionText, ...styles.actionTextInReview }}>In Review</Text>
            </View>
          </TouchableNativeFeedback>
          <Text style={styles.actionMeta}>Submitted at: {moment(props.indicator.checker.submitted_at * 1000).format("dddd, DD MMMM YYYY")}</Text>
        </Fragment>
      );
    }
  }

  return (
    <View style={styles.container} key={props.indicator.id}>
      <TouchableNativeFeedback delayPressIn={0} onPress={() => toggleHandle()}>
        <View style={headerStyle}>
          <Text style={styles.count}>{props.index + 1}</Text>
          <Text style={styles.title}>{props.indicator.title}</Text>
          {label}
          <Animated.Image style={{ ...styles.collapsableIcon, transform: [{ rotate: iconCollapsableRotation }] }} source={require("../../../assets/icons/down-arrow.png")} />
        </View>
      </TouchableNativeFeedback>
      <View>
        <View style={styles.body}>
          {props.indicator.active ?
            <Fragment>
              <HTML baseFontStyle={baseFontStyle}
                    onLinkPress={HTMLOpenLink}
                    html={props.indicator.content} />

              {action ? <View style={styles.actions}>{action}</View> : null}
            </Fragment> : null
          }
        </View>
      </View>
    </View>
  );
}

const mapDispatchToProps = {
  toggleVitalSignActivation,
  checkIndicator
};

export default connect(null, mapDispatchToProps)(Indicator);

const styles = StyleSheet.create({
  container: {
    borderColor: "#F5f5f5",
    borderWidth: 1,
    marginBottom: 15,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden"
  },
  header: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    alignItems: "center"
  },
  disabledHeader: {
    opacity: 0.4
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    flex: 1,
    color: "#666",
    lineHeight: 22
  },
  body: {
    paddingHorizontal: 15,
    overflow: "hidden"
  },
  collapsableIcon: {
    width: 20,
    height: undefined,
    aspectRatio: 1,
    opacity: 0.4
  },
  count: {
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#EEE",
    padding: 5,
    minWidth: 30,
    textAlign: "center",
    borderRadius: 30,
    marginVertical: -7,
    marginLeft: -7
  },
  label: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    marginVertical: -4,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 4
  },
  labelText: {
    color: "#FFF",
    textTransform: "uppercase",
    fontSize: 10,
    fontWeight: "bold"
  },
  labelDone: {
    backgroundColor: "#63ba1b"
  },
  labelCurrent: {
    backgroundColor: "#74bfc3"
  },
  labelReview: {
    backgroundColor: "#f2893d"
  },
  actions: {
    paddingBottom: 15
  },
  action: {
    backgroundColor: "#30a344",
    paddingVertical: 10,
    paddingHorizontal: 15 ,
    elevation: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#30a344',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionInReview: {
    borderColor: "#f2893d",
    backgroundColor: "transparent",
    elevation: 0
  },
  actionText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 20,
    marginTop: -3
  },
  actionTextInReview: {
    color: "#f2893d"
  },
  actionMeta: {
    fontSize: 11,
    color: "#777",
    marginTop: 5,
    textAlign: "center"
  },
  actionIcon: {
    width: 24,
    height: undefined,
    aspectRatio: 1,
    marginRight: 10
  }
});
