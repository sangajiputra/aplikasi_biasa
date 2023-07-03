import React from "react";
import { ActivityIndicator, FlatList, Image, LayoutAnimation, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import axios from "axios";
import config from "../../config";
import Text from "../../common/Text";
import TextInput from "../../common/TextInput";

export default class EHealthDiseaseScreen extends React.Component {
  state = {
    categories: [],
    diseases: [],
    activeCategoryId: null,
    searchQuery: "",
    loading: true
  };

  searchTimeout = null;

  componentDidMount(){
    this.loadCategories();
  }

  async loadDiseases(){
    await this.setState({ loading: true });

    const result = await axios.get("/moment/disease/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        category_id: this.state.activeCategoryId,
        q: this.state.searchQuery,
      }
    });

    if (result.data.success) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      await this.setState({ diseases: result.data.data });
    }

    await this.setState({ loading: false });

    return result;
  }

  async searchDisease(value){
    await this.setState({ searchQuery: value });

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.loadDiseases();
    }, 300);
  }

  getDiseaseById(id){
    return this.state.diseases.find(disease => disease.id === id);
  }

  async loadCategories(){
    const result = await axios.get("/moment/disease-category/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "icon_url",
      }
    });

    if (result.data.success) {
      await this.setState({
        categories: result.data.data
      });

      await this.setActiveCategory(result.data.data[0]);
    }

    return result;
  }

  async setActiveCategory(category){
    await this.setState({ activeCategoryId: category.id });

    return await this.loadDiseases();
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.categories}>
          {this.state.categories.map(category => (
            <TouchableNativeFeedback key={category.id.toString()} onPress={() => this.setActiveCategory(category)}>
              <View style={styles.category}>
                <Image style={styles.categoryIcon} source={{ uri: category.icon_url }} />
                <Text style={styles.categoryText}>{category.name}</Text>
                {
                  this.state.activeCategoryId === category.id && (
                    <View style={styles.categoryActiveIndicator}>
                      <Image style={styles.categoryActiveIndicatorArrow} source={require("../../assets/icons/top.png")} />
                    </View>
                  )
                }
              </View>
            </TouchableNativeFeedback>
          ))}
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <Image style={styles.searchIcon} source={require("../../assets/icons/search.png")} />
            <TextInput onChangeText={value => this.searchDisease(value)}
                       placeholderTextColor="#BBB"
                       value={this.state.searchQuery}
                       style={styles.searchInput}
                       placeholder="Search..." />
            {this.state.loading && <View style={styles.containerLoading}>
              <ActivityIndicator size={25} color="#AAA" />
            </View>}
          </View>
        </View>

        <View style={styles.diseasesContainer}>
          <FlatList
            data={this.state.diseases}
            keyExtractor={disease => disease.id.toString()}
            style={styles.diseases}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.props.navigation.navigate("e_health.result", {
                data: this.props.route.params.data,
                disease: item
              })}>
                <View style={styles.disease}>
                  <Text>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  containerLoading: {
    justifyContent: "center",
    paddingRight: 20
  },
  categories: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    minHeight: 140
  },
  category: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderLeftWidth: 1,
    borderLeftColor: "#EEE",
    position: "relative"
  },
  categoryIcon: {
    width: 64,
    height: undefined,
    aspectRatio: 1
  },
  categoryText: {
    fontSize: 20,
    marginTop: 10
  },
  diseasesContainer: {
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: "#EEE"
  },
  diseases: {
    flex: 1
  },
  search: {
    fontSize: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15,
    elevation: 4
  },
  searchInput: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1
  },
  searchContainer: {
    position: "relative"
  },
  searchIcon: {
    width: 25,
    aspectRatio: 1,
    height: undefined,
    tintColor: "#CCC"
  },
  categoryActiveIndicator: {
    position: "absolute",
    backgroundColor: "#5198df",
    bottom: 0,
    width: "100%",
    height: 4
  },
  categoryActiveIndicatorArrow: {
    position: "absolute",
    width: 30,
    height: 10,
    resizeMode: "stretch",
    tintColor: "#5198df",
    top: -8,
    marginLeft: -15,
    left: "50%"
  },
  disease: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD"
  }
});
