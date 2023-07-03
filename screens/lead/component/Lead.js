import React from "react";
import { Alert, Image, LayoutAnimation, Linking, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Text from "../../../common/Text";
import LeadStatusPicker from "./LeadStatusPicker";
import BottomModal from "../../../common/BottomModal";
import { styles as menuStyles } from "../../../common/Selector";
import { connect } from "react-redux";
import { changeLeadStatus, deleteLead } from "../../../states/actionCreators";

export class Lead extends React.Component {
  statusPicker = null;

  state = {
    isMenuVisible: false
  };

  static getFastScoreColor(value){
    if (value >= 8) {
      return "#e9c53e";
    } else if (value >= 5) {
      return "#e975c6";
    }

    return "#9ba9b0";
  }

  openMenu(){
    this.setState({ isMenuVisible: true });
  }

  closeMenu(){
    this.setState({ isMenuVisible: false });
  }

  update(){
    this.props.navigation.navigate("view_lead", { id: this.props.data.id });
  }

  changeStatus(status){
    this.props.changeLeadStatus(this.props.data.id, status).then(result => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    });
  }

  delete(){
    Alert.alert("Confirmation", "You are about to delete this lead, are you sure?", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            this.props.deleteLead(this.props.data.id).then(result => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            });
          }
        }
      ],
      { cancelable: true }
    );
  }

  renderMenu(){
    return (
      <View style={menuStyles.container}>
        <TouchableNativeFeedback delayPressIn={0} onPress={() => {
          this.closeMenu();
          this.update();
        }}>
          <View style={menuStyles.option}>
            <Image style={menuStyles.optionIcon} source={require("../../../assets/icons/pencil.png")} />
            <Text style={menuStyles.optionText}>Update</Text>
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={() => {
          this.closeMenu();
          this.delete();
        }}>
          <View style={menuStyles.option}>
            <Image tintColor="#d45e4a" style={menuStyles.optionIcon} source={require("../../../assets/icons/delete.png")} />
            <Text style={{ ...menuStyles.optionText, color: "#d45e4a" }}>Delete</Text>
          </View>
        </TouchableNativeFeedback>

        <View>
          <Text style={{
            paddingTop: 10,
            fontWeight: "bold",
            fontSize: 11,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: "#EEE",
            paddingHorizontal: 15,
            textTransform: "uppercase",
            color: "#AAA",
            marginTop: 5
          }}>Change Status:</Text>

          {LeadStatusPicker.STATUSES.map(status => {
            return (
              <TouchableNativeFeedback
                key={status.value}
                onPress={() => {
                  this.closeMenu();
                  this.changeStatus(status.value);
                }}>
                <View style={{ ...menuStyles.option, flexDirection: "row", alignItems: "center" }}>
                  <View style={{ ...styles.statusBullet, backgroundColor: status.color }} />
                  <Text style={{ ...menuStyles.optionText, color: status.color }}>{status.label}</Text>
                </View>
              </TouchableNativeFeedback>
            );
          })}
        </View>
      </View>
    );
  }

  render(){
    const status = LeadStatusPicker.getStatusOption(this.props.data.status);
    const fastScoreColor = Lead.getFastScoreColor(this.props.data.fast_score);

    return (
      <>
        <BottomModal
          transparent={true}
          visible={this.state.isMenuVisible}
          onRequestClose={() => this.closeMenu()}
        >
          {this.renderMenu()}
        </BottomModal>
        <TouchableNativeFeedback delayPressIn={50}
                                 onLongPress={() => this.openMenu()}
                                 onPress={() => this.update()}>
          <View style={styles.container}>
            <View style={styles.avatarContainer}>
              <Image style={styles.avatar} source={{ uri: this.props.data.photo_thumbnail_url }} />
            </View>

            <View style={styles.outerWrapper}>
              <View style={styles.wrapper}>
                <View style={styles.content}>
                  <Text style={styles.name}>{this.props.data.name}</Text>
                  <Text style={styles.phone}>{this.props.data.city?.name}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableNativeFeedback useForeground={true}
                                           background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                                           delayPressIn={0}
                                           onPress={() => Linking.openURL("tel:" + this.props.data.phone)}>
                    <View style={styles.action}>
                      <Image style={styles.actionIcon} source={require("../../../assets/icons/phone.png")} />
                    </View>
                  </TouchableNativeFeedback>

                  <TouchableNativeFeedback useForeground={true}
                                           background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                                           delayPressIn={0}
                                           onPress={() => Linking.openURL("sms:" + this.props.data.phone)}>
                    <View style={styles.action}>
                      <Image style={styles.actionIcon} source={require("../../../assets/icons/sms.png")} />
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback useForeground={true}
                                           background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                                           delayPressIn={0}
                                           onPress={() => Linking.openURL("http://api.whatsapp.com/send?phone=" + this.props.data.phone)}>
                    <View style={styles.action}>
                      <Image style={styles.actionIcon} source={require("../../../assets/icons/whatsapp.png")} />
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>

              <View style={styles.meta}>
                <View style={styles.status}>
                  <View style={{ ...styles.statusBullet, backgroundColor: status.color }} />
                  <Text style={{ ...styles.statusText, color: status.color }}>{status.label}</Text>
                </View>

                <View style={styles.status}>
                  <View style={{ ...styles.statusBullet, backgroundColor: fastScoreColor }} />
                  <Text style={{ ...styles.statusText, color: fastScoreColor }}>{this.props.data.fast_score_text}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
      </>
    );
  }
}

const mapDispatchToProps = {
  deleteLead,
  changeLeadStatus
};

export default connect(null, mapDispatchToProps)(Lead);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  avatar: {
    width: 60,
    height: undefined,
    aspectRatio: 1,
    borderRadius: 60,
    marginRight: 15,
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.1)"
  },
  name: {
    fontSize: 16,
    marginBottom: 2
  },
  content: {
    flex: 1
  },
  actions: {
    flexDirection: "row"
  },
  actionIcon: {
    tintColor: "#3498df",
    width: 18,
    height: undefined,
    aspectRatio: 1
  },
  action: {
    padding: 5,
    marginLeft: 5
  },
  wrapper: {
    flexDirection: "row"
  },
  outerWrapper: {
    flex: 1
  },
  meta: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  status: {
    flexDirection: "row",
    alignItems: "center"
  },
  statusText: {
    fontSize: 12,
    textTransform: "uppercase"
  },
  statusBullet: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 6
  }
});
