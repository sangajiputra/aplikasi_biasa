import React from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import axios from "axios";
import config from "../../config";
import Text from "../../common/Text";
import { useNavigation } from "@react-navigation/native";
import baseFontStyle, { HTMLOpenLink } from "../../html-style";
import HTML from "react-native-render-html";
import analytics from "@react-native-firebase/analytics";

export function Medication(props){
  const navigation = useNavigation();

  React.useEffect(() => {
    analytics().logEvent("e_health");
  }, []);

  return (
    <TouchableNativeFeedback delayPressIn={0} onPress={() => navigation.navigate("product_detail", { id: props.data.product_id })}>
      <View style={medicationStyle.container}>
        <View style={medicationStyle.imageContainer}>
          <Image style={medicationStyle.image} source={{ uri: props.data.product.picture_url }} />
        </View>
        <View style={medicationStyle.content}>
          <Text style={medicationStyle.title}>{props.data.product.name}</Text>
          <Text style={medicationStyle.reason}>{props.data.reason}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
}

const medicationStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    marginHorizontal: 0,
    marginVertical: 8,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: "#FFF",
    alignItems: "center"
  },
  image: {
    width: 100,
    height: undefined,
    aspectRatio: 1
  },
  imageContainer: {
    marginRight: 20
  },
  content: {
    flexShrink: 1
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8
  }
});

export default class EHealthResultScreen extends React.Component {
  state = {
    medications: [],
    loading: false
  };

  componentDidMount(){
    this.load();
  }

  async load(){
    await this.setState({ loading: true });

    const result = await axios.get("/moment/disease-medication/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        disease_id: this.props.route.params.disease.id,
        expand: "product.picture_url"
      }
    });

    if (result.data.success) {
      await this.setState({ medications: result.data.data });
    }

    await this.setState({ loading: false });

    return result;
  }

  render(){
    const defaultAvatar = require("../../assets/avatar.png");
    const avatar = !this.props.route.params.data.avatar ? defaultAvatar : { uri: this.props.route.params.data.avatar };

    return (
      <ScrollView style={styles.container}>

        <Image source={require("../../assets/bg/header.png")}
               style={styles.avatarContainer} />

        <View style={styles.content}>
          <Image style={styles.avatar} source={avatar} />

          <View style={styles.profile}>
            <View style={styles.basicInformation}>
              <Text style={styles.name}>{this.props.route.params.data.name}</Text>
              <Text style={styles.age}>{this.props.route.params.data.age} years old</Text>
            </View>

            <View style={styles.meta}>
              <View style={styles.metaSection}>
                <Text style={styles.metaLabel}>Height</Text>
                <Text style={styles.metaValue}>{this.props.route.params.data.height} cm</Text>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaLabel}>Weight</Text>
                <Text style={styles.metaValue}>{this.props.route.params.data.weight} kg</Text>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaLabel}>Gender</Text>
                <Text style={styles.metaValue}>{this.props.route.params.data.gender.label}</Text>
              </View>
            </View>

            <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("e_health.lead", {
              from: 'e-health',
              data: {
                name: this.props.route.params.data.name,
                uploaded_photo: this.props.route.params.data.avatar,
                age: this.props.route.params.data.age,
                weight: this.props.route.params.data.weight,
                height: this.props.route.params.data.height,
                gender: this.props.route.params.data.gender,
                disease_id: this.props.route.params.disease.id,
                disease: this.props.route.params.disease
              }
            })}>
              <View style={styles.button}>
                <Image source={require("../../assets/icons/send.png")} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Save to Lead</Text>
              </View>
            </TouchableNativeFeedback>
          </View>


          <View style={{ ...styles.medications, paddingBottom: 0 }}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{this.props.route.params.disease.name}</Text>
            </View>

            <HTML html={this.props.route.params.disease.description}
                  baseFontStyle={baseFontStyle}
                  onLinkPress={HTMLOpenLink} />
          </View>

          <View style={styles.medications}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Product Recomendations</Text>
            </View>
            {this.state.loading && <View style={styles.containerLoading}><ActivityIndicator size="large" color="#0000ff" /></View>}
            {!this.state.loading && this.state.medications.map(medication => <Medication key={medication.id} data={medication} />)}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  containerLoading: {
    paddingTop: 30,
    paddingBottom: 20
  },
  medications: {
    padding: 15
  },
  title: {
    fontFamily: "QuicksandBold",
    fontSize: 16
  },
  titleContainer: {
    paddingVertical: 14,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 15,
    marginHorizontal: -15,
    marginBottom: 5
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
  basicInformation: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  name: {
    fontFamily: "QuicksandBold",
    fontSize: 16,
    marginBottom: 3
  },
  meta: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10
  },
  metaSection: {
    flex: 1,
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#DDD",
    paddingVertical: 5
  },
  metaLabel: {
    color: "#999",
    marginBottom: 3
  },
  metaValue: {
    fontFamily: "QuicksandBold",
    fontSize: 15
  },
  button: {
    flex: 1,
    borderColor: "#5198df",
    borderWidth: 2,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#5198df",
  },
  buttonIcon: {
    marginRight: 10,
    width: 20,
    height: undefined,
    aspectRatio: 1,
    tintColor: '#5198df'
  },
});
