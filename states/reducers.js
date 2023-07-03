import AsyncStorage from "@react-native-community/async-storage";
import config from "../config";
import * as actions from "./actions";

const defaultState = {
  showTabBar: true,
  notification: {
    unseen_count: {
      notification: 0,
      inbox: 0,
      total: 0
    }
  },
  notes: {
    loading: false,
    _relayout: false,
    _relayouting: false,
    notes: []
  },
  vital_sign: {
    loading: false,
    currentIndicator: {},
    vital_signs: []
  },
  user: {},
  cart: {
    items: []
  },
  downline: {
    loading: false,
    downlines: [],
    _downlines: []
  },
  goal: {
    current: {},
    progress: []
  },
  lead: {
    loading: false,
    leads: []
  },
  event: {
    loading: false,
    events: []
  }
};

export default function reducers(state = defaultState, action){
  switch (action.type) {
    case actions.HIDE_TAB_BAR:
      return {
        ...state,
        showTabBar: false
      };

    case actions.SHOW_TAB_BAR:
      return {
        ...state,
        showTabBar: true
      };

    // NOTES REDUCER
    case actions.GET_NOTES:
      return {
        ...state,
        loading: true,
        notes: {
          ...state.notes,
          loading: true
        }
      };

    case actions.GET_NOTES_SUCCESS:
      return {
        ...state,
        loading: false,
        notes: {
          ...state.notes,
          loading: false,
          notes: action.payload.data.data
        }
      };

    case actions.GET_NOTES_FAIL:
      return {
        ...state,
        loading: false,
        notes: {
          ...state.notes,
          loading: false
        },
        error: "Error while fetching notes"
      };

    case actions.SAVE_NOTE:
      return {
        ...state,
        loading: true
      };

    case actions.SAVE_NOTE_SUCCESS:
      if (action.payload.data.success) {
        let id = action.payload.config.params.id;

        if (id) {
          return {
            ...state,
            loading: false,
            notes: {
              ...state.notes,
              notes: state.notes.notes.map(note => {
                return note.id == id ? action.payload.data.data : note;
              })
            }
          };
        }

        return {
          ...state,
          loading: false,
          notes: {
            ...state.notes,
            notes: [
              action.payload.data.data,
              ...state.notes.notes
            ]
          }
        };
      }

      return state;

    case actions.SAVE_NOTE_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while fetching notes"
      };

    case actions.DELETE_NOTE:
      return {
        ...state,
        loading: true
      };

    case actions.DELETE_NOTE_SUCCESS:
      return {
        ...state,
        loading: false,
        notes: {
          ...state.notes,
          notes: state.notes.notes.filter(note => {
            return note.id != action.payload.config.params.id;
          })
        }
      };

    case actions.DELETE_NOTE_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while fetching notes"
      };

    case actions._NOTES_RELAYOUT:
      return {
        ...state,
        notes: {
          ...state.notes,
          _relayout: true
        }
      };

    case actions._NOTES_RELAYOUTING:
      return {
        ...state,
        notes: {
          ...state.notes,
          _relayouting: true
        }
      };

    case actions._NOTES_RELAYOUTED:
      return {
        ...state,
        notes: {
          ...state.notes,
          _relayout: false,
          _relayouting: false
        }
      };

    // VITAL SIGN REDUCER

    case actions.GET_VITAL_SIGN:
      console.log('vt');

      return {
        ...state,
        loading: true,
        vital_sign: {
          ...state.vital_sign,
          loading: true
        }
      };

    case actions.GET_VITAL_SIGN_SUCCESS:
      console.log(action.payload.data.data);
      return {
        ...state,
        loading: false,
        vital_sign: {
          ...state.vital_sign,
          loading: false,
          vital_signs: action.payload.data.data.map(indicator => {
            return { ...indicator, active: false };
          })
        }
      };

    case actions.GET_VITAL_SIGN_FAIL:
      console.log('vt error');


      return {
        ...state,
        loading: false,
        vital_sign: {
          ...state.vital_sign,
          loading: false
        },
        error: "Error while fetching indicators"
      };

    case actions.TOGGLE_VITAL_SIGN_ACTIVE:
      var _state = { ...state };

      _state.vital_sign.vital_signs = _state.vital_sign.vital_signs.map((indicator) => {
        return {
          ...indicator,
          active: indicator.id == action.id ? (action.status === null ? !indicator.active : action.status) : false
        };
      });

      return _state;

    case actions.GET_CURRENT_INDICATOR:
      return {
        ...state,
        loading: true,
        vital_sign: {
          ...state.vital_sign,
          loading: true
        }
      };

    case actions.GET_CURRENT_INDICATOR_SUCCESS:
      return {
        ...state,
        loading: true,
        vital_sign: {
          ...state.vital_sign,
          loading: false,
          currentIndicator: action.payload.data.success ? action.payload.data.data : state.currentIndicator
        }
      };

    case actions.GET_CURRENT_INDICATOR_FAIL:
      return {
        ...state,
        loading: false,
        vital_sign: {
          ...state.vital_sign,
          loading: false
        },
        error: "Error while fetching current indicator"
      };

    case actions.CHECK_VITAL_SIGN:
      return {
        ...state,
        loading: true
      };

    case actions.CHECK_VITAL_SIGN_SUCCESS:
      if (action.payload.data.success) {
        return {
          ...state,
          loading: false,
          vital_sign: {
            ...state.vital_sign,
            vital_signs: state.vital_sign.vital_signs.map(indicator => {
              if (action.payload.config.params.id == indicator.id) {
                return {
                  ...indicator,
                  ...action.payload.data.data
                };
              }

              return indicator;
            })
          }
        };
      }

      return state;

    case actions.CHECK_VITAL_SIGN_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while submit indicator"
      };

    case actions.APPROVE_VITAL_SIGN:
      return {
        ...state,
        loading: true
      };

    case actions.APPROVE_VITAL_SIGN_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while approve indicator"
      };

    // ACCOUNT REDUCER

    case actions.LOGIN:
      return {
        ...state,
        loading: true
      };

    case actions.LOGIN_SUCCESS:
      if (action.payload.data.success) {
        AsyncStorage.setItem("userData", JSON.stringify({
          access_token: action.payload.data.access_token,
          data: action.payload.data.data
        }));

        config.accessToken = action.payload.data.access_token;

        return {
          ...state,
          loading: false,
          user: {
            ...state.user,
            ...action.payload.data.data
          }
        };
      }

      return state;

    case actions.LOGGED_IN:
      config.accessToken = action.data.access_token;

      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          ...action.data.data
        }
      };

    case actions.LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while logging you in"
      };

    case actions.CHANGE_AVATAR:
      return {
        ...state,
        loading: true
      };

    case actions.CHANGE_AVATAR_SUCCESS:
      var _state = {
        ...state,
        loading: false,
        user: {
          ...state.user,
          ...(action.payload.data.success ? action.payload.data.data : {})
        }
      };

      AsyncStorage.getItem("userData").then(_userData => {
        _userData = JSON.parse(_userData);

        AsyncStorage.setItem("userData", JSON.stringify({
          ..._userData,
          data: _state.user
        }));
      });

      return _state;

    case actions.CHANGE_AVATAR_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while changing your avatar"
      };

    case actions.LOGOUT:
      AsyncStorage.removeItem("userData");
      config.accessToken = null;

      return {
        ...defaultState
      };

    case actions.GET_DOWNLINES:
      return {
        ...state,
        loading: true,
        downline: {
          ...state.downline,
          loading: true
        }
      };

    case actions.GET_DOWNLINES_SUCCESS:
      return {
        ...state,
        loading: false,
        downline: {
          ...state.downline,
          loading: false,
          downlines: action.payload.data.success ? action.payload.data.data : state.downline.downlines
        }
      };

    case actions.GET_DOWNLINES_FAIL:
      return {
        ...state,
        loading: false,
        downline: {
          ...state.downline,
          loading: false
        }
      };

    case actions.GET_DOWNLINE:
      return {
        ...state,
        loading: false
      };

    case actions.GET_DOWNLINE_SUCCESS:
      if (action.payload.data.success) {
        let _downlines = [...state.downline._downlines];

        const index = _downlines.findIndex(downline => downline.id == action.payload.config.params.id);

        if (index !== -1) {
          _downlines[index] = {
            ..._downlines[index],
            ...action.payload.data.data
          };
        } else {
          _downlines.push(action.payload.data.data);
        }

        return {
          ...state,
          loading: false,
          downline: {
            downlines: state.downline.downlines.map(downline => {
              if (downline.id == action.payload.config.params.id) {
                return {
                  ...downline,
                  ...action.payload.data.data
                };
              }

              return downline;
            }),
            _downlines: _downlines
          }
        };
      }

      return {
        ...state,
        loading: false
      };

    case actions.GET_DOWNLINE_FAIL:
      return {
        ...state,
        loading: false
      };

    // CART REDUCER

    case actions.GET_CART:
      return {
        ...state,
        loading: true
      };

    case actions.GET_CART_SUCCESS:
      if (action.payload.data.success) {
        return {
          ...state,
          loading: false,
          cart: action.payload.data.data
        };
      }

      return state;

    case actions.GET_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while adding product to cart"
      };

    case actions.ADD_CART:
      return {
        ...state,
        loading: true
      };

    case actions.ADD_CART_SUCCESS:
      if (action.payload.data.success) {
        return {
          ...state,
          loading: false,
          cart: action.payload.data.data
        };
      }

      return state;

    case actions.ADD_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while adding product to cart"
      };

    case actions.ADD_TO_COLLECTION:
      return {
        ...state,
        loading: true
      };

    case actions.ADD_TO_COLLECTION_SUCCESS:
      if (action.payload.data.success) {
        return {
          ...state,
          loading: false,
        };
      }

      return state;

    case actions.ADD_TO_COLLECTION_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while adding product to collection"
      };

    case actions.REMOVE_CART:
      return {
        ...state,
        loading: true
      };

    case actions.REMOVE_CART_SUCCESS:
      if (action.payload.data.success) {
        return {
          ...state,
          loading: false,
          cart: action.payload.data.data
        };
      }

      return state;

    case actions.REMOVE_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while adding product to cart"
      };

    // GOAL REDUCER
    case actions.SET_CURRENT_GOAL:
      return {
        ...state,
        goal: {
          ...state.goal,
          current: action.data
        }
      };

    case actions.GET_CURRENT_GOAL:
      return {
        ...state,
        loading: true
      };

    case actions.GET_CURRENT_GOAL_SUCCESS:
      return {
        ...state,
        loading: false,
        goal: {
          ...state.goal,
          current: action.payload.data.success ? (action.payload.data.data ? action.payload.data.data : {}) : state.goal.current
        }
      };

    case actions.GET_CURRENT_GOAL_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while fetching goal"
      };

    case actions.RECORD_GOAL_PROGRESS:
      return {
        ...state,
        loading: true
      };

    case actions.RECORD_GOAL_PROGRESS_SUCCESS:
      var _state = {
        ...state,
        loading: false
      };

      if (action.payload.data.success) {
        if (_state.goal.current.id == action.payload.data.data.goal.id) {
          _state.goal.current = action.payload.data.data.goal;
        }

        action.payload.data.data.progress.forEach(value => _state.goal.progress.unshift(value));

        _state.goal.progress = [
          ..._state.goal.progress
        ];
      }

      return _state;

    case actions.RECORD_GOAL_PROGRESS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while recording progress"
      };

    case actions.GET_GOAL_PROGRESS:
      return {
        ...state,
        loading: true
      };

    case actions.GET_GOAL_PROGRESS_SUCCESS:
      return {
        ...state,
        loading: true,
        goal: {
          ...state.goal,
          progress: action.payload.data.success ? action.payload.data.data : state.goal.progress
        }
      };

    case actions.GET_GOAL_PROGRESS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while recording progress"
      };

    case actions.GET_LEADS:
      return {
        ...state,
        loading: true,
        lead: {
          ...state.lead,
          loading: true
        }
      };

    case actions.GET_LEADS_SUCCESS:
      return {
        ...state,
        loading: true,
        lead: {
          ...state.lead,
          loading: false,
          leads: action.payload.data.success ? action.payload.data.data : state.lead.leads
        }
      };

    case actions.GET_LEADS_FAIL:
      return {
        ...state,
        lead: {
          ...state.lead,
          loading: false
        },
        loading: false,
        error: "Error while fetching leads"
      };

    case actions.DELETE_LEAD:
    case actions.SAVE_LEAD:
      return {
        ...state,
        loading: true
      };

    case actions.SAVE_LEAD_SUCCESS:
      var _state = {
        ...state,
        loading: false
      };

      if (action.payload.data.success) {
        let _leads = [..._state.lead.leads];
        const index = _leads.findIndex(lead => lead.id == action.payload.config.params.id);

        if (index !== -1) {
          _leads[index] = {
            ..._leads[index],
            ...action.payload.data.data
          };
        } else {
          _leads.unshift(action.payload.data.data);
        }

        _state.lead.leads = _leads;
      }

      return _state;

    case actions.SAVE_LEAD_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while saving leads"
      };

    case actions.DELETE_LEAD_SUCCESS:
      return {
        ...state,
        loading: false,
        lead: {
          ...state.lead,
          leads: state.lead.leads.filter(lead => {
            return lead.id != action.payload.config.params.id;
          })
        }
      };

    case actions.DELETE_LEAD_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while deleting leads"
      };

    case actions.CHANGE_STATUS_LEAD_SUCCESS:
      return {
        ...state,
        loading: false,
        lead: {
          ...state.lead,
          leads: !action.payload.data.success ? state.lead.leads : state.lead.leads.map(lead => {
            return lead.id != action.payload.config.params.id ? lead : {
              ...lead,
              ...action.payload.data.data
            };
          })
        }
      };

    case actions.CHANGE_STATUS_LEAD_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while changing leads status"
      };

    // EVENT REDUCER
    case actions.GET_EVENT:
      return {
        ...state,
        loading: true,
        event: {
          ...state.event,
          loading: false
        }
      };

    case actions.GET_EVENT_SUCCESS:
      let events = state.event.events;

      if (action.payload.config.params.id) {
        events = events.map(event => {
          if (action.payload.config.params.id == event.id) {
            event = { ...event, ...action.payload.data.data };
          }

          return event;
        });
      } else {
        events = action.payload.data.success ? action.payload.data.data : events;
      }

      return {
        ...state,
        loading: false,
        event: {
          ...state.event,
          loading: false,
          events: events
        }
      };

    case actions.GET_EVENT_FAIL:
      return {
        ...state,
        loading: false,
        event: {
          ...state.event,
          loading: false
        },
        error: "Error while fetching event"
      };

    case actions.SAVE_EVENT:
      return {
        ...state,
        loading: false
      };

    case actions.SAVE_EVENT_SUCCESS:
      var _state = {
        ...state,
        loading: false
      };

      if (action.payload.data.success) {
        let _events = [..._state.event.events];
        const index = _events.findIndex(event => event.id == action.payload.config.params.id);

        if (index !== -1) {
          _events[index] = {
            ..._events[index],
            ...action.payload.data.data
          };
        } else {
          _events.unshift(action.payload.data.data);
        }

        _state.event.events = _events;
      }

      return _state;

    case actions.DELETE_EVENT:
      return {
        ...state,
        loading: false
      };

    case actions.SAVE_EVENT_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while saving event"
      };

    case actions.DELETE_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        event: {
          ...state.event,
          events: state.event.events.filter(event => {
            return event.id != action.payload.config.params.id;
          })
        }
      };

    case actions.DELETE_EVENT_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while deleting event"
      };

    case actions.CLEAR_EVENT:
      state.event.events = [];

      return state;

    case actions.GET_NOTIFICATION_COUNT:
      return {
        ...state,
        loading: true
      };

    case actions.GET_NOTIFICATION_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        notification: {
          ...state.notification,
          unseen_count: action.payload.data.success ? action.payload.data.data : state.notification.unseen_count
        }
      };

    case actions.GET_NOTIFICATION_COUNT_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while fetching notification"
      };

    default:
      return state;
  }
}
