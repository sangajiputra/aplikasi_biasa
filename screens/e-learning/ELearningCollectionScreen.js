import React from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import ModalHeader from "./components/ModalHeader";
import axios from "axios";
import config from "../../config";
import Text from "../../common/Text";
import Tab from "./components/Tab";
import analytics from "@react-native-firebase/analytics";

export default class ELearningCollectionScreen extends React.Component {

  state = {
    isLoaded: false,
    collection: []
  };

  componentDidMount(){
    this.load().then(() => analytics().logEvent("e_learning_collection"));
  }

  async load(){
    const result = await axios.get("/moment/ecommerce-collection/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "product.thumbnail_url"
      }
    });

    if (result.data.success) {
      await this.setState({ collection: result.data.data });
    }

    await this.setState({ isLoaded: true });

    return result;
  }

  renderItem(item){
    return (
      <View style={styles.itemContainer}>
        <TouchableNativeFeedback useForeground={true} delayPressIn={0} onPress={() => this.props.navigation.navigate('e_learning_view',{id: item.id})}>
          <View style={styles.item}>
            <Image style={styles.thumbnail} source={{ uri: item.product.thumbnail_url }} />
            <View style={styles.meta}>
              <Text style={styles.name}>{item.product.name}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  render(){
    let content = (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );

    if (this.state.isLoaded) {
      content = (
        <>
          <Tab navigation={this.props.navigation} active="collection" />

          <FlatList
            data={this.state.collection}
            numColumns={2}
            renderItem={data => this.renderItem(data.item)}
            keyExtractor={item => item.id.toString()}
            columnWrapperStyle={styles.items}
          />
        </>
      );
    }

    return <ModalHeader showIcon={false} containerStyle={{ overflow: "hidden" }} title="E-Learning">
      {content}
    </ModalHeader>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    paddingHorizontal: 5,
    paddingTop: 5,
    flex: 1
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  thumbnail: {
    width: "100%",
    height: undefined,
    aspectRatio: 3 / 4
  },
  items: {
    padding: 5
  },
  item: {
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#f9f9f9",
    borderWidth: 1,
    backgroundColor: "#FFF",
    flex: 1,

    shadowColor: "#AAA",
    shadowOffset: {
      width: 0,
      height: -100
    },
    shadowOpacity: 0.4,
    shadowRadius: 9,

    elevation: 3
  },
  itemContainer: {
    width: "50%",
    padding: 10
  },
  meta: {
    padding: 10
  },
  name: {
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 22
  }
});
