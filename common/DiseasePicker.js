import React from "react";
import axios from "axios";
import config from "../config";
import BottomModal from "./BottomModal";
import { ActivityIndicator, StyleSheet, FlatList, TouchableNativeFeedback, View, Image } from "react-native";
import {styles as selectorStyles} from './Selector';
import Text from "./Text";
import TextInput from "./TextInput";

export default class DiseasePicker extends React.Component {
  state = {
    visible: false,
    searchQuery: "",
    diseases: []
  };

  modal = null;
  searchTimeout = null;

  async load(){
    const result = await axios.get("/moment/disease/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        page_size: 9999,
        q: this.state.searchQuery,
      }
    });

    if (result.data.success) {
      this.setState({ diseases: result.data.data });
    }
  }

  async open(){
    await this.setState({visible: true });

    setTimeout(() => {
      this.load();
    }, 300);
  }

  close(){
    this.setState({ visible: false, searchQuery: "" });
  }

  async search(query){
    await this.setState({ searchQuery: query });

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.load();
    }, 300);
  }

  select(value){
    if (this.props.onSelect) {
      this.props.onSelect(value);
    }

    this.close();
  }

  static emptyComponent(){
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  render(){
    return (
      <BottomModal
        visible={this.state.visible}
        onRequestClose={() => this.close()}
        transparent={true}
        ref={component => this.modal = component}>
        <View style={selectorStyles.title}>
          <Text style={selectorStyles.titleText}>Select medical record</Text>
        </View>

        <View style={styles.search}>
          <Image style={styles.searchIcon} source={require("../assets/icons/search.png")} />
          <TextInput onChangeText={value => this.search(value)}
                     placeholderTextColor="#BBB"
                     style={styles.searchInput}
                     placeholder="Search..." />
        </View>

        <FlatList
          data={this.state.diseases}
          keyExtractor={disease => disease.id.toString()}
          ListEmptyComponent={DiseasePicker.emptyComponent}
          renderItem={({ item }) => (
            <TouchableNativeFeedback delayPressIn={0} onPress={() => this.select(item)}>
              <View style={selectorStyles.option}>
                <Text style={selectorStyles.optionText}>{item.name}</Text>
              </View>
            </TouchableNativeFeedback>
          )}
        />
      </BottomModal>
    );
  }
}

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    paddingVertical: 30,
    justifyContent: "center"
  },
  search: {
    fontSize: 16,
    elevation: 5,
    backgroundColor: "#FFF",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
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
});
