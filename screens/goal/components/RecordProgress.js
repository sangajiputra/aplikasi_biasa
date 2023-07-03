import React from "react";
import { StyleSheet, TouchableNativeFeedback, KeyboardAvoidingView, View } from "react-native";
import Text from "../../../common/Text";
import TextInput from "../../../common/TextInput";
import { recordGoalProgress } from "../../../states/actionCreators";
import { connect } from "react-redux";

export class RecordProgress extends React.Component {
  packages = {
    "G": "Gold",
    "P": "Platinum",
    "S": "Silver",
    "U": "Userpack",
    "B": "Bronze",
  };

  packageInputs = {};

  constructor(props){
    super(props);

    let packageValues = {};

    this.state = {
      packages: packageValues
    };

    for (let packageKey in this.packages) {
      packageValues[packageKey] = 0;
      this.packageInputs[packageKey] = null;
    }
  }

  setPackageValue(value, packageKey){
    let packages = this.state.packages;

    packages[packageKey] = value;

    this.setState(packages);
  }

  save(){
    this.props.recordGoalProgress(this.props.goal.id, this.state.packages).then(result => {
      if (!result.error && result.payload.data.success) {
        this.cancel();
      }
    });
  }

  cancel(){
    this.props.onCancel();
  }

  render(){
    let inputs = [];

    for (let packageKey in this.packages) {
      let packageName = this.packages[packageKey];

      inputs.push(
        <View style={styles.formGroupContainer}>
          <View style={styles.formGroup} key={packageKey}>
            <Text onPress={() => this.packageInputs[packageKey].input.focus()} style={styles.formLabel}>{packageName}</Text>
            <TextInput keyboardType="decimal-pad"
                       selectTextOnFocus={true}
                       ref={input => this.packageInputs[packageKey] = input}
                       value={this.state.packages[packageKey].toString()}
                       onChangeText={value => this.setPackageValue(value, packageKey)}
                       style={styles.formInput} />
          </View>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.header}>Enter the number of package you are recruited today</Text>
        <View style={styles.form}>
          {inputs}
        </View>
        <View style={styles.actions}>
          <TouchableNativeFeedback onPress={() => this.cancel()} delayPressIn={0}>
            <View style={{ ...styles.action, ...styles.actionCancel }}>
              <Text style={{ ...styles.actionText, ...styles.actionTextCancel }}>Cancel</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this.save()} delayPressIn={0}>
            <View style={{ ...styles.action, ...styles.actionSave }}>
              <Text style={styles.actionText}>Save</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = {
  recordGoalProgress
};

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(RecordProgress);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold"
  },
  form: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"
  },
  formGroup: {
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#FFF",
    elevation: 1,
    marginVertical: 5,
    marginHorizontal: 5
  },
  formGroupContainer: {
    width: "33%",
  },
  formLabel: {
    textAlign: "center",
    paddingBottom: 4
  },
  formInput: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold"
  },
  actions: {
    flexShrink: 1,
    flexGrow: 0,
    paddingHorizontal: 5,
    marginTop: 15,
    flexDirection: "row"
  },
  action: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    backgroundColor: "#4593b6",
    borderRadius: 5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#4593b6",
    flex: 1
  },
  actionText: {
    fontSize: 16,
    color: "#FFF",
    lineHeight: 20,
    textAlign: "center"
  },
  actionIcon: {
    marginRight: 10,
    width: 26,
    height: undefined,
    aspectRatio: 1
  },
  actionCancel: {
    marginRight: 20,
    borderColor: "transparent",
    backgroundColor: "#EEE"
  },
  actionTextCancel: {
    color: "#666"
  }
});
