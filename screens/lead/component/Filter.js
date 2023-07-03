import React from "react";
import { Image, LayoutAnimation, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import BottomModal from "../../../common/BottomModal";
import Text from "../../../common/Text";
import LeadStatusPicker from "./LeadStatusPicker";
import { styles as menuStyles } from "../../../common/Selector";
import FilterAddress from "./FilterAddress";
import { Lead } from "./Lead";

export default class Filter extends React.Component {

  state = {
    visible: false,
    hasChanged: false,
    view: "default",
    status: {},
    fastScore: {},
    province: {},
    city: {}
  };

  close(){
    this.setState({ visible: false });
  }

  open(){
    this.setState({ visible: true });
  }

  async clear(){
    await this.setState({
      hasChanged: false,
      status: {},
      fastScore: {},
      province: {},
      city: {}
    });

    this.triggerChange();
    this.close();
  }

  changeView(view){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.setState({ view: view });
  }

  triggerChange(){
    if (this.props.onChange) {
      this.props.onChange({
        province: this.state.province,
        city: this.state.city,
        status: this.state.status,
        fastScore: this.state.fastScore,
      });
    }
  }

  async changeStatus(status){
    await this.setState({ status: status, hasChanged: true });

    this.triggerChange();
  }

  async changeFastScore(fastScore){
    await this.setState({ fastScore: fastScore, hasChanged: true });

    this.triggerChange();
  }

  async changeProvince(province){
    await this.setState({ province: province, hasChanged: true });

    this.triggerChange();
  }

  async changeCity(city){
    await this.setState({ city: city, hasChanged: true });

    this.triggerChange();
  }

  renderDefault(){
    return (
      <View>
        <View style={menuStyles.title}>
          <Text style={menuStyles.titleText}>Filter Options</Text>

          {this.state.hasChanged && <TouchableNativeFeedback onPress={() => this.clear()}>
            <View style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear Filter</Text>
            </View>
          </TouchableNativeFeedback>}
        </View>
        <TouchableNativeFeedback onPress={() => this.changeView("status")}>
          <View style={{ ...menuStyles.option, ...styles.filterOption }}>
            <Text style={menuStyles.optionText}>by Status</Text>
            {
              this.state.status.value &&
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ ...styles.statusBullet, backgroundColor: this.state.status.color }} />
                <Text style={{ ...styles.statusText, color: this.state.status.color }}>
                  {this.state.status.label}
                </Text>
              </View>
            }
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={() => this.changeView("fast")}>
          <View style={{ ...menuStyles.option, ...styles.filterOption }}>
            <Text style={menuStyles.optionText}>by FAST Score</Text>
            {
              this.state.fastScore.value &&
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ ...styles.statusBullet, backgroundColor: Lead.getFastScoreColor(this.state.fastScore.score) }} />
                <Text style={{ ...styles.statusText, color: Lead.getFastScoreColor(this.state.fastScore.score) }}>
                  {this.state.fastScore.label}
                </Text>
              </View>
            }
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={() => this.changeView("location")}>
          <View style={{ ...menuStyles.option, ...styles.filterOption }}>
            <Text style={menuStyles.optionText}>by Location</Text>

            <View style={styles.filterAddressValue}>
              <Text numberOfLines={1}>
                {[this.state.province.name, this.state.city.name].join(", ")}
              </Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  renderStatus(){
    return (
      <View>
        <View style={menuStyles.title}>
          <TouchableNativeFeedback onPress={() => this.changeView("default")}
                                   background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
            <View>
              <Image style={[menuStyles.titleIcon, menuStyles.titleIconLeft]} source={require("../../../assets/icons/back.png")} />
            </View>
          </TouchableNativeFeedback>
          <Text style={menuStyles.titleText}>Filter by Status</Text>
        </View>
        {LeadStatusPicker.STATUSES.map(status => {
          return (
            <TouchableNativeFeedback
              key={status.value}
              onPress={() => {
                this.changeStatus(status);
                this.changeView("default");
              }}>
              <View style={{ ...menuStyles.option, flexDirection: "row", alignItems: "center" }}>
                <View style={{ ...styles.statusBullet, backgroundColor: status.color }} />
                <Text style={{ ...menuStyles.optionText, ...styles.statusText, color: status.color }}>{status.label}</Text>
              </View>
            </TouchableNativeFeedback>
          );
        })}
      </View>
    );
  }

  renderFast(){
    const fastScores = [
      {label: 'Potential',score: 8,value: 'P'},
      {label: 'Average',score: 5,value: 'A'},
      {label: 'Under Average',score: 4,value: 'U'},
    ];

    return (
      <>
        <View style={menuStyles.title}>
          <TouchableNativeFeedback onPress={() => this.changeView("default")}
                                   background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
            <View>
              <Image style={[menuStyles.titleIcon, menuStyles.titleIconLeft]} source={require("../../../assets/icons/back.png")} />
            </View>
          </TouchableNativeFeedback>
          <Text style={menuStyles.titleText}>Filter by FAST Score</Text>
        </View>
        {fastScores.map(fastScore => {
          const color = Lead.getFastScoreColor(fastScore.score);

          return (
            <TouchableNativeFeedback
              key={fastScore.value}
              onPress={() => {
                this.changeFastScore(fastScore);
                this.changeView("default");
              }}>
              <View style={{ ...menuStyles.option, flexDirection: "row", alignItems: "center" }}>
                <View style={{ ...styles.statusBullet, backgroundColor: color }} />
                <Text style={{ ...menuStyles.optionText, ...styles.statusText, color: color }}>{fastScore.label}</Text>
              </View>
            </TouchableNativeFeedback>
          );
        })}
      </>
    );
  }

  renderLocation(){
    return (
      <FilterAddress onProvinceChange={province => this.changeProvince(province)}
                     onCityChange={city => {
                       this.changeCity(city);
                       this.changeView("default");
                     }}
      />
    );
  }

  handleBack(){
    if (this.state.view !== "default") {
      this.changeView("default");

      return false;
    }

    this.close();
  }

  render(){
    let content = null;

    switch (this.state.view) {
      case "status":
        content = this.renderStatus();
        break;
      case "fast":
        content = this.renderFast();
        break;
      case "location":
        content = this.renderLocation();
        break;
      default:
        content = this.renderDefault();
    }

    return (
      <BottomModal
        onRequestClose={() => this.handleBack()}
        visible={this.state.visible}
        transparent={true}
      >
        {content}
      </BottomModal>
    );
  }
}

const styles = StyleSheet.create({
  statusText: {
    textTransform: "uppercase"
  },
  statusBullet: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 6
  },
  filterAddressValue: {
    flex: 1,
    textAlign: "right",
    alignItems: "flex-end"
  },
  clearButton: {
    backgroundColor: "#e6f289",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 7,
    marginVertical: -10,
    marginRight: -5,
  },
  clearButtonText: {
    fontSize: 13
  }
});
