import React from "react";
import { FlatList, LayoutAnimation, RefreshControl, StyleSheet, View } from "react-native";
import Tab from "./components/Tab";
import { connect } from "react-redux";
import { getDownlines } from "../../states/actionCreators";
import Downline from "./components/Downline";
import analytics from "@react-native-firebase/analytics";

export class DownlinesScreen extends React.Component {
  state = {
    refreshing: false,
    downlines: [],
    page: 1,
    totalPage: 1
  };

  componentDidMount(){
    this.refresh();

    analytics().logEvent('downline_list');
  }

  getDownlines(refresh){
    if (!refresh && this.state.page == this.state.totalPage) {
      return;
    }

    const page = !refresh ? this.state.page + 1 : 1;

    this.props.getDownlines(page).then(result => {
      if (refresh) {
        this.setState({ downlines: result.payload.data.data });
      } else {
        this.setState({ downlines: [...this.state.downlines, ...result.payload.data.data] });
      }

      this.setState({ page: page, totalPage: result.payload.data.pagination.page_count });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });
  }

  refresh(){
    this.getDownlines(true);
  }

  render(){
    return (
      <View style={styles.container}>
        <Tab active="review" />
        <FlatList style={styles.downlines}
                  data={this.state.downlines}
                  onEndReached={() => this.getDownlines()}
                  renderItem={(item) => <Downline key={item.item.id.toString()} data={item.item} />}
                  refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />}>
        </FlatList>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    downlines: state.downline.downlines,
    loading: state.downline.loading
  };
};

const mapDispatchToProps = {
  getDownlines
};

export default connect(mapStateToProps, mapDispatchToProps)(DownlinesScreen);

const styles = StyleSheet.create({
  container: {
    // paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "#FFF"
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
