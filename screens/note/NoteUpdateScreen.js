import React, { Fragment } from "react";
import { ActivityIndicator,ScrollView, Alert, Image, LayoutAnimation, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { deleteNote, saveNote } from "../../states/actionCreators";
import { connect, useSelector } from "react-redux";
import TextInput from "../../common/TextInput";
import Text from "../../common/Text";
import NoteItemCheck from "./components/NoteItemCheck";

let promise = null;

export function NoteUpdateScreen(props){
  const route = useRoute();
  const navigation = useNavigation();
  const inputs = [];

  const [id, setId] = React.useState(props.note ? props.note.id : (route.params ? route.params.id : null));

  const [title, setTitle] = React.useState(props.note ? props.note.title : null);
  const [content, setContent] = React.useState(props.note ? props.note.content : null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [type, setType] = React.useState("T");

  const note = useSelector(state => {
    if (props.note || !route.params?.id) {
      return null;
    }

    return state.notes.notes.find(note => note.id == route.params.id);
  });

  const remove = () => {
    Alert.alert("Confirmation", "You are about to delete this note, are you sure?", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            props.deleteNote(id).then(result => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            });
            navigation.goBack();
          }
        }
      ],
      { cancelable: true }
    );
  };

  React.useEffect(() => {
    if (route.params?.type) {
      setType(route.params?.type);
    }

    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setType(note.type);
      setId(note.id);

      if (note.type === "T") {
        note.items = note.items.map(item => {
          item.key = Math.random();

          return item;
        });

        setItems([...note.items, { content: "", fake: true, key: Math.random() }]);
      }
    } else {
      if (type === "T") {
        setItems([...items, { content: "", fake: true, key: Math.random() }]);
      }
    }

  }, []);

  React.useEffect(() => {
    if (id) {
      navigation.setOptions({
        headerRight: () => {
          return (
            <TouchableNativeFeedback onPress={() => remove()}>
              <View style={styles.toolbarAction}>
                <Image style={styles.toolbarActionIcon} source={require("../../assets/icons/delete.png")} />
              </View>
            </TouchableNativeFeedback>
          );
        }
      });
    }
  }, [id]);

  const save = async (auto = false) => {
    let _content = type === "T" ? items : content;

    if (type === "T") {
      _content = _content.map(item => {
        item.is_checked = item.is_checked ? 1 : 0;

        return item;
      });
    }

    if (title || _content) {
      await setIsLoading(true);

      promise = props.saveNote(title, _content, type, id).then(async result => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        if (result.payload.data && result.payload.data.success) {
          setId(result.payload.data.data.id);
        }
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      promise = new Promise((resolution, reject) => {
        if (auto) {
          resolution("Title and content is empty");
        } else {
          reject("Title and content is empty");
        }
      });
    }

    return promise;
  };

  const onItemChange = async function(data, index){
    let _items = items;

    index = _items.findIndex(item => {
      return item.key === index;
    });

    _items[index] = data;

    if (data.fake) {
      data.fake = false;
      _items.push({ content: "", fake: true, key: Math.random() });
    }

    await setItems([..._items]);
  };

  const onItemDelete = async function(index){
    let _items = [];

    items.forEach((value, _index) => {
      if (value.key !== index) {
        _items.push(value);
      } else {
        (value.content, index, _index);
      }
    });

    await setItems([..._items]);
  };

  const onAdd = () => {
      const _inputs = Object.values(inputs);

      _inputs[_inputs.length - 1].add()
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.title}
                   onChangeText={(value) => {setTitle(value);}}
                   value={title}
                   multiline={false}
                   placeholder="Title"
        />
        {type === "T" && <ScrollView style={styles.checklist}>
          {
            items.map((item, index) => (
              <NoteItemCheck key={item.key.toString()} data={item}
                             ref={component => inputs[item.key.toString()] = component}
                             index={item.key}
                             onAdd={onAdd}
                             onChange={onItemChange}
                             onDelete={onItemDelete} />
            ))
          }
        </ScrollView>}
        {type === "N" && <TextInput style={styles.content}
                                    onChangeText={(value) => {setContent(value);}}
                                    value={content}
                                    multiline={true}
                                    editable={true}
                                    autoFocus={!id}
                                    placeholder="Write your note here..."
        />}
      </View>

      {/* START OF ACTION*/}

      <View style={styles.action}>
        <TouchableNativeFeedback disabled={isLoading} onPress={() => save().then(() => navigation.goBack())}>
          <View style={styles.saveButton}>
            {isLoading ? <ActivityIndicator color="#FFF" size={26} /> : <Fragment>
              <Image source={require("../../assets/icons/send.png")} style={styles.saveButtonIcon} />
              <Text style={styles.saveButtonText}>Save</Text>
            </Fragment>
            }
          </View>
        </TouchableNativeFeedback>
      </View>

      {/* END OF ACTION*/}
    </View>
  );
}

const mapDispatchToProps = {
  saveNote,
  deleteNote
};

export default connect(null, mapDispatchToProps)(NoteUpdateScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  form: {
    flex: 1
  },
  title: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: "bold",
    fontSize: 23
  },
  content: {
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 15,
    flexShrink: 1,
    height: "100%",
    textAlignVertical: "top",
    lineHeight: 21
  },
  action: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#FFF"
  },
  saveButton: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    backgroundColor: "#3498df",
    borderRadius: 5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  saveButtonText: {
    fontSize: 20,
    color: "#FFF",
    lineHeight: 20
  },
  saveButtonIcon: {
    marginRight: 10,
    width: 26,
    height: undefined,
    aspectRatio: 1
  },
  toolbarActionIcon: {
    width: 20,
    height: undefined,
    aspectRatio: 1,
    tintColor: "#d45e4a"
  },
  checklist: {
    paddingHorizontal: 15
  }
});
