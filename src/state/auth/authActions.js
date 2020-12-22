import actionTypes from "../actionTypes";

export const signInAction = (data) => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    try {
      var res = await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);
      dispatch({ type: actionTypes.LOGIN_SUCCESS, res });
    } catch (err) {
      dispatch({ type: actionTypes.LOGIN_ERROR, err });
    }
  };
};
export const signInWithGoogleAction = () => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    var provider = new firebase.auth.GoogleAuthProvider();
    try {
      var res = await firebase.auth().signInWithPopup(provider);
      dispatch({ type: actionTypes.GOOGLE_LOGIN_SUCCESS, res });
    } catch (err) {
      dispatch({ type: actionTypes.GOOGLE_LOGIN_ERROR, err });
    }
  };
};

export const showAuthModal = () => {
  return (dispatch) => {
    dispatch({ type: actionTypes.SHOW_AUTH_MODAL });
  };
};
export const hideAuthModal = () => {
  return (dispatch) => {
    dispatch({ type: actionTypes.HIDE_AUTH_MODAL });
  };
};
export const resetAuthError = () => {
  return (dispatch) => {
    dispatch({ type: actionTypes.RESET_AUTH_ERROR });
  };
};

export const signUpAction = (data) => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    try {
      var res = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      await res.updateProfile({
        displayName: `${data.firstName} ${data.lastName}`,
      });
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("nic", data.nic);
      localStorage.setItem("phone", data.phone);
      localStorage.setItem("email", data.email);
      localStorage.setItem("uid", res.uid);
      dispatch({ type: actionTypes.SIGN_UP_SUCCESS, res });
    } catch (err) {
      dispatch({ type: actionTypes.SIGN_UP_ERROR, err });
    }
  };
};
