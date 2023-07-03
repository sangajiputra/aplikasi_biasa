import { StatusBar, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 1,
    position: "relative"
  },
  highlightText: {
    textAlign: "justify",
    fontSize: 18,
    paddingHorizontal: 20
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight + 30,
    marginBottom: 30
  },
  logo: {
    width: 300,
    height: undefined,
    aspectRatio: 4.15282392027
  },
  navigation: {
    flexDirection: "row",
    marginTop: 40,
    marginBottom: 30,
    flexWrap: "wrap",
    borderRadius: 20,
    overflow: "hidden"
  },
  menuWrapper: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    marginBottom: 5,
    borderRadius: 8
  },
  shine: {
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: "rgba(255,255,255,0.4)",
    position: "absolute",
    top: 10,
    left: -90
  },
  menuIcon: {
    width: 40,
    height: undefined,
    aspectRatio: 1,
    marginRight: 10
  },
  menuText: {
    fontSize: 16
  },
  menu: {
    flex: 1,
    flexDirection: "column",
    flexBasis: "100%",
    flexWrap: "wrap",
    paddingHorizontal: 15
  },
  contentContainer: {
    position: "relative",
    flex: 1
  },
  modal: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  modalWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    elevation: 6,
    height: "100%",
    position: "relative"
  },
  modalScroller: {
    padding: 15
  },
  content: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  legality: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    paddingBottom: 10,
    marginBottom: 10
  },
  legalityTitle: {
    fontFamily: "QuicksandBold",
    marginBottom: 5
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "QuicksandBold",
    paddingBottom: 10
  },
  visionMission: {
    marginBottom: 30
  },
  visionMissionTitle: {
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
    fontFamily: "QuicksandBold",
    fontSize: 20
  },
  visionMissionValue: {
    textAlign: "center",
    fontSize: 18
  },
  header: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5
  },
  section: {
    marginBottom: 20
  },
  socials: {
    flexDirection: 'row'
  },
  social: {
      marginRight: 10
  },
  socialIcon: {
    width: 40,
    height: undefined,
    aspectRatio: 1
  }
});

export default styles;
