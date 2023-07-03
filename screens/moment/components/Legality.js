import React from 'react';
import { View } from "react-native";
import Text from "../../../common/Text";
import styles from "../styles";

export class Legality extends React.Component {
  render(){
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Legality</Text>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.legality}>
            <Text style={styles.legalityTitle}>Dinas Perdagangan dan Perindustrian - Tanda Daftar Perusahaan Perseroan Terbatas(PT)</Text>
            <Text style={styles.legalityMeta}>Nomor: 13.01.1.46.29364</Text>
            <Text style={styles.legalityMeta}>Perusahaan: PT. MOMEN GLOBAL INTERNASIONAL</Text>
          </View>
          <View style={styles.legality}>
            <Text style={styles.legalityTitle}>Notaris Pejabat Pembuat Akta Tanah (Akta Pendirian) Wachid Hasyim, SH</Text>
            <Text style={styles.legalityMeta}>Nomor: 03</Text>
            <Text style={styles.legalityMeta}>Tanggal: 02 Juli 2014</Text>
          </View>
          <View style={styles.legality}>
            <Text style={styles.legalityTitle}>Dinas Perdagangan dan Perindustrian - Surat Ijin Usaha Perdagangan (Besar)</Text>
            <Text style={styles.legalityMeta}>Nomor: 503/7150.A/436.6.11/2014</Text>
            <Text style={styles.legalityMeta}>Perusahaan: PT. MOMEN GLOBAL INTERNASIONAL</Text>
          </View>
          <View style={styles.legality}>
            <Text style={styles.legalityTitle}>Keputusan Menteri Hukum dan Hak Asasi Aanusia Republik Indonesia</Text>
            <Text style={styles.legalityMeta}>Nomor: AHU – 05543.40.20.2014</Text>
            <Text style={styles.legalityMeta}>Tanggal: 15 Juli 2014</Text>
            <Text style={styles.legalityMeta}>Perusahaan: PT. MOMEN GLOBAL INTERNASIONAL</Text>
          </View>
          <View style={styles.legality}>
            <Text style={styles.legalityTitle}>Nomor Pokok Wajib Pajak</Text>
            <Text style={styles.legalityMeta}>Nomor: 70.625.115.4-619.000</Text>
            <Text style={styles.legalityMeta}>Perusahaan: PT. MOMEN GLOBAL INTERNASIONAL</Text>
          </View>
          <View style={styles.legality}>
            <Text style={styles.legalityTitle}>Surat Izin Usaha Penjualan Langsung (SIUPL) Tetap</Text>
            <Text style={styles.legalityMeta}>Nomor: 39/1/IU/PMDN/2016</Text>
            <Text style={styles.legalityMeta}>Perusahaan: PT. MOMEN GLOBAL INTERNASIONAL</Text>
          </View>
          <View style={styles.legality}>
            <Text style={styles.legalityTitle}>Tanda Keanggotaan APLI</Text>
            <Text style={styles.legalityMeta}>Nomor: 0171/04/16</Text>
            <Text style={styles.legalityMeta}>Produk: Minuman Kesehatan & Supplemen</Text>
            <Text style={styles.legalityMeta}>Perusahaan: PT. MOMEN GLOBAL INTERNASIONAL</Text>
          </View>
          <View style={styles.legality}>
            <Text style={styles.legalityTitle}>Sertifikat Dewan Syari'ah Nasional - MUI</Text>
            <Text style={styles.legalityTitle}>"Telah Memenuhi Prinsip Syariah" Berdasarkan SK No. 006.53.01/DSN-MUI/VII/2017</Text>
            <Text style={styles.legalityMeta}>Kelompok: Penjualan Langsung Berjenjang Syariah</Text>
            <Text style={styles.legalityMeta}>Produk: Nutrisi Kesehatan</Text>
            <Text style={styles.legalityMeta}>Alamat: Jl. Klampis Jaya Kav. A26 No. 8E Surabaya</Text>
            <Text style={styles.legalityMeta}>Perusahaan: PT. MOMEN GLOBAL INTERNASIONAL</Text>
          </View>
          <View style={styles.legality}>
            <Text style={styles.legalityTitle}>ISO : Manajemen Mutu ACS Registrars Certificate Number 130416 (ISO 9001:2015), Scope Registration "Industrial Distributor for food and Beverages"</Text>
          </View>
        </View>
      </View>
    );
  }
}
