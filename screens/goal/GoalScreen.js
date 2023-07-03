import React from "react";
import { StyleSheet, View,KeyboardAvoidingView } from "react-native";
import { connect } from "react-redux";
import { getCurrentGoal } from "../../states/actionCreators";
import EmptyGoal from "./components/EmptyGoal";
import GoalProgress from "./components/GoalProgress";
import analytics from "@react-native-firebase/analytics";

export function GoalScreen(props){

  React.useEffect(() => {
    if (!props.doesCurrentGoalExist) {
      props.getCurrentGoal();
    }

    analytics().logEvent("goal")
  }, []);

  return (
    <View style={styles.container}>
      {!props.doesCurrentGoalExist && <EmptyGoal />}
      {props.doesCurrentGoalExist && <GoalProgress />}
    </View>
  );
}

const mapStateToProps = state => {
  return {
    current: state.goal.current,
    doesCurrentGoalExist: typeof state.goal.current.id !== "undefined"
  };
};

const mapDispatchToProps = {
  getCurrentGoal
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
