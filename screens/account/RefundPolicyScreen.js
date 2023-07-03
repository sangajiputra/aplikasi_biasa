import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Text from "../../common/Text";

export default class RefundPolicyScreen extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Text style={{ marginBottom: 5 }}>
            Layanan MyMoment menerima cara pembayaran dengan menggunakan metode
            pembayaran yang Anda pilih. MyMoment dapat memperoleh persetujuan awal untuk
            jumlah sampai dengan jumlah pesanan. Penagihan terhadap kartu kredit Anda terjadi pada
            saat transaksi atau segera sesudahnya.
            Pengertian layanan pada aplikasi MyMoment yang dimaksud berupa e-books dan video.
            Pembatalan &amp; Pertukaran Layanan
          </Text>
          <View style={styles.level1}>
            <Text>1</Text>
            <Text style={styles.levelContent}>Layanan yang sudah dibeli dapat dibatalkan maksimal dalam waktu 1x24 jam
                                              setelah pembayaran dilakukan.
            </Text>
          </View>
          <View style={styles.level1}>
            <Text>2</Text>
            <Text style={styles.levelContent}>
              Setiap pengajuan pembatalan/pertukaran layanan yang dilakukan lebih dari 1x24
              jam setelah pembayaran dilakukan tidak bisa di proses untuk
              pembatalan/pertukaran layanannya dan akan dianggap sebagai persetujuan
              pembelian layanan yang ditentukan.
            </Text>
          </View>
          <View style={styles.level1}>
            <Text>3</Text>
            <Text style={styles.levelContent}>
              Pembeli hanya boleh mengajukan pembatalan/pertukaran layanan dalam situasi
              berikut :
            </Text>
          </View>
          <View style={styles.level2}>
            <Text>-</Text>
            <Text style={styles.levelContent}>
              Link layanan rusak/tidak dapat diakses.
            </Text>
          </View>
          <View style={styles.level2}>
            <Text>-</Text>
            <Text style={styles.levelContent}>
              Isi yang terkandung di dalam layanan tidak sesuai dengan judul yang
              tertera.
            </Text>
          </View>
          <View style={styles.level1}>
            <Text>4</Text>
            <Text style={styles.levelContent}>
              Setiap pembatalan transaksi layanan yang masuk sesuai dengan ketentuan akan
              kami proses pengembalian dananya dalam waktu 5 (lima) hari kerja setelah proses
              pembatalan di lakukan.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1
  },
  level1: {
    paddingLeft: 15,
    flexDirection: "row",
    marginBottom: 4
  },
  level2: {
    paddingLeft: 30,
    flexDirection: "row",
    marginBottom: 4
  },
  levelContent: {
    paddingLeft: 10
  }
});
