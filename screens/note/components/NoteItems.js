import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import NoteItem from "./NoteItem";
import { connect } from "react-redux";
import { _relayoutedNotes, _relayoutingNotes, getNotes } from "../../../states/actionCreators";

export function NoteItems(props){
  let [containerHeight, setContainerHeight] = React.useState(0);
  let leftColumnHeight = 0;
  let rightColumnHeight = 0;

  React.useEffect(() => {
    if (props._relayout) {
      if (!props._relayouting) {
        leftColumnHeight = 0;
        rightColumnHeight = 0;
      }

      setTimeout(() => {
        props._relayoutingNotes();
        props._relayoutedNotes();
      }, 1);
    }
  }, [props._relayout]);

  React.useEffect(() => {
    if (!props.items || props.items.length === 0) {
      props.getNotes();
    }
  }, []);

  const relayoutItem = (x, y, width, height) => {

    let newX = 0;
    let newY = 0;

    if (leftColumnHeight <= rightColumnHeight) {
      newY = leftColumnHeight;
      newX = 3;

      leftColumnHeight = leftColumnHeight + height;
    } else {
      newX = width + 6;
      newY = rightColumnHeight;

      rightColumnHeight = rightColumnHeight + height;
    }

    setContainerHeight(Math.max(leftColumnHeight, rightColumnHeight) + 10);

    return { x: newX, y: newY };
  };

  let content = (
    <View style={styles.containerLoading}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  if (!props.loading) {
    content = (
      <View style={{ ...styles.container, height: containerHeight }}>
        {props.items.map((item, index) => {
          return <NoteItem data={item} key={index} relayout={relayoutItem} />;
        })}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {content}
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    items: state.notes.notes,
    loading: state.notes.loading,
    _relayout: state.notes._relayout,
    _relayouting: state.notes._relayouting
  };
};

const mapDispatchToProps = {
  getNotes,
  _relayoutedNotes,
  _relayoutingNotes
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteItems);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  containerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 35
  }
});
