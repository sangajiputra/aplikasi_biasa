import React from "react";
import { Image, ScrollView, Share, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Header from "./components/Header";
import { connect } from "react-redux";
import Text from "../../common/Text";

export function ProfileScreen(props){
  function shareBusinessLink(){
    Share.share({
      title: "My Business Landing Page",
      url: "https://momentsupport.net/member/" + props.user.username + "/bisnis/",
      message: "https://momentsupport.net/member/" + props.user.username + "/bisnis/"
    });
  }

  function shareProductLink(){
    Share.share({
      title: "My Business Landing Page",
      url: "https://momentsupport.net/member/" + props.user.username + "/produk/",
      message: "https://momentsupport.net/member/" + props.user.username + "/produk/"
    });
  }

  return (
    <ScrollView style={styles.container}>
      <Header user={props.user} />
      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Username</Text>
          <Text style={styles.fieldValue}>{props.user.username}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Member ID</Text>
          <Text style={styles.fieldValue}>{props.user.profile.identification}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Sponsor ID</Text>
          <Text style={styles.fieldValue}>{props.user.profile.upline?.identification}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Phone</Text>
          <Text style={styles.fieldValue}>{props.user.profile.phone}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{props.user.email}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Secondary Email</Text>
          <Text style={styles.fieldValue}>{props.user.profile.secondary_email}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Business Landing Page Link</Text>
          <View style={styles.sharableLink}>
            <Text selectable={true} style={styles.fieldValue}>https://momentsupport.net/member/{props.user.username}/bisnis/</Text>
            <TouchableNativeFeedback onPress={() => shareBusinessLink()}>
              <View>
                <Image style={styles.toolbarActionIcon} source={require("../../assets/icons/share.png")} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Product Landing Page Link</Text>
          <View style={styles.sharableLink}>
            <Text selectable={true} style={styles.fieldValue}>https://momentsupport.net/member/{props.user.username}/produk/</Text>
            <TouchableNativeFeedback onPress={() => shareProductLink()}>
              <View>
                <Image style={styles.toolbarActionIcon} source={require("../../assets/icons/share.png")} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  field: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#EEE"
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: "QuicksandBold"
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: 5
  },
  toolbarActionIcon: {
    width: 20,
    height: undefined,
    aspectRatio: 1
  },
  sharableLink: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20
  }
});
