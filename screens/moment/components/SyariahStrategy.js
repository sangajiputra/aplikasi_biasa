import React from "react";
import { View } from "react-native";
import Text from "../../../common/Text";
import styles from "../styles";

export class SyariahStrategy extends React.Component {
  render(){
    return (
      <View>
        <View style={styles.section}>
          <Text style={styles.header}>Strategi Bisnis Syariah</Text>
          <Text style={{marginBottom: 10}}>
            Salah satu kegiatan ekonomi yang berkembang pesat saat ini adalah Multilevel Marketing (MLM). MLM merupakan sebuah metode bisnis alternatif yang berhubungan dengan pemasaran dan distribusi yang dilakukan oleh banyak level. Bisnis MLM ini seringkali disalahartikan sebagai cara cepat dan mudah mendapatkan kekayaan. Pandangan ini muncul karena banyaknya bisnis money game yang mengatasnamakan MLM sehingga masyarakat hanya mengenal MLM adalah sebagai bisnis uang. MLM syari'ah mucul sebagai solusi bisnis orang-orang muslim agar menjalankan bisnis pada jaringan yang halal.
          </Text>
          <Text style={{marginBottom: 10}}>
            Strategi bisnis syari'ah pada PT. Momen Global Indonesia adalah sesuai dengan syari'at islam yaitu sudah mendapatkan sertifikasi dari DSN MUI. Strategi bisnis pada perusahaan ini tidak terdapat unsur gharar, riba dan merugikan. Produk yang dijual adalah produk halal berazazkan thibunnabawi serta sudah mendapatkan ijin edar dari BPOM dan sertifikat halal dari MUI. Adapun sistem bonus dan royalty pada PT Momen Global Indonesia adalah menggunakan akad ju'alah, dimana bonus dan royalty diberikan berdasarkan prestasi kerja para agen.
          </Text>
          <Text style={{marginBottom: 10}}>
            Perusahaan ini juga memberikan bantuan kepada masyarakat baik itu dari segi financial, kesehatan dan santunan untuk anak — anak yatim piatu yang dilakukan setiap bulan oleh semua kantor cabang melalui program Moment Care. Setiap tahun PT. Momen Global Internasional mengadakan program reward umroh.
          </Text>
          <Text style={{marginBottom: 10}}>
            Rencana strategi bisnis syari'ah kedepan PT. Moment Global Internasional adalah membantu perekonomian warga muslim karena hampir 90% member kami muslim. Dan bekerjasama dengan biro umroh dan pondok pesantren.
          </Text>
        </View>
      </View>
    );
  }
}
