import React, { Fragment } from "react";
import axios from "axios";
import config from "../../../config";
import { LayoutAnimation, StyleSheet, View } from "react-native";
import Text from "../../../common/Text";
import moment from "moment";

export default function Estimate(props){
  const [estimations, setEstimations] = React.useState({
    referral: [],
    pairing: null
  });

  const packages = {
    "G": "Gold",
    "P": "Platinum",
    "S": "Silver",
    "B": "Bronze",
    "U": "Userpack"
  };

  let estimateTimeout = null;

  React.useEffect(() => {
    clearTimeout(estimateTimeout);

    estimateTimeout = setTimeout(() => {
      if ((props.deadline && props.value) || props.refreshing) {
        estimate();
      }
    }, 500);
  }, [props.deadline, props.value,props.refreshing]);

  const estimate = () => {
    return axios.get("/moment/goal/estimate", {
      baseURL: config.baseUrl,
      params: {
        access_token: config.accessToken,
        value: props.value,
        deadline: deadlineToDate()
      }
    }).then(response => {
      if (response.data.success && response.data.data) {
        let referralEstimations = [];

        for (let estimationIndex in response.data.data.referral) {
          referralEstimations.push({ package: estimationIndex, ...response.data.data.referral[estimationIndex] });
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setEstimations({
          referral: referralEstimations,
          pairing: response.data.data.pairing
        });
      }
    });
  };

  const deadlineToDate = () => {
    return moment().add(props.deadline, "months").format("YYYY-MM-DD");
  };

  return (
    <View {...props} style={{ ...styles.container, ...props.style }}>
      <Text style={styles.estimationHeader}>Target jaringan: {estimations.pairing} kanan | {estimations.pairing} kiri</Text>
      <Text style={styles.estimationHeader}>Perhitungan dibawah hanya diambil dari bonus referral (Sponsor):</Text>
      <View style={{ ...styles.estimations }}>
        {estimations.referral.map((estimation, index) => (
          <Fragment key={estimation.package}>
            <View style={styles.estimation}>
              <View style={styles.estimationValue}>
                <Text style={styles.estimationCount}>{estimation.amount}</Text>
                <Text style={styles.estimationPackage}>{packages[estimation.package]}</Text>
              </View>
              {props.deadline > 1 && estimation.for > 1 && <Text style={styles.estimationLabel}>{"per bulan"}</Text>}
              {props.deadline > 1 && estimation.for < props.deadline && <Text style={styles.estimationLabelSecond}>{"(" + estimation.for.toString() + " bulan)"}</Text>}
            </View>

            {index < (estimations.referral.length - 1) && <View style={styles.estimationOr}>
              <View style={styles.estimationOrLine} />
              <Text style={styles.estimationOrText}>OR</Text>
            </View>}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  estimations: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap"
  },
  estimation: {
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginVertical: 15
  },
  estimationValue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  estimationCount: {
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 3,
    color: "#3498df"
  },
  estimationPackage: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#3498df"
  },
  estimationOr: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center"
  },
  estimationOrText: {
    marginVertical: 10,
    marginHorizontal: 6,
    borderRadius: 30,
    backgroundColor: "#EEE",
    fontSize: 12,
    width: 37,
    height: 37,
    fontWeight: "bold",
    borderWidth: 5,
    borderColor: "#FFF",
    margin: -5,
    textAlign: "center",
    lineHeight: 42
  },
  estimationOrLine: {
    borderLeftWidth: 1,
    borderLeftColor: "#AAA",
    position: "absolute",
    top: 0,
    bottom: 0
  },
  estimationHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15
  },
  estimationLabel: {
    textAlign: "center",
    marginTop: 2
  },
  estimationLabelSecond: {
    textAlign: "center",
    fontSize: 12
  }
});
