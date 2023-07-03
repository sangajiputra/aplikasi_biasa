import React from "react";
import { FlatList, Image, LayoutAnimation, StatusBar, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { connect } from "react-redux";
import { getLeads } from "../../states/actionCreators";
import Lead from "./component/Lead";
import TextInput from "../../common/TextInput";
import axios from "axios";
import config from "../../config";
import Text from "../../common/Text";
import LeadStatusPicker from "./component/LeadStatusPicker";
import { SafeAreaView } from "react-native-safe-area-context";
import App from "../../App";
import Filter from "./component/Filter";
import analytics from "@react-native-firebase/analytics";

export class LeadListScreen extends React.Component {

  searchTimeout = null;
  filterComponent = null;

  constructor(props){
    super(props);

    this.state = {
      isRefreshing: false,
      statistic: {
        status: [],
        fast_score: []
      },
      filterQuery: {
        province: {},
        city: {},
        fastScore: {},
        status: {}
      },
      query: ""
    };
  }

  componentDidMount(){
    this.load({}, true).then(result => {
      this.loadStatistic();
    });

    this.props.navigation.addListener("focus", LeadListScreen.setStatusBar);
    this.props.navigation.addListener("blur", App.setDefaultStatusBar);

    analytics().logEvent('lead_list');
  }

  componentWillUnmount(){
    clearTimeout(this.searchTimeout);

    this.props.navigation.removeListener("focus", LeadListScreen.setStatusBar);
    this.props.navigation.removeListener("blur", App.setDefaultStatusBar);
  }

  static setStatusBar(){
    StatusBar.setBackgroundColor("rgba(255,255,255,1)");
    StatusBar.setBarStyle("dark-content");
    StatusBar.setTranslucent(true);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (prevState.query != this.state.query || prevState.filterQuery !== this.state.filterQuery) {
      clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(() => {
        this.load();
      }, 300);
    }
  }

  loadStatistic(){
    return axios.get("/moment/lead/statistic", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken
      }
    }).then(result => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ statistic: result.data.data });
    });
  }

  load(params = {}, refresh = false){
    this.setState({ isRefreshing: true });

    return this.props.getLeads({
      q: this.state.query,
      status: this.state.filterQuery.status?.value,
      fast_score: this.state.filterQuery.fastScore?.value,
      province_code: this.state.filterQuery.province?.code,
      city_id: this.state.filterQuery.city?.id,
      ...params
    }).then(result => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      this.setState({ isRefreshing: false });

      if (refresh) {
        this.loadStatistic();
      }
    });
  }

  renderStatistic(){
    const total = this.state.statistic.status.reduce((total, item) => total + parseInt(item.count), 0);

    return (
      <View style={styles.statContainer}>

        <View style={styles.statSection}>
          <Text style={styles.statHeader}>Leads Status:</Text>
          <View style={styles.stateProgressWrapper}>
            <View style={styles.stateProgress}>
              {this.state.statistic.status.map(status => {
                const statusOption = LeadStatusPicker.getStatusOption(status.key);
                const percent = (status.count / total) * 100;

                return (
                  <View key={status.key} style={{ ...styles.stateProgressItem, width: percent + "%", backgroundColor: statusOption.color }} />
                );
              })}
            </View>
          </View>

          <View style={styles.statLegend}>
            {this.state.statistic.status.map(status => {
              const statusOption = LeadStatusPicker.getStatusOption(status.key);

              return (
                <View style={styles.statWrapper} key={status.key}>
                  <View style={{ ...styles.statBullet, backgroundColor: statusOption.color }} />
                  <Text style={{ ...styles.statValue, color: statusOption.color }}>{status.count}</Text>
                  <Text style={{ ...styles.statLabel, color: statusOption.color }}>{status.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.statSection}>
          <Text style={styles.statHeader}>Fast Score:</Text>
          <View style={styles.stateProgressWrapper}>
            <View style={styles.stateProgress}>
              {this.state.statistic.fast_score.map(score => {
                const scoreColor = Lead.getFastScoreColor(score.score);
                const percent = (score.count / total) * 100;

                return (
                  <View key={score.key} style={{ ...styles.stateProgressItem, width: percent + "%", backgroundColor: scoreColor }} />
                );
              })}
            </View>
          </View>

          <View style={styles.statLegend}>
            {this.state.statistic.fast_score.map(score => {
              const scoreColor = Lead.getFastScoreColor(score.score);

              return (
                <View style={styles.statWrapper} key={score.key}>
                  <View style={{ ...styles.statBullet, backgroundColor: scoreColor }} />
                  <Text style={{ ...styles.statValue, color: scoreColor }}>{score.count}</Text>
                  <Text style={{ ...styles.statLabel, color: scoreColor }}>{score.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }

  render(){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.addButton}>
          <TouchableNativeFeedback onPress={() => {this.props.navigation.navigate("update_lead");}} useForeground={true}>
            <Image style={styles.addButtonIcon} source={require("../../assets/icons/add.png")} />
          </TouchableNativeFeedback>
        </View>

        <View style={styles.leads}>
          <Filter ref={component => this.filterComponent = component}
                  onChange={value => this.setState({ filterQuery: value })}
          />

          <View style={styles.searchContainer}>
            <View style={styles.search}>
              <Image style={styles.searchIcon} source={require("../../assets/icons/search.png")} />
              <TextInput onChangeText={value => this.setState({ query: value })}
                         placeholderTextColor="#BBB"
                         style={styles.searchInput}
                         placeholder="Search Leads..." />
            </View>


            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                                     delayPressIn={0}
                                     onPress={() => this.filterComponent.open()}>
              <View style={styles.filter}>
                {this.filterComponent && this.filterComponent.state.hasChanged && <View style={styles.filterIndicator} />}
                <Image style={styles.searchRightIcon} source={require("../../assets/icons/filter.png")} />
                <Text style={styles.filterText}>Filter</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <FlatList
            style={styles.scroller}
            data={this.props.leads}
            keyExtractor={lead => lead.id.toString()}
            onRefresh={() => this.load({}, true)}
            refreshing={this.state.isRefreshing}
            ListHeaderComponent={() => this.renderStatistic()}
            renderItem={(item) => (
              <Lead data={item.item} navigation={this.props.navigation} />
            )}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  leads: state.lead.leads
});

const mapDispatchToProps = {
  getLeads
};

export default connect(mapStateToProps, mapDispatchToProps)(LeadListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  addButton: {
    position: "absolute",
    bottom: -5,
    right: 0,
    zIndex: 99
  },
  addButtonIcon: {
    width: 90,
    height: undefined,
    aspectRatio: 1
  },
  search: {
    borderRadius: 10,
    fontSize: 16,
    elevation: 5,
    backgroundColor: "#FFF",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1
  },
  searchInput: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1
  },
  searchContainer: {
    padding: 10,
    paddingTop: 13,
    paddingBottom: 13,
    position: "relative",
    flexDirection: "row",
    alignItems: 'center',
    paddingRight: 0
  },
  searchIcon: {
    width: 25,
    aspectRatio: 1,
    height: undefined,
    tintColor: "#CCC"
  },
  searchRightIcon: {
    width: 25,
    aspectRatio: 1,
    height: undefined,
    tintColor: "#000"
  },
  leads: {
    flex: 1
  },
  scroller: {
    flex: 1,
    flexShrink: 1
  },
  statContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#AAA",
    flexDirection: "row"
  },
  statSection: {
    width: "50%",
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  statHeader: {
    marginBottom: 8,
    fontWeight: "bold"
  },
  statLegend: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  statWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 3
  },
  statValue: {
    marginRight: 5,
    fontWeight: "bold",
    fontSize: 12
  },
  statLabel: {
    fontSize: 12
  },
  statBullet: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 6,
    top: 1
  },
  stateProgress: {
    width: "100%",
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "#EEE",
    marginBottom: 8
  },
  stateProgressItem: {
    height: 8
  },
  filter: {
    position: "relative",
    paddingHorizontal: 25,
    alignItems: 'center'
  },
  filterText: {
    fontSize: 12,
    marginTop: 3
  },
  filterIndicator: {
    width: 14,
    height: 14,
    borderRadius: 14,
    backgroundColor: "#cd3922",
    position: "absolute",
    top: -5,
    right: 19,
    zIndex: 99
  }
});
