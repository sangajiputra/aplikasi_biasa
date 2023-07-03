import React from "react";
import { StyleSheet, View } from "react-native";
import Shortcut from "./Shortcut";

export default function Navigation(){
  return (
    <View style={styles.container}>
      <Shortcut title="Note" nav="note" icon={require("../../../assets/icons/nav/note.png")} />
      <Shortcut title="E-Learning" nav='e_learning' icon={require("../../../assets/icons/nav/e-learning.png")} />
      <Shortcut title="Plan" nav='plan' icon={require("../../../assets/icons/nav/plan.png")} />
      <Shortcut title="E-Health" nav='e_health' icon={require("../../../assets/icons/nav/e-health.png")} />
      <Shortcut title="Goals" nav='goal' icon={require("../../../assets/icons/nav/goal.png")} />
      <Shortcut title="Support" nav='vital_sign' icon={require("../../../assets/icons/nav/momentlizer.png")} />
      <Shortcut title="Report" nav="report" icon={require("../../../assets/icons/nav/report.png")} />
      <Shortcut title="Moment" nav='moment' icon={require("../../../assets/icons/nav/moment.png")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    paddingTop: 6
  }

});
