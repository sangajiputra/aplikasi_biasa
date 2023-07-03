import React from "react";
import { Image, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import NoteItems from "./components/NoteItems";
import { connect } from "react-redux";
import { getNotes } from "../../states/actionCreators";
import TextInput from "../../common/TextInput";
import Selector from "../../common/Selector";
import analytics from "@react-native-firebase/analytics";

export function NoteScreen(props){
  const [query, setQuery] = React.useState(null);
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);

  let searchTimeout = null;
  let searchPromise = null;
  let menu = null;

  React.useEffect(() => {
    analytics().logEvent("notes");
  }, []);

  React.useEffect(() => {
    if (query !== null) {
      clearTimeout(searchTimeout);

      searchTimeout = setTimeout(() => {
        if (searchPromise) {
          searchPromise.abort();
        }

        searchPromise = props.getNotes(query).finally(result => searchPromise = null);
      }, 300);
    }

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const closeMenu = () => {
    this.setState({ isMenuVisible: false });
  };

  return (
    <View style={styles.container}>
      <Selector
        visible={isMenuVisible}
        onRequestClose={() => closeMenu()}
        ref={component => menu = component}
        options={[
          { label: "Add Note", value: "N" },
          { label: "Add Checklist", value: "T" }
        ]}
        onSelect={option => props.navigation.navigate("update_note", { type: option.value })}
      >
      </Selector>
      <View style={styles.addButton}>
        <TouchableNativeFeedback onPress={() => menu.open()} useForeground={true}>
          <Image style={styles.addButtonIcon} source={require("../../assets/icons/add.png")} />
        </TouchableNativeFeedback>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <Image style={styles.searchIcon} source={require("../../assets/icons/search.png")} />
            <TextInput onChangeText={value => setQuery(value)}
                       placeholderTextColor="#BBB"
                       style={styles.searchInput}
                       placeholder="Search Notes..." />
          </View>
        </View>
        <NoteItems style={styles.items} />
      </View>
    </View>
  );
}

const mapDispatchToProps = {
  getNotes
};

export default connect(null, mapDispatchToProps)(NoteScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#FAFAFA"
  },
  addButton: {
    position: "absolute",
    bottom: -5,
    right: 0,
    zIndex: 99
  },
  addButtonIcon: {
    width: 90,
    height: undefined,
    aspectRatio: 1
  },
  content: {
    flex: 1
  },
  items: {
    flexGrow: 0,
    flexShrink: 0
  },
  search: {
    borderRadius: 10,
    fontSize: 16,
    elevation: 5,
    backgroundColor: "#FFF",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15
  },
  searchInput: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1
  },
  searchContainer: {
    padding: 10,
    paddingTop: 13,
    paddingBottom: 13,
    position: "relative"
  },
  searchIcon: {
    width: 25,
    aspectRatio: 1,
    height: undefined,
    tintColor: "#CCC"
  }
});
