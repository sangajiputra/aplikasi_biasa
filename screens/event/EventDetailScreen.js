import React from "react";
import axios from "axios/index";
import config from "../../config";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ActivityIndicator, Image, Modal, ScrollView, Share, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import HTML from "react-native-render-html";
import moment from "moment/moment";
import Text from "../../common/Text";
import baseFontStyle, { HTMLOpenLink } from "../../html-style";
import ImageViewer from "react-native-image-zoom-viewer";
import analytics from "@react-native-firebase/analytics";
import { connect } from "react-redux";

export function EventDetailScreen(props){
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [event, setEvent] = React.useState({});
  const [isImagePreviewVisible, setIsImagePreviewVisible] = React.useState(false);
  const route = useRoute();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (route.params.title) {
      navigation.setOptions({
        headerTitle: route.params.title
      });
    }

    load(route.params.id);
  }, []);

  const load = (id) => {
    setIsLoaded(false);

    axios.get("/moment/event/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        id: id,
        expand: "picture_url"
      }
    }).then(response => {
      setEvent(response.data.data);

      setIsLoaded(true);

      navigation.setOptions({
        headerTitle: response.data.data.name,
        headerRight: () => {
          return (
            <TouchableNativeFeedback onPress={() => share(response.data.data)}>
              <View style={styles.toolbarAction}>
                <Image style={styles.toolbarActionIcon} source={require("../../assets/icons/share.png")} />
              </View>
            </TouchableNativeFeedback>
          );
        }
      });

      analytics().logEvent("event_detail", {
        id: response.data.data.id,
        title: response.data.data.name
      });
    });
  };


  const share = async (data) => {
    Share.share({
      title: "Share news",
      url: data.sharable_link,
      message: data.title + " " + buildSharableLink(data.sharable_link)
    });
  };

  const buildSharableLink = (sharableLink) => {
    const root = sharableLink.slice(0, 26);
    const uri = sharableLink.slice(26);

    return root+'/member/'+props.user.username+'/event/'+uri;
  };

  let content = (
    <View style={styles.containerLoading}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  if (isLoaded) {
    content = (
      <View style={styles.container}>
        {event.picture ? <TouchableNativeFeedback onPress={() => setIsImagePreviewVisible(true)}><Image style={styles.picture} source={{ uri: event.picture_url }} /></TouchableNativeFeedback> : null}

        <Modal visible={isImagePreviewVisible}
               transparent={true}
               onRequestClose={() => {
                 setIsImagePreviewVisible(false);
               }}>
          <ImageViewer
            imageUrls={[
              { url: event.picture_url }
            ]}
          />
        </Modal>

        <View style={styles.content}>
          <ScrollView>
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>: {moment(event.date * 1000).format("dddd, DD MMMM YYYY HH:mm")}</Text>
              </View>
              {
                event.address ?
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Address</Text>
                    <Text style={styles.metaValue}>: {event.address}</Text>
                  </View> : null
              }
            </View>

            <View style={styles.description}>
              {event.long_description && <HTML html={event.long_description}
                                               textSelectable={true}
                                               baseFontStyle={baseFontStyle}
                                               onLinkPress={HTMLOpenLink} />}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {content}
    </View>
  );
}


const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(EventDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  description: {
    padding: 15
  },
  content: {
    paddingVertical: 15,
    flex: 1
  },
  picture: {
    width: "100%",
    aspectRatio: 4 / 2,
    height: undefined
  },
  meta: {
    paddingLeft: 15,
    paddingRight: 15
  },
  metaItem: {
    flexDirection: "row",
    marginBottom: 5
  },
  metaLabel: {
    width: "25%",
    fontWeight: "bold",
    fontSize: 16
  },
  metaValue: {
    fontWeight: "bold",
    fontSize: 16
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 35
  },
  toolbarActionIcon: {
    width: 20,
    height: undefined,
    aspectRatio: 1
  }
});
