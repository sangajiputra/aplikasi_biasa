import React from "react";
import { Dimensions, Image, ImageBackground, Linking, PermissionsAndroid, RefreshControl, StatusBar, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import NewsThumbnail from "../news/components/NewsThumbnail";
import Product from "./components/Product";
import ProductDetailScreen from "../ProductDetailScreen";
import { createStackNavigator } from "@react-navigation/stack";
import TransparentHeader from "../../common/TransparentHeader";
import NewsDetailScreen from "../news/NewsDetailScreen";
import ReportScreen from "../ReportScreen";
import NoteScreen from "../note/NoteScreen";
import NoteUpdateScreen from "../note/NoteUpdateScreen";
import ELearningScreen from "../e-learning/ELearningScreen";
import EHealthScreen from "../e-health/EHealthScreen";
import PlanScreen from "../PlanScreen";
import MomentScreen from "../moment/MomentScreen";
import VitalSignScreen from "../vital-sign/VitalSignScreen";
import GoalScreen from "../goal/GoalScreen";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import EventDetailScreen from "../event/EventDetailScreen";
import ELearningDetailScreen from "../e-learning/ELearningDetailScreen";
import CartIcon from "../e-learning/components/CartIcon";
import ELearningCartScreen from "../e-learning/ELearningCartScreen";
import StackScreenRightToLeftAnimation from "../animation/ModalAnimation";
import DownlineDetailScreen from "../vital-sign/DownlineDetailScreen";
import Text from "../../common/Text";
import GoalUpdateScreen from "../goal/GoalUpdateScreen";
import NewsListScreen from "../news/NewsListScreen";
import ProductListScreen from "../product/ProductListScreen";
import EHealthDiseaseScreen from "../e-health/EHealthDiseaseScreen";
import EHealthResultScreen from "../e-health/EHealthResultScreen";
import UpdateLeadScreen from "../lead/UpdateLeadScreen";
import NotificationRootScreen from "../notification/NotificationRootScreen";
import InboxDetailScreen from "../notification/InboxDetailScreen";
import ELearningCheckoutScreen from "../e-learning/ELearningCheckoutScreen";
import ELearningOrderDetailScreen from "../e-learning/ELearningOrderDetailScreen";
import ELearningCollectionScreen from "../e-learning/ELearningCollectionScreen";
import ELearningViewScreen from "../e-learning/ELearningViewScreen";
import * as ScreenOrientation from "expo-screen-orientation";
import ELearningCheckout3dsScreen from "../e-learning/ELearningCheckout3dsScreen";
import messaging from "@react-native-firebase/messaging";
import moment from "moment";
import Contacts from "react-native-contacts";
import AsyncStorage from "@react-native-community/async-storage";
import { PermissionStatus } from "expo-image-picker/build/ImagePicker.types";
import { EthicalCode } from "../moment/components/EthicalCode";
import { DistributionFlow } from "../moment/components/DistributionFlow";
import { ProfileOfManagement } from "../moment/components/ProfileOfManagement";

const Stack = createStackNavigator();

export function HomeStackScreen(){
  const _headerElement = ({ scene, previous, navigation }) => {
    return (
      <TransparentHeader
        previous={previous}
        navigation={navigation}
        scene={scene}
      />
    );
  };

  return (

    <Stack.Navigator>
      <Stack.Screen name="home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
      />
      <Stack.Screen name="product_detail"
                    options={{
                      headerTitle: "Product Detail",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ProductDetailScreen}

      />
      <Stack.Screen name="news_detail"
                    options={{
                      headerTitle: "News",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={NewsDetailScreen}
      />
      <Stack.Screen name="report"
                    options={{
                      headerTitle: "Report",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ReportScreen}
      />
      <Stack.Screen name="note"
                    options={{
                      headerTitle: "Note",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={NoteScreen}
      />
      <Stack.Screen name="update_note"
                    options={{
                      headerTitle: "",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={NoteUpdateScreen}
      />
      <Stack.Screen name="e_learning"
                    options={{
                      cardStyle: { backgroundColor: "#FFF" },
                      headerTitle: "E-Learning",
                      headerShown: false,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ELearningScreen}
      />
      <Stack.Screen name="e_learning_collection"
                    options={{
                      cardStyle: { backgroundColor: "#FFF" },
                      headerTitle: "E-Learning Collection",
                      headerShown: false,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ELearningCollectionScreen}
      />
      <Stack.Screen name="e_learning_detail"
                    options={{
                      cardStyle: { backgroundColor: "#FFF" },
                      headerTitle: "Product Detail",
                      headerRight: () => <CartIcon theme="light" />,
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ELearningDetailScreen}
      />
      <Stack.Screen name="e_learning_cart"
                    options={{
                      cardStyle: { backgroundColor: "#FFF", flex: 1 },
                      headerTitle: "E-Learning",
                      headerShown: false
                    }}
                    component={ELearningCartScreen}
      />
      <Stack.Screen name="e_learning_checkout"
                    options={{
                      cardStyle: { backgroundColor: "#FFF", flex: 1 },
                      headerTitle: "E-Learning",
                      headerShown: false
                    }}
                    component={ELearningCheckoutScreen}
      />
      <Stack.Screen name="e_learning_view"
                    options={{
                      cardStyle: { backgroundColor: "#FFF", flex: 1 },
                      headerTitle: "E-Learning",
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ELearningViewScreen}
      />
      <Stack.Screen name="e_learning_3ds"
                    options={{
                      cardStyle: { backgroundColor: "#FFF", flex: 1 },
                      headerTitle: "Verify Your Card",
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ELearningCheckout3dsScreen}
      />
      <Stack.Screen name="e_health"
                    options={{
                      headerTitle: "E-Health",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={EHealthScreen}
      />
      <Stack.Screen name="e_health.disease"
                    options={{
                      headerTitle: "E-Health",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={EHealthDiseaseScreen}
      />
      <Stack.Screen name="e_health.result"
                    options={{
                      headerTitle: "E-Health",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={EHealthResultScreen}
      />

      <Stack.Screen name="e_health.lead"
                    options={{
                      headerTitle: "Update Lead",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={UpdateLeadScreen}

      />
      <Stack.Screen name="plan"
                    options={{
                      headerTitle: "Plan",
                      headerShown: false,
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={PlanScreen}
      />
      <Stack.Screen name="moment"
                    options={{
                      headerTitle: "Moment",
                      header: _headerElement,
                      headerShown: false,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={MomentScreen}
      />
      <Stack.Screen name="vital_sign"
                    options={{
                      headerTitle: "Vital Sign",
                      header: _headerElement,
                      headerShown: true,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={VitalSignScreen}
      />
      <Stack.Screen name="vital_sign_downline"
                    options={{
                      headerTitle: "Downline Detail",
                      header: _headerElement,
                      headerShown: true,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={DownlineDetailScreen}
      />
      <Stack.Screen name="goal"
                    options={{
                      headerTitle: "Goals",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={GoalScreen}
      />
      <Stack.Screen name="update_goal"
                    options={{
                      headerTitle: "Set your dream",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={GoalUpdateScreen}
      />
      <Stack.Screen name="event_detail"
                    options={{
                      headerTitle: "Event",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={EventDetailScreen}
      />
      <Stack.Screen name="news_list"
                    options={{
                      headerTitle: "News & Updates",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={NewsListScreen}
      />
      <Stack.Screen name="product_list"
                    options={{
                      headerTitle: "Products",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ProductListScreen}
      />
      <Stack.Screen name="notification"
                    options={{
                      headerTitle: "Notification",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={NotificationRootScreen}
      />
      <Stack.Screen name="inbox.detail"
                    options={{
                      headerTitle: "Inbox",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={InboxDetailScreen}
      />
      <Stack.Screen name="order_detail"
                    options={{
                      headerTitle: "Order Detail",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ELearningOrderDetailScreen}

      />
      <Stack.Screen name="ethical_code"
                    options={{
                      headerTitle: "Ethical Code",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={EthicalCode}

      />
      <Stack.Screen name="distribution_flow"
                    options={{
                      headerTitle: "Distribution Flow",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={DistributionFlow}
      />
      <Stack.Screen name="profile_of_management"
                    options={{
                      headerTitle: "Profile of Management",
                      header: _headerElement,
                      ...StackScreenRightToLeftAnimation
                    }}
                    component={ProfileOfManagement}
      />
    </Stack.Navigator>
  );
}

let { width: viewportWidth } = Dimensions.get("window");
let sliderHeight = (viewportWidth - 50) * (2 / 5);

export function HomeScreen(props){
  const [refreshing, setRefreshing] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(sliderHeight + 225);

  let newsComponent = null;
  let productComponent = null;
  let headerComponent = null;

  const refresh = function(){
    setRefreshing(true);

    const newsPromise = newsComponent.load();
    const productPromise = productComponent.load();
    const headerPromise = headerComponent.load();

    Promise.all([newsPromise, productPromise, headerPromise]).then(() => {
      setRefreshing(false);
    });
  };

  React.useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener(() => {

      const dimension = Dimensions.get("window");

      viewportWidth = dimension.width;

      sliderHeight = (viewportWidth - 50) * (2 / 5);
      setHeaderHeight(sliderHeight + 225);
    });

    messaging().getInitialNotification().then(initialMessage => {
      if (!initialMessage) {
        return;
      }

      if (initialMessage.data?.type === "inbox") {
        props.navigation.navigate("inbox.detail", { id: initialMessage.data.id });
      } else if (["vital_sign.approved", "vital_sign.promoted"].indexOf(initialMessage.data?.type) > -1) {
        props.navigation.navigate("vital_sign");
      } else if (initialMessage.data?.type === "vital_sign.review") {
        props.navigation.navigate("vital_sign_downline", { id: initialMessage.data?.member_id });
      } else if (initialMessage.data?.type === "event.reminder") {
        if (initialMessage.data.event_type === "C") {
          props.navigation.navigate("event_detail", { id: initialMessage.data.event_id });
        } else {
          props.navigation.navigate("event", { screen: "add_event", params: { "id": initialMessage.data.event_id }, initial: false });
        }
      } else if (initialMessage.data?.type === "chat") {
        props.navigation.navigate("chat", { screen: "chat_message", params: { id: initialMessage.data?.id }, initial: false });
      } else if (initialMessage.data?.type === "news") {
        props.navigation.navigate("news_detail", { id: initialMessage.data?.id });
      }
    });

  }, []);

  const chatbot = () => {
    const now = moment();
    const date = moment().format("YYYY-MM-DD");

    const times = [
      {
        label: "Selamat pagi",
        time: [moment(`${date} 00:00`), moment(`${date} 10:00`)]
      },
      {
        label: "Selamat siang",
        time: [moment(`${date} 10:01`), moment(`${date} 15:00`)]
      },
      {
        label: "Selamat sore",
        time: [moment(`${date} 15:01`), moment(`${date} 18:00`)]
      },
      {
        label: "Selamat malam",
        time: [moment(`${date} 18:01`), moment(`${date} 00:00`)]
      }
    ];

    for (const time of times) {
      if (now >= time.time[0] && now <= time.time[1]) {
        return encodeURI(time.label);
      }
    }

    return encodeURI("Hi mia");
  };

  const saveNumber = async () => {
    const isSaved = await AsyncStorage.getItem("moment-contact");

    if (isSaved !== null) {
      return;
    }

    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then((readContactPermission) => {
      if (readContactPermission !== PermissionStatus.GRANTED) {
        return;
      }

      Contacts.getContactsByPhoneNumber("+6281217199688", (err, contacts) => {
        if (err) {
          return;
        }

        if (contacts.length > 0) {
          return;
        }

        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS).then(writeContactPermission => {
          if (writeContactPermission !== PermissionStatus.GRANTED) {
            return;
          }

          Contacts.addContact({
            emailAddresses: [
              {
                label: "work",
                email: "academiamomentlizer@gmail.com"
              }],
            displayName: "Moment",
            givenName: "Moment",
            phoneNumbers: [
              {
                label: "work",
                number: "+6281217199688"
              }]
          }, (err) => {
            if (err) {
              return;
            }

            AsyncStorage.setItem(
              "moment-contact",
              "saved."
            );
          });
        });
      });
    });
  };

  saveNumber();

  return (
    <>

      <View style={styles.cs}>
        <TouchableNativeFeedback onPress={() => {
          Linking.openURL(`https://wa.me/6281217199688?text=${chatbot()}`);
        }}>
          <Image style={styles.miaIcon} source={require("../../assets/icons/mila.jpeg")} />
        </TouchableNativeFeedback>
      </View>

      <ParallaxScrollView
        backgroundColor="#EEE"
        style={styles.container}
        renderBackground={() => <ImageBackground fadeDuration={0} source={require("../../assets/bg/header.png")} style={{ width: "100%", height: headerHeight + 5 }} resizeMode="stretch"><View /></ImageBackground>}
        renderForeground={() => <Header navigation={props.navigation} ref={component => headerComponent = component} />}
        fadeOutForeground={false}
        outputScaleValue={19}
        parallaxHeaderHeight={headerHeight}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />
        }
      >

        <StatusBar barStyle="dark-content" />

        <Navigation />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.caption}>Our Products</Text>
            <TouchableNativeFeedback onPress={() => props.navigation.navigate("product_list")}>
              <View style={styles.sectionButton}>
                <Text style={styles.sectionButtonText}>View all &raquo;</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          <Product navigation={props.navigation} ref={component => productComponent = component} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.caption}>News & Updates</Text>
            <TouchableNativeFeedback onPress={() => props.navigation.navigate("news_list")}>
              <View style={styles.sectionButton}>
                <Text style={styles.sectionButtonText}>View all &raquo;</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          <NewsThumbnail ref={component => newsComponent = component} />
        </View>

      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
    position: "relative"
  },
  caption: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "bold"
  },
  section: {
    borderTopWidth: 5,
    borderTopColor: "#FAFAFA",
    marginTop: 15,
    paddingTop: 15
  },
  sectionHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center"
  },
  sectionButtonText: {
    color: "#77a6f6",
    fontWeight: "bold",
    fontSize: 12
  },
  sectionButton: {
    borderColor: "#77a6f6",
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    top: -8,
    position: "relative"
  },
  placeholder: {
    backgroundColor: "#12eaec",
    height: StatusBar.currentHeight
  },
  cs: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 999,
    borderRadius: 60,
    elevation: 7,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#FFF"
  },
  miaIcon: {
    width: 60,
    height: 60
  }
});

