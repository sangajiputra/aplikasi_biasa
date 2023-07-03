import React from "react";
import { View } from "react-native";
import Text from "../../../common/Text";
import styles from "../styles";

export class VissionMission extends React.Component {
  render(){
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.visionMission}>
            <Text style={styles.visionMissionTitle}>Visi Kami</Text>
            <Text style={styles.visionMissionValue}>Menjadi pilihan terbaik perusahaan yang mendistribusikan produk kesehatan alami dengan cara penjualan langsung.</Text>
          </View>
          <View style={styles.visionMission}>
            <Text style={styles.visionMissionTitle}>Misi Kami</Text>
            <Text style={styles.visionMissionValue}>Selalu membuat perubahan menuju kehidupan yang lebih baik.</Text>
          </View>
          <View style={styles.visionMission}>
            <Text style={styles.visionMissionTitle}>Core Values</Text>
            <Text style={styles.visionMissionValue}>Semangat, saling menghormati, menjunjung tinggi integritas</Text>
          </View>
        </View>
      </View>
    );
  }
}
