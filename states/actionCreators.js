import config from "../config";
import { toFormData } from "../common/helpers";
import * as actions from "./actions";

export function showNav(isShowed){
  return {
    type: isShowed ? actions.SHOW_TAB_BAR : actions.HIDE_TAB_BAR
  };
}

// NOTES ACTION CREATOR

export function getNotes(q = null){
  return {
    type: actions.GET_NOTES,
    payload: {
      request: {
        url: "/moment/todo/get",
        method: "GET",
        params: {
          access_token: config.accessToken,
          expand: "items",
          q: q
        }
      }
    }
  };
}

export function deleteNote(id){
  return {
    type: actions.DELETE_NOTE,
    id: id,
    payload: {
      request: {
        url: "/moment/todo/delete",
        method: "POST",
        params: {
          access_token: config.accessToken,
          id: id
        }
      }
    }
  };
}

export function saveNote(title, content, type, id = null){
  const qs = require("qs");

  return {
    type: actions.SAVE_NOTE,
    payload: {
      request: {
        url: id ? "/moment/todo/update" : "/moment/todo/add",
        method: "POST",
        params: {
          access_token: config.accessToken,
          id: id,
          expand: "items"
        },
        data: qs.stringify({
          title,
          content: type === "N" ? content : null,
          items: type === "T" ? content : null,
          type: type
        })
      }
    }
  };
}

export function _relayoutNotes(){
  return {
    type: actions._NOTES_RELAYOUT
  };
}

export function _relayoutedNotes(){
  return {
    type: actions._NOTES_RELAYOUTED
  };
}

export function _relayoutingNotes(){
  return {
    type: actions._NOTES_RELAYOUTING
  };
}

// VITAL SIGN ACTION CREATOR

export function getVitalSigns(stageId){

  return {
    type: actions.GET_VITAL_SIGN,
    payload: {
      request: {
        url: "/moment/indicator/get",
        method: "GET",
        params: {
          access_token: config.accessToken,
          stage_id: stageId,
          expand: "is_checked,is_approved,checker"
        }
      }
    }
  };
}

export function getCurrentIndicator(){
  return {
    type: actions.GET_CURRENT_INDICATOR,
    payload: {
      request: {
        url: "/moment/indicator/current",
        method: "GET",
        params: {
          access_token: config.accessToken,
          expand: "is_checked,is_approved,checker"
        }
      }
    }
  };
}

export function toggleVitalSignActivation(id, status = null){
  return {
    type: actions.TOGGLE_VITAL_SIGN_ACTIVE,
    id: id,
    status: status
  };
}

export function checkIndicator(id){
  return {
    type: actions.CHECK_VITAL_SIGN,
    payload: {
      request: {
        url: "/moment/indicator/check",
        method: "POST",
        params: {
          access_token: config.accessToken,
          expand: "is_checked,is_approved,checker",
          id: id
        }
      }
    }
  };
}

export function approveIndicator(id, memberId){
  const qs = require("qs");

  return {
    type: actions.APPROVE_VITAL_SIGN,
    payload: {
      request: {
        url: "/moment/indicator/approve",
        method: "POST",
        params: {
          access_token: config.accessToken,
          expand: "is_checked,is_approved,checker",
          id: id
        },
        data: qs.stringify({
          member_id: memberId
        })
      }
    }
  };
}

export function getDownlines(page){
  return {
    type: actions.GET_DOWNLINES,
    payload: {
      request: {
        url: "/moment/member/downlines",
        method: "GET",
        params: {
          access_token: config.accessToken,
          page: page ? page : 1,
          expand: "account,account.avatar_thumbnail_url,stage,is_need_review"
        }
      }
    }
  };
}

export function getDownline(id){
  return {
    type: actions.GET_DOWNLINE,
    payload: {
      request: {
        url: "/moment/member/downlines",
        method: "GET",
        params: {
          access_token: config.accessToken,
          id: id,
          expand: "account,account.avatar_thumbnail_url,stage,current_indicator,current_checker,is_need_review"
        }
      }
    }
  };
}

// ACCOUNT ACTION CREATOR

export function loggedIn(data){
  return {
    type: actions.LOGGED_IN,
    data: data
  };
}

export function login(username, password, fcmToken){
  const qs = require("qs");

  return {
    type: actions.LOGIN,
    payload: {
      request: {
        url: "/moment/member/login",
        method: "POST",
        data: qs.stringify({
          username: username,
          password: password,
          fcm_token: fcmToken
        }),
        params: {
          access_token: config.accessToken,
          expand: "profile,profile.stage,profile.stage.badge_url,avatar_thumbnail_url,profile.upline,profile.city,profile.province"
        },
      }
    }
  };
}

export function changePassword(current, newPassword, passwordRepeat){
  const qs = require("qs");

  return {
    type: actions.CHANGE_PASSWORD,
    payload: {
      request: {
        url: "/moment/member/change-password",
        method: "POST",
        data: qs.stringify({
          old_password: current,
          password: newPassword,
          password_repeat: passwordRepeat
        }),
        params: {
          access_token: config.accessToken
        }
      }
    }
  };
}

export function changeAvatar(avatar, name){
  let formData = new FormData();

  let uriParts = avatar.split(".");
  let fileType = uriParts[uriParts.length - 1];
  let rand = (Math.random().toFixed(5) * 10000).toString();

  formData.append("uploaded_avatar", {
    uri: avatar,
    name: `${name}-${rand}.${fileType}`,
    type: `image/${fileType}`
  });

  return {
    type: actions.CHANGE_AVATAR,
    payload: {
      request: {
        url: "/moment/member/change-avatar",
        method: "POST",
        data: formData,
        params: {
          access_token: config.accessToken,
          expand: "avatar_thumbnail_url,avatar_picture_url"
        },
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    }
  };
}

export function logout(){

  return {
    type: actions.LOGOUT
  };
}

// ECOMMERCE ACTION CREATOR

export function getCart(type = "default"){
  let expand = ["items"];

  if (type === "detail") {
    expand.push("items.product.thumbnail_url");
  }

  return {
    type: actions.GET_CART,
    payload: {
      request: {
        url: "/moment/cart/get",
        method: "GET",
        params: {
          access_token: config.accessToken,
          expand: expand.join(",")
        }
      }
    }
  };
}

export function addToCart(productId){
  const qs = require("qs");

  return {
    type: actions.ADD_CART,
    payload: {
      request: {
        url: "/moment/cart/add",
        method: "POST",
        params: {
          access_token: config.accessToken,
          expand: "items"
        },
        data: qs.stringify({
          product_id: productId
        })
      }
    }
  };
}

export function addToCollection(productId){

  return {
    type: actions.ADD_TO_COLLECTION,
    payload: {
      request: {
        url: "/moment/ecommerce-collection/add",
        method: "POST",
        params: {
          access_token: config.accessToken,
          product_id: productId
        }
      }
    }
  };
}

export function removeFromCart(productId, type = "default"){
  const qs = require("qs");

  let expand = ["items"];

  if (type === "detail") {
    expand.push("items.product.thumbnail_url");
  }

  return {
    type: actions.REMOVE_CART,
    payload: {
      request: {
        url: "/moment/cart/remove",
        method: "POST",
        params: {
          access_token: config.accessToken,
          expand: expand.join(",")
        },
        data: qs.stringify({
          product_id: productId
        })
      }
    }
  };
}

// GOAL ACTION CREATOR

export function saveGoal(data, id = null){
  const photo = data.uploaded_photo;

  if (data.uploaded_photo) {
    data.uploaded_photo = null;
  }

  let formData = toFormData(data);

  if (photo) {
    let uriParts = photo.split(".");
    let fileType = uriParts[uriParts.length - 1];
    let rand = Math.random().toFixed(5) * 10000;

    formData.append("uploaded_photo", {
      uri: photo,
      name: `${data.name}-${rand}.${fileType}`,
      type: `image/${fileType}`
    });
  }

  return {
    type: actions.SAVE_GOAL,
    payload: {
      request: {
        url: id ? "moment/goal/update" : "/moment/goal/add",
        method: "POST",
        params: {
          access_token: config.accessToken,
          id: id,
          expand: "photo_thumbnail_url"
        },
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: formData
      }
    }
  };
}

export function setCurrentGoal(data){
  return {
    type: actions.SET_CURRENT_GOAL,
    data: data
  };
}

export function getCurrentGoal(type = "default"){
  return {
    type: actions.GET_CURRENT_GOAL,
    payload: {
      request: {
        url: "/moment/goal/current",
        method: "GET",
        params: {
          access_token: config.accessToken,
          expand: "photo_thumbnail_url"
        }
      }
    }
  };
}

export function getGoalProgress(){
  return {
    type: actions.GET_GOAL_PROGRESS,
    payload: {
      request: {
        url: "/moment/goal-progress/get",
        method: "GET",
        params: {
          access_token: config.accessToken
        }
      }
    }
  };
}

export function recordGoalProgress(goalId, progress){
  const qs = require("qs");

  return {
    type: actions.RECORD_GOAL_PROGRESS,
    payload: {
      request: {
        url: "/moment/goal/record-progress",
        method: "POST",
        data: qs.stringify(progress),
        params: {
          access_token: config.accessToken,
          id: goalId,
          expand: "photo_thumbnail_url"
        }
      }
    }
  };
}

// LEAD ACTION CREATOR

export function getLeads(params = {}){
  return {
    type: actions.GET_LEADS,
    payload: {
      request: {
        url: "/moment/lead/get",
        method: "GET",
        params: {
          ...params,
          access_token: config.accessToken,
          expand: "photo_thumbnail_url,province,city,disease"
        }
      }
    }
  };
}

export function saveLead(data, id = null){
  const photo = data.uploaded_photo;

  if (data.uploaded_photo) {
    data.uploaded_photo = null;
  }

  let formData = toFormData(data);

  if (photo) {
    let uriParts = photo.split(".");
    let fileType = uriParts[uriParts.length - 1];
    let rand = Math.random().toFixed(5) * 10000;

    formData.append("uploaded_photo", {
      uri: photo,
      name: `${data.name}-${rand}.${fileType}`,
      type: `image/${fileType}`
    });
  }

  return {
    type: actions.SAVE_LEAD,
    payload: {
      request: {
        url: id ? "/moment/lead/update" : "/moment/lead/add",
        method: "POST",
        data: formData,
        params: {
          access_token: config.accessToken,
          id: id,
          expand: "photo_thumbnail_url,province,city,disease"
        },
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    }
  };
}

export function deleteLead(id){
  return {
    type: actions.DELETE_LEAD,
    payload: {
      request: {
        url: "/moment/lead/delete",
        method: "POST",
        params: {
          access_token: config.accessToken,
          id: id
        }
      }
    }
  };
}

export function changeLeadStatus(id, status){
  return {
    type: actions.CHANGE_STATUS_LEAD,
    payload: {
      request: {
        url: "/moment/lead/change-status",
        method: "POST",
        params: {
          access_token: config.accessToken,
          id: id,
          expand: "photo_thumbnail_url,province,city",
          status: status
        }
      }
    }
  };
}

// EVENT ACTION CREATORS

export function getEvent(params = {}){
  return {
    type: actions.GET_EVENT,
    payload: {
      request: {
        url: "/moment/event/get",
        method: "GET",
        params: {
          access_token: config.accessToken,
          expand: "picture_url,lead",
          fields: "*,lead.id,lead.name",
          ...params
        }
      }
    }
  };
}

export function saveEvent(params, id){
  const qs = require("qs");

  return {
    type: actions.SAVE_EVENT,
    payload: {
      request: {
        url: id ? "/moment/event/update" : "/moment/event/add",
        method: "POST",
        params: {
          access_token: config.accessToken,
          id: id
        },
        data: qs.stringify(params)
      }
    }
  };
}

export function clearEvent(){
  return {
    type: actions.CLEAR_EVENT
  };
}

export function deleteEvent(id){
  return {
    type: actions.DELETE_EVENT,
    payload: {
      request: {
        url: "/moment/event/delete",
        method: "POST",
        params: {
          access_token: config.accessToken,
          id: id
        }
      }
    }
  };
}

// NOTIFICATION

export function getNotificationCount(){
  return {
    type: actions.GET_NOTIFICATION_COUNT,
    payload: {
      request: {
        url: "/moment/notification/count",
        method: "GET",
        params: {
          access_token: config.accessToken
        }
      }
    }
  };
}
