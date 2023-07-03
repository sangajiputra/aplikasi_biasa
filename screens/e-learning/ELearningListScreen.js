import React from "react";
import axios from "axios/index";
import config from "../../config";
import ProductThumbnail from "./components/ProductThumbnail";
import { ActivityIndicator, LayoutAnimation, ScrollView, StyleSheet, View } from "react-native";
import ModalHeader from "./components/ModalHeader";
import Tab from "./components/Tab";
import analytics from "@react-native-firebase/analytics";

export default function ELearningScreen(props){
  const [products, setProducts] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    load();

    analytics().logEvent("e_learning_list");
  }, []);

  const load = () => {
    setIsLoaded(false);

    axios.get("/moment/ecommerce-product/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "thumbnail_url,is_added_to_cart,is_bought",
        fields: "name,price,id"
      }
    }).then(response => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setProducts([...response.data.data]);
      setIsLoaded(true);
    });
  };

  let content = (
    <View style={styles.containerLoading}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  if (isLoaded) {
    content = (
      <View style={{ flex: 1, overflow: "hidden" }}>
        <Tab navigation={props.navigation} active="browse" />
        <ScrollView>
          <View style={styles.container}>

            {products.map((item, key) => {
              return (
                <View key={item.id.toString()} style={styles.product}>
                  <ProductThumbnail product={item} />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  return <ModalHeader containerStyle={{ overflow: "hidden" }} title="E-Learning">
    {content}
  </ModalHeader>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  product: {
    width: "50%",
    padding: 10,
  }
});
