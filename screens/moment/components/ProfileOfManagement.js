import React from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import Text from "../../../common/Text";

export class ProfileOfManagement extends React.Component {
  profiles = [
    {
      name: "Mellywati",
      position: "Commisioner",
      avatar: require("../../../assets/management/melly-wati.png"),
      bio: "Melly sapaan akrabnya (lahir di Makassar, 28 September 1972; umur 48 tahun) dilahirkan dari keluarga pengusaha, membuat Melly memiliki karakter pengusaha yang sangat kuat. Melly adalah seorang pebisnis, sosialita, serta pernah menduduki Komisaris di beberapa Perusahaan: - PT. Beenero (mulai tahun 2012 — hingga 2014) - PT. Berkat Cakra Indonesia (mulai tahun 2014 — hingga 2019) - PT. Momen Global Internasional (mulai tahun 2019 — hingga sekarang) "
    },
    {
      name: "Heru Cakra Wiryawan",
      position: "Director",
      avatar: require("../../../assets/management/heru-cakra.png"),
      bio: "Heru Cakra Wiryawan atau Heru sapaan akrabnya (lahir di Surabaya, 20 April 1963; umur 57 tahun) dilahirkan dari keluarga pengusaha di bidang Nutrisi, membuat Heru memiliki pemahaman yang balk tentang perkembangan Nutrisi di Indonesia. Bekal tersebut membawa kesuksesan karir Heru di Perusahaan Network Marketing berskala Internasional. Pengalaman lebih dari 25 tahun tersebut turut memudahkan Heru membuat Perusahaan Network Marketing miliknya (MOMENT) berkembang pesat, dan menjadi salah satu Perusahaan Network Marketing terbaik di Indonesia."
    },
    {
      name: "Faisal Effendi",
      position: "Branch Manager & Area Sales Manager Wilayah Indonesia Barat",
      avatar: require("../../../assets/management/faisal-effendi.png"),
      bio: "Faisal Effendi, berusia 41 tahun, warga Negara Indonesia, lahir di Jakarta pada 23 Oktober 1978. la memperoleh gelar sarjana Bisnis Internasional dan juga Finance dari Universitas Edith Cowan (1996-1999). Faisal Effendi memiliki pengalaman di multinasional company antara lain KOTRA yang membidangi kerjasama usaha antara Negara Korea Selatan dan Indonesia dan ORIFLAME yang membidangi Direct Sales. Dan saat ini menjabat sebagai Branch Manager PT. Momen Global Internasional di Jakarta sejak 2016 dan juga sebagai Area Sales Manager untuk Wilayah Indonesia Barat Sebelumnya menjabat sebagai Area Sales Manager dan Acting Area Manager di perusahaan ORIFLAME (2012-2015). Dan juga memiliki pengalaman sebagai Market Promotion dan Sales Manager di KOTRA dan Rajawali LBS (2009-2011) "
    },
    {
      name: "Stanley Lesmana",
      position: "Network & Support Development Manager",
      avatar: require("../../../assets/management/stanley-lesmana.png"),
      bio: "Stanley Lesmana, ST. Lahir di Bandung, 10 April 1975, Beliau lulusan Sarjana Teknik Informatika tetapi lebih banyak berkarier di bidang Marketing. Selain dunia Marketing beliau juga banyak terjun di dunia Pendidikan dan Training. Tahun 2008 beliau mendirikan E Global Partner yang banyak bergerak di bidang Pelatihan SDM baik untuk Perusahaan maupun Universitas. Selain menjadi Dosen Pengajar Personal Development dan Manajemen Pemasaran di beberapa Universitas di Surabaya, saat ini beliau dipercaya untuk memimpin Divisi Network & Support Development di PT. Momen Global Internasional "
    },
    {
      name: "Ahmad Hamzah",
      position: "Area Sales Manger Wilayah Indonesia Timur",
      avatar: require("../../../assets/management/ahmad-hamzah.png"),
      bio: "Ahmad Hamzah, lahir 01 Oktober 1970 ( Sumenep ) usia 50 thn, Hamzah memiliki latar belakang Pendidikan terakhir D3 Management ( 1998 — 2000 ). Dengan bekal ilmu manajemen dan pemasaran yang dimiliki, Hamzah mendapatkan banyak sekali kesempatan dan pengalaman kerja mulai dari Media cetak Jawa Pos tahun 2001 — 2004 sebagai Sales Area Kaltim dan beberapa perusahan skala internasional lainnya. Hamzah memulai terjun di dunia Network Marketing sejak 2004 — 2014 sebagai manajemen dengan posisi Marketing Manager. Pengalaman yang cukup lama tersebut, menempatkan kembali posisi sebagai Area Sales Manager Indonesia Timur hingga sekarang. "
    },
    {
      name: "Dr. Ayundria Purwitasari",
      position: "",
      avatar: require("../../../assets/management/ayun.png"),
      bio: "Ayun merupakan \n" +
        "Lulusan Fakultas Kedokteran Unair Surabaya tahun 2006.\n" +
        "Mengawali karir profesionalnya bergabung bersama Dinas Kesehatan Kota Surabaya sebagai koordinator Klinik Umum di Puskesmas Medokan Ayu (2007 - 2011). Kemudian melanjutkan karir di RSIA Lombok dua sebagai Manager Pelayanan Medis (2011-2013).\n" +
        "Pada Tahun 2014 mendapatkan kepercayaan untuk menduduki jabatan sebagai Product consultant/Medical Affair PT Momen Global International hingga sekarang"
    },
  ];

  renderProfile(profile){
    return <View style={styles.profile} key={profile.name}>
      <View>
        <Image style={styles.avatar} source={profile.avatar} />
      </View>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.position}>{profile.position}</Text>
      <Text style={styles.bio}>{profile.bio}</Text>
    </View>;
  }

  render(){
    return (
      <ImageBackground style={styles.background} source={require("../../../assets/bg/moment.jpg")}>

        <ScrollView style={{paddingBottom: 40,paddingTop: 15}}>
          {this.profiles.map(profile => {
            return this.renderProfile(profile);
          })}
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 70,
    marginBottom: 30,
    marginHorizontal: 20,
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 30
  },
  background: {
    flex: 1,
    position: "relative",
  },
  avatar: {
    width: 130,
    marginTop: -100,
    marginBottom: 10,
    height: undefined,
    aspectRatio: 1,
  },
  name: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold"
  },
  position: {
    textAlign: "center"
  },
  bio: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14
  }
});
