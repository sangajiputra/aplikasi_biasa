import React from "react";
import { Image, Linking, TouchableOpacity, View } from "react-native";
import Text from "../../../common/Text";
import styles from "../styles";

export class Contact extends React.Component {
  render(){
    return (
      <View>
        <View style={styles.section}>
          <Text style={styles.header}>KANTOR PUSAT OPERASIONAL & DISTRIBUSI SURABAYA</Text>
          <Text>
            {
              `Ruko Klampis Millenia 2` +
              `\nJl. Klampis Jaya 45 B, Surabaya` +
              `\nPhone : 031-58255388 / 031 58255399`
            }
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>KANTOR CABANG JAKARTA</Text>
          <Text>
            {
              `Ruko Garden Shopping Arcade Blok B/08/BL` +
              `\nKawasan Podomoro City, Jl. Podomoro Avenue, South Tanjung Duren, Grogol Petamburan` +
              `\nJakarta 11470` +
              `\nPhone 021-29334731-32`
            }
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>KANTOR CABANG MAKASSAR</Text>
          <Text>
            {`Ruko Metro Square Blok G2 Jl. Gunung Latimojong` +
            `\nPhone : 0411-3621893`
            }
          </Text>
        </View>

        <View style={styles.socials}>
          <TouchableOpacity onPress={() => {Linking.openURL("https://www.facebook.com/moment2uofficial");}} style={styles.social}>
            <Image style={styles.socialIcon} source={require("../../../assets/icons/facebook.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Linking.openURL("https://twitter.com/Momentpromotion");}} style={styles.social}>
            <Image style={styles.socialIcon} source={require("../../../assets/icons/twitter.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Linking.openURL("https://www.instagram.com/moment2uofficial/");}} style={styles.social}>
            <Image style={styles.socialIcon} source={require("../../../assets/icons/instagram.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Linking.openURL("https://moment2u.com");}} style={styles.social}>
            <Image style={styles.socialIcon} source={require("../../../assets/icons/web.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Linking.openURL("mailto:csmoment.info@gmail.com");}} style={styles.social}>
            <Image style={styles.socialIcon} source={require("../../../assets/icons/email.png")} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
