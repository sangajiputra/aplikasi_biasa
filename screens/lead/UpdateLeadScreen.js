import React, { Fragment } from "react";
import { ActivityIndicator, Image, LayoutAnimation, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { connect } from "react-redux";
import Text from "../../common/Text";
import TextInput from "../../common/TextInput";
import { saveLead, showNav } from "../../states/actionCreators";
import PhotoPicker from "../../common/PhotoPicker";
import LeadStatusPicker from "./component/LeadStatusPicker";
import AddressPicker from "../../common/AddressPicker";
import Selector from "../../common/Selector";
import Tab from "./component/Tab";
import moment from "moment";
import DiseasePicker from "../../common/DiseasePicker";
import analytics from "@react-native-firebase/analytics";

export class UpdateLeadScreen extends React.Component {
  addressPicker = null;
  diseasePicker = null;
  financialSelector = null;
  ambitionSelector = null;
  sociabilitySelector = null;
  teachabilitySelector = null;

  static fastScoring = [
    {
      value: 1,
      label: "Bellow you (SCORE: 1)",
      color: "#d4e6ff"
    },
    {
      value: 2,
      label: "Equal to you (SCORE: 2)",
      color: "#ffddf8"
    },
    {
      value: 3,
      label: "Above you (SCORE: 3)",
      color: "#fffbc0"
    }
  ];

  static getFastScoringLabel(value){
    return UpdateLeadScreen.fastScoring.find(item => item.value == value);
  }

  constructor(props){
    super(props);

    const propsData = props.route.params?.data ? props.route.params.data : {};

    this.state = {
      modalShow: false,
      isLoading: false,
      province: {},
      city: {},
      disease: {},
      data: {
        name: "",
        weight: "",
        height: "",
        age: propsData.age ? propsData.age : "",
        gender: "",
        status: "",
        email: "",
        phone: "",
        address: "",
        note: "",
        ambition_score: null,
        sociability_score: null,
        teachability_score: null,
        disease_id: null,
        uploaded_photo: propsData.uploaded_photo ? propsData.uploaded_photo : ""
      },
      errors: {}
    };

    if (props.route.params?.id) {
      this.state.data = props.leads.find(lead => lead.id == props.route.params.id);
    }

    this.state.data = { ...this.state.data, ...propsData };

    if (this.state.data.disease) {
      this.state.disease = this.state.data.disease;
    }

    if (this.state.data.birth_date) {
      this.state.data.age = moment().diff(moment(this.state.data.birth_date * 1000), "year");
    }

    if (this.state.data.province) {
      this.state.province = this.state.data.province;
    }

    if (this.state.data.city) {
      this.state.city = this.state.data.city;
    }
  }

  componentDidMount(){
    if (typeof this.props.route.params?.id === "undefined") {
      this.props.navigation.setOptions({
        headerTitle: "Add Lead"
      });
    }

    analytics().logEvent('lead_form');
  }

  save(){
    this.setState({ isLoading: true });

    this.props.saveLead({
      name: this.state.data.name,
      status: this.state.data.status,
      email: this.state.data.email,
      phone: this.state.data.phone,
      weight: this.state.data.weight,
      height: this.state.data.height,
      disease_id: this.state.disease.id,
      birth_date: moment().subtract(this.state.data.age, "year").format("YYYY-MM-DD"),
      address: this.state.data.address,
      note: this.state.data.note,
      city_id: this.state.city.id,
      province_code: this.state.province.code,
      uploaded_photo: this.state.data.uploaded_photo,
      financial_score: this.state.data.financial_score,
      ambition_score: this.state.data.ambition_score,
      sociability_score: this.state.data.sociability_score,
      teachability_score: this.state.data.teachability_score
    }, this.state.data.id).then(result => {
      if (result.error) {
        let _errors = {};

        if (result.error.response && result.error.response.data.type === "model-errors") {
          result.error.response.data.data.forEach(field => {
            _errors[field.field] = field.message;
          });
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        this.setState({ errors: _errors });
      } else if (result.payload.data.success) {
        if (this.props.route.params?.from === "e-health") {
          this.props.navigation.goBack();
        }

        this.props.navigation.navigate("lead");
      }
    }).finally(() => this.setState({ isLoading: false }));
  }

  render(){
    const financial = UpdateLeadScreen.getFastScoringLabel(this.state.data.financial_score) || {};
    const ambition = UpdateLeadScreen.getFastScoringLabel(this.state.data.ambition_score) || {};
    const sociability = UpdateLeadScreen.getFastScoringLabel(this.state.data.sociability_score) || {};
    const teachability = UpdateLeadScreen.getFastScoringLabel(this.state.data.teachability_score) || {};
    let avatar = undefined;

    if (this.state.data.photo_thumbnail_url) {
      avatar = { uri: this.state.data.photo_thumbnail_url };
    } else if (this.state.data.uploaded_photo) {
      avatar = { uri: this.state.data.uploaded_photo };
    }

    return (
      <>
        {typeof this.state.data.id !== "undefined" && <Tab active="update" leadId={this.state.data.id} />}

        <ScrollView>
          <View behavior="height" style={styles.container}>

            <AddressPicker
              transparent={true}
              ref={component => this.addressPicker = component}
              onCityChange={(city) => {
                this.setState({ city: city });
              }}
              onProvinceChange={(province) => {
                this.setState({ province: province });
              }} />

            <DiseasePicker
              transparent={true}
              ref={component => this.diseasePicker = component}
              onSelect={(disease) => {
                this.setState({ disease: disease });
              }} />

            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <PhotoPicker onPick={(value) => this.setState({ data: { ...this.state.data, uploaded_photo: value } })}
                             value={avatar}
                             style={styles.avatar} />
              </View>

              <View style={styles.headerForm}>
                <View style={formStyles.section}>
                  <Text style={formStyles.label}>
                    Name
                  </Text>
                  <View style={formStyles.inputContainer}>
                    <TextInput style={formStyles.textInput}
                               placeholder="Enter the lead name"
                               placeholderTextColor="#CCC"
                               value={this.state.data.name}
                               onChangeText={value => this.setState({ data: { ...this.state.data, name: value } })}
                    />
                  </View>
                </View>
                {this.state.errors.name && <Text style={formStyles.validation}>{this.state.errors.name}</Text>}

              </View>
            </View>

            <View style={styles.body}>
              <View style={{ ...formStyles.section, marginBottom: 5 }}>
                <Text style={{ ...formStyles.label, marginBottom: 12 }}>
                  Lead Status
                </Text>
                <View style={{ ...formStyles.inputContainer, borderBottomColor: "transparent" }}>
                  <LeadStatusPicker value={this.state.data.status}
                                    onSelect={value => this.setState({ data: { ...this.state.data, status: value } })} />
                </View>
                {this.state.errors.status && <Text style={formStyles.validation}>{this.state.errors.status}</Text>}
              </View>


              {/* START OF FAST SCORE*/}

              <View style={{ flexDirection: "row" }}>

                <View style={{ ...formStyles.section, flex: 1, marginRight: 15 }}>
                  <Text style={{ ...formStyles.label, ...styles.fastScoreLabel }}>
                    Financial
                  </Text>
                  <View style={styles.fastScoreWrapper}>
                    <Selector ref={component => this.financialSelector = component}
                              title="Select financial score"
                              onSelect={value => this.setState({ data: { ...this.state.data, financial_score: value.value } })}
                              options={UpdateLeadScreen.fastScoring} />
                    {
                      this.state.data.financial_score ?

                        <TouchableNativeFeedback onPress={() => this.financialSelector.open()}>
                          <View style={{ ...styles.fastScore, backgroundColor: financial.color }}>
                            <Text style={styles.fastScoreText}>Score</Text>
                            <Text style={styles.fastScoreValue}>{this.state.data.financial_score}</Text>
                          </View>
                        </TouchableNativeFeedback> :

                        <Text onPress={() => this.financialSelector.open()} style={styles.fastScorePlaceholder}>Set Score</Text>
                    }
                  </View>

                  {this.state.errors.financial_score && <Text style={formStyles.validation}>{this.state.errors.financial_score}</Text>}
                </View>

                <View style={{ ...formStyles.section, flex: 1, marginRight: 15 }}>
                  <Text style={{ ...formStyles.label, ...styles.fastScoreLabel }}>
                    Ambition
                  </Text>
                  <View style={styles.fastScoreWrapper}>
                    <Selector ref={component => this.ambitionSelector = component}
                              title="Select ambition score"
                              onSelect={value => this.setState({ data: { ...this.state.data, ambition_score: value.value } })}
                              value={2}
                              options={UpdateLeadScreen.fastScoring} />
                    {
                      this.state.data.ambition_score ?
                        <TouchableNativeFeedback onPress={() => this.ambitionSelector.open()}>

                          <View style={{ ...styles.fastScore, backgroundColor: ambition.color }}>
                            <Text style={styles.fastScoreText}>Score</Text>
                            <Text style={styles.fastScoreValue}>{this.state.data.ambition_score}</Text>
                          </View>
                        </TouchableNativeFeedback> :

                        <Text onPress={() => this.ambitionSelector.open()} style={styles.fastScorePlaceholder}>Set Score</Text>
                    }
                  </View>

                  {this.state.errors.ambition_score && <Text style={formStyles.validation}>{this.state.errors.ambition_score}</Text>}
                </View>

                <View style={{ ...formStyles.section, flex: 1, marginRight: 15 }}>
                  <Text style={{ ...formStyles.label, ...styles.fastScoreLabel }}>
                    Supel
                  </Text>
                  <View style={styles.fastScoreWrapper}>
                    <Selector ref={component => this.sociabilitySelector = component}
                              title="Select sociability score"
                              onSelect={value => this.setState({ data: { ...this.state.data, sociability_score: value.value } })}
                              value={2}
                              options={UpdateLeadScreen.fastScoring} />
                    {
                      this.state.data.sociability_score ?

                        <TouchableNativeFeedback onPress={() => this.sociabilitySelector.open()}>
                          <View style={{ ...styles.fastScore, backgroundColor: sociability.color }}>
                            <Text style={styles.fastScoreText}>Score</Text>
                            <Text style={styles.fastScoreValue}>{this.state.data.sociability_score}</Text>
                          </View>
                        </TouchableNativeFeedback> :

                        <Text onPress={() => this.sociabilitySelector.open()} style={styles.fastScorePlaceholder}>Set Score</Text>
                    }
                  </View>

                  {this.state.errors.sociability_score && <Text style={formStyles.validation}>{this.state.errors.sociability_score}</Text>}
                </View>

                <View style={{ ...formStyles.section, flex: 1, marginRight: 15 }}>
                  <Text style={{ ...formStyles.label, ...styles.fastScoreLabel }}>
                    Teachable
                  </Text>
                  <View style={styles.fastScoreWrapper}>
                    <Selector ref={component => this.teachabilitySelector = component}
                              title="Select teachability score"
                              onSelect={value => this.setState({ data: { ...this.state.data, teachability_score: value.value } })}
                              value={2}
                              options={UpdateLeadScreen.fastScoring} />
                    {
                      this.state.data.teachability_score ?

                        <TouchableNativeFeedback onPress={() => this.teachabilitySelector.open()}>
                          <View style={{ ...styles.fastScore, backgroundColor: teachability.color }}>
                            <Text style={styles.fastScoreText}>Score</Text>
                            <Text style={styles.fastScoreValue}>{this.state.data.teachability_score}</Text>
                          </View>
                        </TouchableNativeFeedback> :

                        <Text onPress={() => this.teachabilitySelector.open()} style={styles.fastScorePlaceholder}>Set Score</Text>
                    }
                  </View>

                  {this.state.errors.teachability_score && <Text style={formStyles.validation}>{this.state.errors.teachability_score}</Text>}
                </View>
              </View>

              {/* END OF FAST SCORE*/}


              <View style={formStyles.section}>
                <Text style={formStyles.label}>
                  Phone Number
                </Text>
                <View style={formStyles.inputContainer}>
                  <TextInput style={formStyles.textInput}
                             placeholder="Enter the lead's phone number"
                             value={this.state.data.phone}
                             onChangeText={value => this.setState({ data: { ...this.state.data, phone: value } })}
                             placeholderTextColor="#CCC"
                  />
                </View>
                {this.state.errors.phone && <Text style={formStyles.validation}>{this.state.errors.phone}</Text>}
              </View>

              <View style={formStyles.section}>
                <Text style={formStyles.label}>
                  Email
                </Text>
                <View style={formStyles.inputContainer}>
                  <TextInput style={formStyles.textInput}
                             onChangeText={value => this.setState({ data: { ...this.state.data, email: value } })}
                             value={this.state.data.email}
                             placeholder="Enter the lead's email address"
                             placeholderTextColor="#CCC"
                  />
                </View>
                {this.state.errors.email && <Text style={formStyles.validation}>{this.state.errors.email}</Text>}
              </View>

              <View style={styles.personal}>
                <View style={{ ...formStyles.section, flex: 1, marginRight: 25 }}>
                  <Text style={formStyles.label}>
                    Height
                  </Text>
                  <View style={formStyles.inputContainer}>
                    <TextInput style={formStyles.textInput}
                               placeholder="eg: 160"
                               placeholderTextColor="#CCC"
                               keyboardType="decimal-pad"
                               value={this.state.data.height ? this.state.data.height.toString() : ""}
                               onChangeText={value => this.setState({ data: { ...this.state.data, height: value } })}
                    />
                    <Text>cm</Text>
                  </View>
                </View>
                <View style={{ ...formStyles.section, flex: 1, marginRight: 25 }}>
                  <Text style={formStyles.label}>
                    Weight
                  </Text>
                  <View style={formStyles.inputContainer}>
                    <TextInput style={formStyles.textInput}
                               placeholderTextColor="#CCC"
                               placeholder="eg: 60"
                               keyboardType="decimal-pad"
                               value={this.state.data.weight ? this.state.data.weight.toString() : ""}
                               onChangeText={value => this.setState({ data: { ...this.state.data, weight: value } })}
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
                               value={this.state.data.age ? this.state.data.age.toString() : ""}
                               onChangeText={value => this.setState({ data: { ...this.state.data, age: value } })}
                    />
                  </View>
                </View>
              </View>

              <View style={formStyles.section}>
                <Text style={formStyles.label}>
                  Medical Record
                </Text>
                <View style={formStyles.inputContainer}>
                  <Text onPress={() => this.diseasePicker.open()} style={formStyles.textInput}>{this.state.disease.name}</Text>
                </View>
                {this.state.errors.disease_id && <Text style={formStyles.validation}>{this.state.errors.disease_id}</Text>}
              </View>


              <View style={{ flexDirection: "row" }}>

                <View style={{ ...formStyles.section, flex: 1, marginRight: 15 }}>
                  <Text style={formStyles.label}>
                    Province
                  </Text>
                  <View style={formStyles.inputContainer}>
                    <Text onPress={() => this.addressPicker.open("P")} style={formStyles.textInput}>{this.state.province.name}</Text>
                  </View>
                  {this.state.errors.province_code && <Text style={formStyles.validation}>{this.state.errors.province_code}</Text>}
                </View>


                <View style={{ ...formStyles.section, flex: 1, marginLeft: 15 }}>
                  <Text style={formStyles.label}>
                    City
                  </Text>
                  <View style={formStyles.inputContainer}>
                    <Text onPress={() => this.addressPicker.open("C")} style={formStyles.textInput}>{this.state.city.name}</Text>
                  </View>
                  {this.state.errors.city_id && <Text style={formStyles.validation}>{this.state.errors.city_id}</Text>}
                </View>
              </View>

              <View style={formStyles.section}>
                <Text style={formStyles.label}>
                  Address
                </Text>
                <View style={formStyles.inputContainer}>
                  <TextInput style={formStyles.textInput}
                             multiline={true}
                             numberOfLines={3}
                             value={this.state.data.address}
                             placeholder="Enter the lead's address"
                             onChangeText={value => this.setState({ data: { ...this.state.data, address: value } })}
                             placeholderTextColor="#CCC"
                  />
                </View>
                {this.state.errors.address && <Text style={formStyles.validation}>{this.state.errors.address}</Text>}
              </View>

              <View style={formStyles.section}>
                <Text style={formStyles.label}>
                  Note
                </Text>
                <View style={formStyles.inputContainer}>
                  <TextInput style={formStyles.textInput}
                             multiline={true}
                             numberOfLines={3}
                             value={this.state.data.note}
                             placeholder="Enter a note for this lead"
                             onChangeText={value => this.setState({ data: { ...this.state.data, note: value } })}
                             placeholderTextColor="#CCC"
                  />
                </View>
                {this.state.errors.note && <Text style={formStyles.validation}>{this.state.errors.note}</Text>}
              </View>
            </View>

          </View>
        </ScrollView>

        {/* START OF ACTION*/}

        <View style={styles.action}>
          <TouchableNativeFeedback disabled={this.state.isLoading} onPress={() => this.save()}>
            <View style={styles.saveButton}>
              {this.state.isLoading ? <ActivityIndicator color="#FFF" size={26} /> : <Fragment>
                <Image source={require("../../assets/icons/send.png")} style={styles.saveButtonIcon} />
                <Text style={styles.saveButtonText}>Save</Text>
              </Fragment>
              }
            </View>
          </TouchableNativeFeedback>
        </View>

        {/* END OF ACTION*/}

      </>
    );
  }
}

const mapDispatchToProps = {
  saveLead,
  showNav
};

const mapStateToProps = state => ({
  leads: state.lead.leads
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateLeadScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  avatar: {
    width: 70,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 100,
    marginRight: 15,
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.2)"
  },
  headerForm: {
    flex: 1
  },
  body: {
    paddingHorizontal: 15,
    flex: 1
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
  },
  fastScoreWrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: 5,
    justifyContent: "center"
  },
  fastScore: {
    backgroundColor: "#EEE",
    borderRadius: 30,
    paddingHorizontal: 10,
    textAlignVertical: "center",
    flexDirection: "row",
    height: 30
  },
  fastScoreValue: {
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30
  },
  fastScorePlaceholder: {
    backgroundColor: "#EEE",
    height: 30,
    lineHeight: 30,
    borderRadius: 30,
    fontSize: 12,
    paddingHorizontal: 10,
    fontWeight: "bold"
  },
  fastScoreLabel: {
    textAlign: "center"
  },
  fastScoreText: {
    fontSize: 10,
    textAlignVertical: "center",
    opacity: 0.6,
    fontWeight: "normal",
    textTransform: "uppercase",
    marginRight: 4
  },
  personal: {
    flexDirection: "row"
  }
});

const formStyles = StyleSheet.create({
  section: {
    paddingTop: 10,
    flexShrink: 1,
    marginBottom: 13
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#EEE",
    marginBottom: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  label: {
    fontSize: 14,
    color: "#888",
    fontFamily: "QuicksandBold"
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 8,
    textAlignVertical: "top",
    flex: 1
  },
  validation: {
    color: "#d55a46"
  }
});
