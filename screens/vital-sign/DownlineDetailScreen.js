import React from "react";
import { ActivityIndicator, Image, LayoutAnimation, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { connect, useSelector } from "react-redux";
import { approveIndicator, getDownline } from "../../states/actionCreators";
import { useNavigation, useRoute } from "@react-navigation/native";
import HTML from "react-native-render-html";
import baseFontStyle, { HTMLOpenLink } from "../../html-style";
import Text from '../../common/Text';
import analytics from "@react-native-firebase/analytics";

export function DownlineDetailScreen(props){
  const route = useRoute();
  const navigation = useNavigation();

  const _downline = useSelector(state => {
    return state.downline._downlines.find(_downline => {
      return _downline.id == route.params.id;
    });
  });

  const [downline, setDownline] = React.useState({});

  React.useEffect(() => {
    props.getDownline(route.params.id);

    analytics().logEvent('downline_detail');
  }, []);

  React.useEffect(() => {
    if (typeof _downline !== "undefined") {
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setDownline(_downline);
    }
  }, [_downline]);

  const approve = () => {
    props.approveIndicator(downline.current_indicator.id, downline.id).then(result => {
      if (result.payload.data.success) {
        props.getDownline(route.params.id);
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.avatar} source={{uri: downline.account?.avatar_thumbnail_url}} />
        <View style={styles.meta}>
          <Text style={styles.name}>{downline.name}</Text>
          <Text style={styles.rank}>{downline.stage?.name}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.bodyTitle}>Current Task:</Text>
        <View style={styles.indicatorContainer}>
          <View style={styles.indicatorHeader}>
            <Text style={styles.indicatorTitle}>{downline.current_indicator?.title}</Text>
            {
              downline.current_checker && !downline.current_checker.is_approved ? <View style={{ ...styles.label, ...styles.labelReview }}>
                <Text style={styles.labelText}>Review Needed</Text>
              </View> : null
            }
          </View>
          <View style={styles.indicatorContent}>
            {
              downline.current_indicator ? <HTML html={downline.current_indicator?.content}
                                                 baseFontStyle={baseFontStyle}
                                                 onLinkPress={HTMLOpenLink} /> : <ActivityIndicator />
            }
          </View>

          {
            downline.current_indicator && (downline.current_checker && !downline.current_checker.is_approved) ?
              <TouchableNativeFeedback onPress={() => approve()}>
                <View style={styles.action}>
                  <Image style={styles.actionIcon} source={require("../../assets/icons/send.png")} />
                  <Text style={styles.actionText}>Verify Progress</Text>
                </View>
              </TouchableNativeFeedback> : null
          }
        </View>
      </View>
    </ScrollView>
  );
}

const mapDispatchToProps = {
  getDownline,
  approveIndicator
};

export default connect(null, mapDispatchToProps)(DownlineDetailScreen);

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderBottomColor: "#DDD"
  },
  name: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 5
  },
  rank: {
    textAlign: "center"
  },
  avatar: {
    width: 80,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 80,
    marginBottom: 10,
    backgroundColor: '#DDD'
  },
  indicatorContainer: {
    borderColor: "#F5f5f5",
    borderWidth: 1,
    marginBottom: 15,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden"
  },
  indicatorHeader: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    alignItems: "center"
  },
  indicatorTitle: {
    fontWeight: "bold",
    fontSize: 15,
    flex: 1,
    color: "#666",
    lineHeight: 22
  },
  indicatorContent: {
    padding: 15,
    overflow: "hidden"
  },
  bodyTitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold"
  },
  action: {
    backgroundColor: "#30a344",
    paddingVertical: 13,
    paddingHorizontal: 30,
    elevation: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginHorizontal: 10
  },
  actionInReview: {
    borderColor: "#f2893d",
    borderWidth: 2,
    backgroundColor: "transparent",
    elevation: 0
  },
  actionText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 20
  },
  actionIcon: {
    width: 24,
    height: undefined,
    aspectRatio: 1,
    marginRight: 10
  },
  label: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    marginVertical: -4,
    marginLeft: 20,
    borderRadius: 4
  },
  labelText: {
    color: "#FFF",
    textTransform: "uppercase",
    fontSize: 10,
    fontWeight: "bold"
  },
  labelReview: {
    backgroundColor: "#f2893d"
  }
});
