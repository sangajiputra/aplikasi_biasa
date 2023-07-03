import React from "react";
import { Animated, BackHandler, Image, ImageBackground, ScrollView, TouchableNativeFeedback, View } from "react-native";
import Text from "../../common/Text";
import { LinearGradient } from "expo-linear-gradient";
import { Legality } from "./components/Legality";
import { Contact } from "./components/Contact";
import { VissionMission } from "./components/VissionMission";
import { SyariahStrategy } from "./components/SyariahStrategy";
import styles from "./styles";

const colors = ["#77e7ff", "#c2eefc"];
const modalColors = ["rgba(109,211,221,0.38)", "rgb(255,255,255)"];

export default class MomentScreen extends React.Component {
  state = {
    route: null,
    contentSlide: new Animated.Value(0),
    contentScale: new Animated.Value(1),
    modalSlide: new Animated.Value(1000),
    modalScale: new Animated.Value(0.5)
  };

  backHandler = null;

  componentDidMount(){
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.state.route !== null && this.props.navigation.isFocused()) {
        this.navigate(null);

        return true;
      }

      return false;
    });
  }

  componentWillUnmount(){
    this.backHandler.remove();
  }

  async navigate(route){
    await Animated.timing(this.state.contentSlide, {
      toValue: route === null ? 0 : 1000
    }).start();

    await Animated.timing(this.state.modalSlide, {
      toValue: route === null ? 1000 : 0
    }).start();

    await Animated.timing(this.state.contentScale, {
      toValue: route === null ? 1 : 0.5
    }).start();

    await Animated.timing(this.state.modalScale, {
      toValue: route === null ? 0.5 : 1
    }).start();

    this.setState({ route: route });
  }

  renderVisionMission(){
    return <VissionMission />;
  }

  renderContact(){
    return <Contact />;
  }

  renderSyariahStrategy(){
    return <SyariahStrategy />;
  }

  renderLegality(){
    return <Legality />;
  }

  render(){
    return <View style={styles.container}>

      <ImageBackground style={styles.background} source={require("../../assets/bg/moment.jpg")}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../../assets/logo.png")} />
        </View>

        <View style={styles.contentContainer}>
          <Animated.View style={{ ...styles.modal, transform: [{ translateY: this.state.modalSlide }, { scale: this.state.modalScale }] }}>
            <LinearGradient colors={modalColors} style={styles.modalWrapper}>
              <ScrollView style={styles.modalScroller}>
                {this.state.route === "vision-mission" && this.renderVisionMission()}
                {this.state.route === "contact" && this.renderContact()}
                {this.state.route === "legality" && this.renderLegality()}
                {this.state.route === "strategy_syariah" && this.renderSyariahStrategy()}
              </ScrollView>
            </LinearGradient>
          </Animated.View>

          <Animated.ScrollView style={{ ...styles.content, transform: [{ translateY: this.state.contentSlide }, { scale: this.state.contentScale }] }}>
            <View style={styles.highlight}>
              <Text style={{ ...styles.highlightText, marginBottom: 15 }}>
                Merupakan Perusahaan yang didirikan oleh Bapak Heru Cakra sebagai Direktur tanggal 20 Desember 2012 di Kota Surabaya Jawa Timur.
              </Text>
              <Text style={styles.highlightText}>
                Bergerak di bidang penyediaan produk Nutrisi Kecantikan dan Kesehatan kelas Dunia yang Bermutu Tinggi. Dengan cara pemasaran penjualan langsung, Kantor Pusat kami berlokasi di Surabaya dan kegiatan operasional kami meliputi seluruh wilayah Indonesia, dalam kurun waktu beberapa tahun kedepan wilayah operasional akan kami perluas kesebagian besar wilayah Asia, Amerika Latin, dan Eropa
              </Text>
            </View>

            <View style={styles.navigation}>
              <View style={styles.menu}>
                <TouchableNativeFeedback onPress={() => this.navigate("vision-mission")} useForeground={true} delayPressIn={0}>
                  <LinearGradient colors={colors}
                                  style={styles.menuWrapper}>
                    <View style={styles.shine} />
                    <Image style={styles.menuIcon} source={require("../../assets/icons/vision-mision.png")} />
                    <Text style={styles.menuText}>Vision & Mission</Text>
                  </LinearGradient>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.menu}>
                <TouchableNativeFeedback onPress={() => this.navigate("contact")} useForeground={true} delayPressIn={0}>
                  <LinearGradient colors={colors}
                                  style={styles.menuWrapper}>
                    <View style={styles.shine} />
                    <Image style={styles.menuIcon} source={require("../../assets/icons/communications.png")} />
                    <Text style={styles.menuText}>Our Contact</Text>
                  </LinearGradient>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.menu}>
                <TouchableNativeFeedback onPress={() => this.navigate("legality")} useForeground={true} delayPressIn={0}>
                  <LinearGradient colors={colors}
                                  style={styles.menuWrapper}>
                    <View style={styles.shine} />
                    <Image style={styles.menuIcon} source={require("../../assets/icons/legality.png")} />
                    <Text style={styles.menuText}>Legality</Text>
                  </LinearGradient>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.menu}>
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("product_list")} useForeground={true} delayPressIn={0}>
                  <LinearGradient colors={colors}
                                  style={styles.menuWrapper}>
                    <View style={styles.shine} />
                    <Image style={styles.menuIcon} source={require("../../assets/icons/product.png")} />
                    <Text style={styles.menuText}>Our Product</Text>
                  </LinearGradient>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.menu}>
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("ethical_code")} useForeground={true} delayPressIn={0}>
                  <LinearGradient colors={colors}
                                  style={styles.menuWrapper}>
                    <View style={styles.shine} />
                    <Image style={styles.menuIcon} source={require("../../assets/icons/etichal-code.png")} />
                    <Text style={styles.menuText}>Ethical Code</Text>
                  </LinearGradient>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.menu}>
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("distribution_flow")} useForeground={true} delayPressIn={0}>
                  <LinearGradient colors={colors}
                                  style={styles.menuWrapper}>
                    <View style={styles.shine} />
                    <Image style={styles.menuIcon} source={require("../../assets/icons/flow.png")} />
                    <Text style={styles.menuText}>Distribution Flow</Text>
                  </LinearGradient>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.menu}>
                <TouchableNativeFeedback onPress={() => this.navigate("strategy_syariah")} useForeground={true} delayPressIn={0}>
                  <LinearGradient colors={colors}
                                  style={styles.menuWrapper}>
                    <View style={styles.shine} />
                    <Image style={styles.menuIcon} source={require("../../assets/icons/syariah-strategy.png")} />
                    <Text style={styles.menuText}>Syariah Business Strategy</Text>
                  </LinearGradient>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.menu}>
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("profile_of_management")} useForeground={true} delayPressIn={0}>
                  <LinearGradient colors={colors}
                                  style={styles.menuWrapper}>
                    <View style={styles.shine} />
                    <Image style={styles.menuIcon} source={require("../../assets/icons/profile-management.png")} />
                    <Text style={styles.menuText}>Profile of Management</Text>
                  </LinearGradient>
                </TouchableNativeFeedback>
              </View>
            </View>
          </Animated.ScrollView>
        </View>
      </ImageBackground>
    </View>;
  }
}
