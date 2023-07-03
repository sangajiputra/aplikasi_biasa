import React, { useEffect, useState } from "react";
import axios from "axios/index";
import config from "../../config";
import { ActivityIndicator, Animated, Image, Share, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HTML from "react-native-render-html";
import moment from "moment/moment";
import FadeIn from "../animation/FadeIn";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import baseFontStyle, { HTMLOpenLink } from "../../html-style";
import Text from "../../common/Text";
import analytics from "@react-native-firebase/analytics";
import { connect } from "react-redux";

const DetailAnimation = (props) => {
  const [slideUp] = useState(new Animated.Value(300));
  const [fade] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.spring(
      slideUp,
      {
        toValue: 0,
        velocity: 1,
        tension: 2,
        friction: 8
      }
    ).start();

    Animated.timing(fade, {
      toValue: 1
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        translateY: slideUp,
        opacity: fade
      }}
    >
      {props.children}
    </Animated.View>
  );
};

function NewsDetailFunction(props){
  const [news, setNews] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    axios.get("/moment/news/get", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        expand: "picture_url",
        id: route.params.id
      }
    }).then(response => {
      setNews(response.data.data);

      analytics().logEvent("news", {
        id: response.data.data.id,
        item: response.data.data.title
      });

      navigation.setOptions({
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

      setIsLoading(true);
    });
  }, []);

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

    return root + "member/" + props.user.username + "/news/" + uri;
  };

  const renderPicture = () => {
    let view = <View />;

    if (isLoading) {
      view = <FadeIn>
        <Image resizeMode="cover" style={styles.picture} source={{ uri: news.picture_url }} />
      </FadeIn>;
    }

    return view;
  };

  let content = (
    <View style={styles.containerLoading}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  if (isLoading) {
    content = (
      <DetailAnimation style={styles.container}>
        <View style={styles.detail}>
          <View style={styles.meta}>
            <Text style={styles.title}>{news.title}</Text>
            <Text style={styles.date}>{moment(news.created_at * 1000).format("dddd, DD MMMM YYYY")}</Text>
          </View>
          <View style={styles.contentContainer}>
            <HTML baseFontStyle={baseFontStyle}
                  onLinkPress={HTMLOpenLink}
                  textSelectable={true}
                  html={news.content} />
          </View>
        </View>
      </DetailAnimation>
    );
  }

  return (
    <ParallaxScrollView
      backgroundColor="#EEE"
      style={styles.container}
      renderBackground={renderPicture}
      parallaxHeaderHeight={230}>

      {content}

    </ParallaxScrollView>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(NewsDetailFunction);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    overflow: "hidden",
    height: "100%"
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 35
  },
  picture: {
    width: "100%",
    height: 230
  },
  meta: {
    borderBottomWidth: 3,
    borderColor: "#FAFAFA",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 20
  },
  date: {
    color: "#999",
    fontStyle: "italic"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  contentContainer: {
    paddingLeft: 20,
    paddingRight: 20
  },
  toolbarActionIcon: {
    width: 20,
    height: undefined,
    aspectRatio: 1
  }
});
