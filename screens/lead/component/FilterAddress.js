import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../../common/Text";
import AddressPicker from "../../../common/AddressPicker";

export default class FilterAddress extends React.Component {
  model = null;

  constructor(props){
    super(props);

    this.state = {
      stage: "",
      province: props.province ? props.province : {},
      city: props.city ? props.city : {},
      provinces: [],
      cities: []
    };
  }

  componentDidMount(){
    if (!this.state.stage) {
      this.open("P");
    }
  }

  selectProvince(province){
    this.setState({ province: province, cities: [] }, () => {
      if (this.props.onProvinceChange) {
        this.props.onProvinceChange(province);
      }

      this.open("C");
    });
  }

  selectCity(city){
    this.setState({ city: city }, () => {
      if (this.props.onCityChange) {
        this.props.onCityChange(city);
      }

      this.close();
    });
  }

  renderProvince(province){
    return (
      <TouchableNativeFeedback delayPressIn={0} onPress={() => this.selectProvince(province)}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{province.name}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  renderCity(city){
    return (
      <TouchableNativeFeedback delayPressIn={0} onPress={() => this.selectCity(city)}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{city.name}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  load(){
    if (this.state.stage === "C") {
      if (Object.keys(this.state.province).length === 0) {
        this.open("P");
      } else {
        AddressPicker.loadCity(this.state.province.code).then(result => {
          this.setState({ cities: result.data.data });
        });
      }
    } else {
      AddressPicker.loadProvince().then(result => {
        this.setState({ provinces: result.data.data });
      });
    }
  }

  open(stage){
    this.setState({ stage: stage, visible: true }, () => {
      setTimeout(() => {
        this.load();
      }, 300);
    });
  }

  close(){
    this.setState({ visible: false });
  }

  emptyComponent(){
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  render(){
    return (
      <>
        <View style={styles.tabs}>
          <TouchableNativeFeedback delayPressIn={0} onPress={() => this.open("P")}>
            <View style={{ ...styles.tab, ...(this.state.stage === "P" ? styles.tabActive : {}) }}>
              <Text style={{ ...styles.tabText, ...(this.state.stage === "P" ? styles.tabTextActive : {}) }}>Province</Text>
            </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback disabled={Object.keys(this.state.province).length === 0} delayPressIn={0} onPress={() => this.open("C")}>
            <View style={{ ...styles.tab, ...(this.state.stage === "C" ? styles.tabActive : {}) }}>
              <Text style={{ ...styles.tabText, ...(this.state.stage === "C" ? styles.tabTextActive : {}) }}>City</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        {this.state.stage === "P" && <FlatList
          style={styles.scroller}
          data={this.state.provinces}
          ListEmptyComponent={this.emptyComponent}
          renderItem={item => this.renderProvince(item.item)}
          keyExtractor={item => item.code}
        />}

        {this.state.stage === "C" && <FlatList
          style={styles.scroller}
          data={this.state.cities}
          ListEmptyComponent={this.emptyComponent}
          renderItem={item => this.renderCity(item.item)}
          keyExtractor={item => item.id.toString()}
        />}
      </>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  itemText: {
    fontSize: 15
  },
  scroller: {
    height: 600
  },
  containerLoading: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    paddingVertical: 30,
    justifyContent: "center"
  },
  tabs: {
    borderBottomWidth: 2,
    borderBottomColor: "#EEE",
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: "#f2f2f2"
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  tabText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16
  },
  tabTextActive: {
    color: "#3498df"
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498df",
    marginBottom: -2
  }
});
