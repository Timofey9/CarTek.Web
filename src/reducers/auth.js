import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/types";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
    ? { isLoggedIn: true, user, isDriver: user.isDriver }
    : { isLoggedIn: false, user: null, isDriver: false };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
      case LOGIN_SUCCESS:
      return {
        ...state,
          isLoggedIn: true,
          user: payload.user,
          isDriver: payload.user.isDriver
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
          user: null,
          isDriver: false
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
}
