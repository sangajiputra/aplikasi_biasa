import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { getGoalProgress } from "../../../states/actionCreators";
import Text from "../../../common/Text";
import moment from "moment";

export function ProgressList(props){
  const packages = {
    "G": "Gold",
    "P": "Platinum",
    "S": "Silver",
    "B": "Bronze",
    "U": "Userpack"
  };

  React.useEffect(() => {
    props.getGoalProgress();
  }, []);

  React.useEffect(() => {

    if(props.refreshing){
      props.getGoalProgress()
    }

  },[props.refreshing]);

  return (
    <View style={styles.container}>
      {props.progress.length > 0 && <Text style={styles.header}>Progress History</Text>}
      {props.progress.map(item => {
        return (
          <View style={styles.progress} key={item.id.toString()}>
            <Image style={styles.packageIcon} source={require("../../../assets/icons/progress.png")} />
            <Text style={styles.packageText}>{item.amount} {packages[item.package]}</Text>
            <View style={styles.date}>
              <Text style={styles.time}>{moment(item.created_at * 1000).format("dddd, DD-MM-YYYY")}</Text>
              <Text style={styles.relativeTime}>{moment(item.created_at * 1000).fromNow()}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const mapStateToProps = state => ({
  progress: state.goal.progress
});

const mapDispatchToProps = {
  getGoalProgress
};

export default connect(mapStateToProps, mapDispatchToProps)(ProgressList);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBFBFB',
    flex: 1
  },
  header: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontFamily: 'QuicksandBold'
  },
  progress: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    flexDirection: "row",
    alignItems: "center"
  },
  packageText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1
  },
  packageIcon: {
    width: 24,
    height: undefined,
    aspectRatio: 1,
    tintColor: "#3498df",
    marginRight: 8
  },
  time: {
    textAlign: "right"
  },
  relativeTime: {
    textAlign: "right"
  }
});
