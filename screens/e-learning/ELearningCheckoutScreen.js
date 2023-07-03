import React from "react";
import Text from "../../common/Text";
import { ActivityIndicator, Image, LayoutAnimation, ScrollView, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import ModalHeader from "./components/ModalHeader";
import axios from "axios";
import config from "../../config";
import { TextInputMask } from "react-native-masked-text";

export default class ELearningCheckoutScreen extends React.Component {
  state = {
    selected: "bank_transfer.bni",
    credit_card_number: "",
    credit_card_exp: "",
    credit_card_cvv: "",
    isLoading: false
  };

  select(paymentMethod){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.setState({ selected: paymentMethod });
  }

  async pay(){
    const qs = require("qs");

    await this.setState({ isLoading: true });

    const creditCardExp = this.state.credit_card_exp.split("/", 2);

    const result = await axios.post("/moment/cart/checkout", qs.stringify({
      payment_method: this.state.selected,
      credit_card_cvv: this.state.credit_card_cvv,
      credit_card_exp_year: creditCardExp ? creditCardExp[1] : null,
      credit_card_exp_month: creditCardExp ? creditCardExp[0] : null,
      credit_card_number: this.state.credit_card_number
    }), {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken
      }
    });

    const isBankTransfer = ["bank_transfer.bca","bank_transfer.mandiri", "bank_transfer.bni", "bank_transfer.permata"].indexOf(this.state.selected) !== -1;

    if (result.data.success) {
      if (result.data.data.payment_link) {
        this.props.navigation.navigate("e_learning_3ds", {
          headerTitle: 'Payment',
          url: result.data.data.payment_link,
          callback: () => {
            this.finish(result.data.data.model);
          }
        });
      }

      // if (result.data.data.data.redirect_uri && this.state.selected !== "gopay") {
      //   this.props.navigation.navigate("e_learning_3ds", {
      //     url: result.data.data.data.redirect_uri,
      //     callback: () => {
      //       this.finish(result.data.data.model);
      //     }
      //   });
      // } else if (isBankTransfer || this.state.selected === "credit_card") {
      //   this.finish(result.data.data.model);
      // } else if (this.state.selected === "gopay") {
      //   Linking.openURL(result.data.data.data.redirect_uri);
      //
      //   setTimeout(() => {
      //     this.finish(result.data.data.model);
      //   },6000);
      // }
    }

    return result;
  }

  finish(order){
    setTimeout(async () => {
      this.setState({ isLoading: false });

      await this.props.navigation.navigate("home");
      this.props.navigation.navigate("order_detail", { id: order.id });
    }, 4000);
  }

  render(){

    let content = <View style={styles.containerLoading}>
      <ActivityIndicator style={styles.loadingIndicator} color="#0000ff" size={30} />
      <Text style={styles.loadingText}>Submitting Your Order...</Text>
    </View>;

    if (!this.state.isLoading) {
      content = (
        <View style={styles.paymentContainer}>
          <ScrollView style={styles.payments}>

            <View style={styles.paymentWrapper}>
              <TouchableNativeFeedback onPress={() => this.select("bank_transfer.bni")}>
                <View style={styles.payment}>
                  <View style={styles.paymentIconWrapper}>
                    <Image style={styles.paymentIcon} source={require("../../assets/icons/bni.png")} />
                  </View>
                  <Text style={styles.paymentText}>BNI - Virtual Account</Text>

                  <View style={{ ...styles.checkbox, ...(this.state.selected === "bank_transfer.bni" ? styles.checkboxActive : {}) }}>
                    {this.state.selected === "bank_transfer.bni" && <View style={styles.checkboxChecker} />}
                  </View>
                </View>
              </TouchableNativeFeedback>

              {this.state.selected === "bank_transfer.bni" && <View style={styles.paymentBody}>
                <Text>Dapatkan nomor virtual account BNI setelah anda klik "Bayar", nomor virtual account yang anda dapatkan bersifat unik di setiap transaksi yang anda lakukan. </Text>
              </View>}
            </View>

            <View style={styles.paymentWrapper}>
              <TouchableNativeFeedback onPress={() => this.select("bank_transfer.permata")}>
                <View style={styles.payment}>
                  <View style={styles.paymentIconWrapper}>
                    <Image style={styles.paymentIcon} source={require("../../assets/icons/permata.png")} />
                  </View>
                  <Text style={styles.paymentText}>Permata - Virtual Account</Text>

                  <View style={{ ...styles.checkbox, ...(this.state.selected === "bank_transfer.permata" ? styles.checkboxActive : {}) }}>
                    {this.state.selected === "bank_transfer.permata" && <View style={styles.checkboxChecker} />}
                  </View>
                </View>
              </TouchableNativeFeedback>

              {this.state.selected === "bank_transfer.permata" && <View style={styles.paymentBody}>
                <Text>Dapatkan nomor virtual account BNI setelah anda klik "Bayar", nomor virtual account yang anda dapatkan bersifat unik di setiap transaksi yang anda lakukan. </Text>
              </View>}
            </View>

            <View style={styles.paymentWrapper}>
              <TouchableNativeFeedback onPress={() => this.select("bank_transfer.mandiri")}>
                <View style={styles.payment}>
                  <View style={styles.paymentIconWrapper}>
                    <Image style={styles.paymentIcon} source={require("../../assets/icons/mandiri.png")} />
                  </View>
                  <Text style={styles.paymentText}>Mandiri - Virtual Account</Text>

                  <View style={{ ...styles.checkbox, ...(this.state.selected === "bank_transfer.mandiri" ? styles.checkboxActive : {}) }}>
                    {this.state.selected === "bank_transfer.mandiri" && <View style={styles.checkboxChecker} />}
                  </View>
                </View>
              </TouchableNativeFeedback>

              {this.state.selected === "bank_transfer.mandiri" && <View style={styles.paymentBody}>
                <Text>Dapatkan nomor virtual account Mandiri setelah anda klik "Bayar", nomor virtual account yang anda dapatkan bersifat unik di setiap transaksi yang anda lakukan. </Text>
              </View>}
            </View>

            <View style={styles.paymentWrapper}>
              <TouchableNativeFeedback onPress={() => this.select("credit_card")}>
                <View style={styles.payment}>
                  <View style={styles.paymentIconWrapper}>
                    <Image style={styles.paymentIcon} source={require("../../assets/icons/visa-master.png")} />
                  </View>
                  <Text style={styles.paymentText}>Credit Card</Text>

                  <View style={{ ...styles.checkbox, ...(this.state.selected === "credit_card" ? styles.checkboxActive : {}) }}>
                    {this.state.selected === "credit_card" && <View style={styles.checkboxChecker} />}
                  </View>
                </View>
              </TouchableNativeFeedback>

              {this.state.selected === "credit_card" && <View style={styles.paymentBody}>
                <Text>Anda akan diarahkan menuju halaman untuk mengisi informasi kartu kredit anda setelah anda klik "Bayar". Kami tidak menyimpan informasi kartu kredit anda</Text>
              </View>}
            </View>

            <View style={styles.paymentWrapper}>
              <TouchableNativeFeedback onPress={() => this.select("gopay")}>
                <View style={styles.payment}>
                  <View style={styles.paymentIconWrapper}>
                    <Image style={styles.paymentIcon} source={require("../../assets/icons/gopay.png")} />
                  </View>
                  <Text style={styles.paymentText}>GoPay</Text>

                  <View style={{ ...styles.checkbox, ...(this.state.selected === "gopay" ? styles.checkboxActive : {}) }}>
                    {this.state.selected === "gopay" && <View style={styles.checkboxChecker} />}
                  </View>
                </View>
              </TouchableNativeFeedback>

              {this.state.selected === "gopay" && <View style={styles.paymentBody}>
                <Text>Setelah anda klik "Bayar", anda akan diarahkan menuju halaman aplikasi GO-Jek untuk melakukan pembayaran menggunakan gopay. Pastikan anda memiliki saldo yang cukup untuk melakukan proses pembayaran</Text>
              </View>}
            </View>

          </ScrollView>

          <TouchableNativeFeedback onPress={() => this.pay()}>
            <View style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }

    return (
      <ModalHeader showIcon={false} title="Payment Method">
        {content}
      </ModalHeader>
    );
  }
}

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loadingIndicator: {
    marginBottom: 10
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold"
  },
  payments: {
    padding: 15
  },
  paymentContainer: {
    flex: 1,
    justifyContent: "space-between"
  },
  paymentWrapper: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    elevation: 3,
    borderRadius: 10,
    backgroundColor: "#FFF",
    overflow: "hidden"
  },
  payment: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  paymentIconWrapper: {
    marginRight: 15
  },
  paymentText: {
    fontFamily: "QuicksandBold",
    flex: 1
  },
  paymentIcon: {
    height: 20,
    width: undefined,
    aspectRatio: 3.26315789474,
    resizeMode: "contain"
  },
  paymentBody: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    padding: 15,
    backgroundColor: "#FAFAFA"
  },
  checkbox: {
    borderWidth: 2,
    borderColor: "#DDD",
    width: 23,
    height: 23,
    borderRadius: 23,
    marginVertical: -4
  },
  checkboxActive: {
    borderColor: "#5198df",
    padding: 4
  },
  checkboxChecker: {
    width: "100%",
    height: "100%",
    backgroundColor: "#5198df",
    borderRadius: 21
  },
  formLabel: {
    marginBottom: 4
  },
  formSection: {
    marginBottom: 10
  },
  formTextInput: {
    borderColor: "#DDD",
    borderWidth: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 3,
    elevation: 2
  },
  payButton: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    backgroundColor: "#3498df",
    borderRadius: 5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 15
  },
  payButtonText: {
    fontSize: 20,
    color: "#FFF",
    lineHeight: 20
  },
  payButtonIcon: {
    marginRight: 10,
    width: 26,
    height: undefined,
    aspectRatio: 1
  }
});
