import React from "react";
import { Image, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../common/Text";
import TextInput from "../../common/TextInput";
import Toggle from "../e-health/components/Toggle";
import PhotoPicker from "../../common/PhotoPicker";

export default class EHealthScreen extends React.Component {
  state = {
    name: "",
    height: null,
    weight: null,
    age: null,
    gender: EHealthScreen.genderOptions.find(gender => gender.value === "M"),
    avatar: null
  };

  static genderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" }
  ];

  render(){
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image source={require("../../assets/bg/header.png")} style={styles.avatarContainer} />

          <View style={styles.content}>
            <PhotoPicker source={require("../../assets/bg/header.png")}
                         onPick={value => this.setState({ avatar: value })}
                         style={styles.avatar} />

            <View style={styles.form}>
              <View style={{ ...formStyles.section, flexShrink: 1, flex: 1 }}>
                <Text style={formStyles.label}>
                  Name
                </Text>
                <View style={formStyles.inputContainer}>
                  <TextInput style={formStyles.textInput}
                             placeholder="Enter the name"
                             value={this.state.name}
                             onChangeText={value => this.setState({ name: value })}
                             placeholderTextColor="#CCC"
                  />
                </View>
              </View>

              <View style={{ ...formStyles.section, ...formStyles.genderSection }}>
                <Text style={{ ...formStyles.label, ...formStyles.genderLabel }}>
                  Gender
                </Text>
                <View style={formStyles.inputContainer}>
                  <Toggle onChange={value => this.setState({ gender: EHealthScreen.genderOptions.find(gender => gender.value === value) })}
                          default="M"
                          items={EHealthScreen.genderOptions}
                  />
                </View>
              </View>
            </View>

            <View style={styles.personal}>
              <View style={{ ...formStyles.section, flex: 1, marginRight: 15 }}>
                <Text style={formStyles.label}>
                  Height
                </Text>
                <View style={formStyles.inputContainer}>
                  <TextInput style={formStyles.textInput}
                             placeholder="eg: 160"
                             placeholderTextColor="#CCC"
                             keyboardType="decimal-pad"
                             value={this.state.height}
                             onChangeText={value => this.setState({ height: value })}
                  />
                  <Text>cm</Text>
                </View>
              </View>
              <View style={{ ...formStyles.section, flex: 1, marginRight: 15 }}>
                <Text style={formStyles.label}>
                  Weight
                </Text>
                <View style={formStyles.inputContainer}>
                  <TextInput style={formStyles.textInput}
                             placeholderTextColor="#CCC"
                             placeholder="eg: 60"
                             keyboardType="decimal-pad"
                             value={this.state.weight}
                             onChangeText={value => this.setState({ weight: value })}
                  />
                  <Text>kg</Text>
                </View>
              </View>
              <View style={{ ...formStyles.section, flex: 1 }}>
                <Text style={formStyles.label}>
                  Age
                </Text>
                <View style={formStyles.inputContainer}>
                  <TextInput style={formStyles.textInput}
                             placeholder="eg: 20"
                             placeholderTextColor="#CCC"
                             keyboardType="decimal-pad"
                             value={this.state.age}
                             onChangeText={value => this.setState({ age: value })}
                  />
                </View>
              </View>
            </View>
          </View>

        </ScrollView>

        <View style={styles.addButton}>
          <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("e_health.disease", { data: this.state })}
                                   useForeground={true}>
            <Image style={styles.addButtonIcon} source={require("../../assets/icons/next.png")} />
          </TouchableNativeFeedback>
        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    backgroundColor: "#FFF",
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center"
  },
  form: {
    flexDirection: "row",
    padding: 15
  },
  content: {
    paddingTop: 45,
    flex: 1,
    marginTop: -30,
    backgroundColor: "#FFF",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    position: "relative",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,

    elevation: 20
  },
  avatarContainer: {
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover"
  },
  avatar: {
    width: 100,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 75,
    marginHorizontal: "auto",
    position: "absolute",
    top: -50,
    left: "50%",
    marginLeft: -50,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.5)"
  },
  personal: {
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 15
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 999999
  },
  addButtonIcon: {
    width: 90,
    height: undefined,
    aspectRatio: 1
  }
});

const formStyles = StyleSheet.create({
  section: {
    borderBottomWidth: 2,
    borderBottomColor: "#DDD",
    paddingTop: 10
  },
  genderSection: {
    borderBottomColor: "transparent",
    marginLeft: 15
  },
  label: {
    fontSize: 14,
    color: "#888"
  },
  genderLabel: {
    marginBottom: 11
  },
  labelEmoji: {
    fontSize: 20
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 8,
    textAlignVertical: "top",
    flex: 1
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});
