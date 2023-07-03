import React from "react";
import { Image, LayoutAnimation, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { _relayoutNotes } from "../../../states/actionCreators";
import { connect } from "react-redux";
import Text from "../../../common/Text";
import moment from 'moment';

export function NoteItem(props){
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [relayouted, setRelayouted] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (props._relayouting) {
      relayout(true);
    }
  }, [props._relayouting]);

  React.useEffect(() => {
    props._relayoutNotes();
  }, [height]);

  const relayout = function(isReload = true){
    const layout = props.relayout(x, y, width, height, isReload);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    setX(layout.x);
    setY(layout.y);

    setTimeout(() => {
      setRelayouted(true);
    }, 50);
  };

  const onContainerLayout = (event) => {
    const layout = event.nativeEvent.layout;

    if (height !== layout.height) {
      setHeight(layout.height);
      setWidth(layout.width);
    }
  };

  return (
    <View style={{ ...styles.container, top: y, left: x, opacity: relayouted ? 1 : 0 }} onLayout={onContainerLayout}>
      <TouchableNativeFeedback
        delayPressIn={0}
        onPress={() => {
          navigation.navigate("update_note", {
            id: props.data.id
          });
        }}
      >
        <View style={styles.wrapper}>
          {props.data.title ? <Text style={styles.title}>{props.data.title}</Text> : null}
          {props.data.type === "N" && <Text style={styles.content}>{props.data.content}</Text>}
          {props.data.type === "T" && (
            <View style={styles.checklist}>
              {props.data.items.map((item,index) => (
                <View key={index.toString()} style={styles.item}>
                  <View style={{ ...styles.checkbox, ...(item.is_checked ? styles.checked : {}) }}>
                    {item.is_checked && <Image style={styles.checkIcon} source={require("../../../assets/icons/check.png")} />}
                  </View>
                  <Text style={styles.itemText}>{item.content}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 12}}>{moment(props.data.created_at * 1000).format('YYYY-MM-DD HH:mm')}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    _relayouting: state.notes._relayouting
  };
};

const mapDispatchToProps = {
  _relayoutNotes
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteItem);

const styles = StyleSheet.create({
  container: {
    width: "50%",
    position: "absolute"
  },
  wrapper: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#FFF",
    padding: 15,
    marginHorizontal: 3,
    marginBottom: 10,
    elevation: 1
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222"
  },
  content: {
    fontSize: 14,
    color: "#222",
    lineHeight: 20
  },
  checked: {
    backgroundColor: "#bae9ff",
    borderColor: "#3498df"
  },
  checkIcon: {
    tintColor: "#3498df"
  },
  textChecked: {
    textDecorationLine: "line-through",
    textDecorationColor: "red",
    textDecorationStyle: "solid"
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#AAA",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  item: {
    flexDirection: "row",
    marginBottom: 5,
    borderBottomWidth: 1,
    paddingVertical: 5,
    borderColor: '#EEE'
  },
  itemText: {
    fontSize: 14,
    alignItems: 'center'
  }
});
