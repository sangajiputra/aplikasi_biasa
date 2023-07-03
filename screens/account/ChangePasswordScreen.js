import React, { Fragment } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Header from "./components/Header";
import { connect } from "react-redux";
import Text from "../../common/Text";
import TextInput from "../../common/TextInput";
import { changePassword } from "../../states/actionCreators";
import { useNavigation } from "@react-navigation/native";

export function ProfileScreen(props){
  const [isLoading, setIsLoading] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const navigation = useNavigation();

  const save = () => {
    setIsLoading(true);

    props.changePassword(oldPassword, newPassword, repeatPassword).then(result => {
      if (!result.error && result.payload.data.success) {
        navigation.goBack();
      }
    }).finally(() => setIsLoading(false));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Header user={props.user} />
        <KeyboardAvoidingView style={styles.content}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Current password</Text>
            <TextInput value={oldPassword} onChangeText={(value) => setOldPassword(value)} secureTextEntry={true} textContentType="password" style={styles.fieldValue} placeholder="Type your current password to verify" />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>New password</Text>
            <TextInput value={newPassword} onChangeText={(value) => setNewPassword(value)} secureTextEntry={true} textContentType="password" style={styles.fieldValue} placeholder="Type your new password" />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Confirmation</Text>
            <TextInput value={repeatPassword} onChangeText={(value) => setRepeatPassword(value)} secureTextEntry={true} textContentType="password" style={styles.fieldValue} placeholder="Retype your new password" />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <View style={styles.action}>
        <TouchableNativeFeedback delayPressIn={0} disabled={isLoading} onPress={() => save()}>
          <View style={styles.saveButton}>
            {isLoading ? <ActivityIndicator color='#FFF' size={26} /> : <Fragment>
              <Image source={require("../../assets/icons/send.png")} style={styles.saveButtonIcon} />
              <Text style={styles.saveButtonText}>Change Password</Text>
            </Fragment>
            }
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  changePassword
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  field: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#EEE"
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: "QuicksandBold"
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: 5
  },

  action: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#FFF"
  },
  saveButton: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    backgroundColor: "#3498df",
    borderRadius: 5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  saveButtonText: {
    fontSize: 20,
    color: "#FFF",
    lineHeight: 20
  },
  saveButtonIcon: {
    marginRight: 10,
    width: 26,
    height: undefined,
    aspectRatio: 1
  }
});
