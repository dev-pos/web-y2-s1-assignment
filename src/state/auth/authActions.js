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
export const showHarvestModal = () => {
  return (dispatch) => {
    dispatch({ type: actionTypes.SHOW_HARVEST_MODAL });
  };
};
export const hideHarvestModal = () => {
  return (dispatch) => {
    dispatch({ type: actionTypes.HIDE_HARVEST_MODAL });
  };
};
export const resetAuthError = () => {
  return (dispatch) => {
    dispatch({ type: actionTypes.RESET_AUTH_ERROR });
  };
};

export const signOutAction = () => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    try {
      var res = await firebase.auth().signOut();
      dispatch({ type: actionTypes.SIGN_OUT_SUCCESS, res });
    } catch (err) {
      dispatch({ type: actionTypes.SIGN_OUT_ERROR, err });
    }
  };
};
export const signUpAction = (data) => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    try {
      var res = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      // await res.updateProfile({
      //   displayName: `${data.firstName} ${data.lastName}`,
      // });
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

export const completeProfileAction = (data) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    let state = getState();
    let userId = state?.firebase?.auth?.uid;
    var storageRef = firebase.storage().ref();
    var photoRef = storageRef.child(`/users/${userId}/profilePicture.png`);
    await photoRef.put(data.photo);
    let photoUrl = await photoRef.getDownloadURL();
    try {
      await firestore.collection("users").doc(userId).set({
        firstName: data.firstName,
        lastName: data.lastName,
        nic: data.nic,
        phone: data.phone,
        photo: photoUrl,
        profileCompleted: true,
      });

      dispatch({ type: actionTypes.PROFILE_COMPLETE_SUCCESS, res: "" });
    } catch (err) {
      dispatch({ type: actionTypes.PROFILE_COMPLETE_ERROR, err });
    }
  };
};

export const sendMessage = (data) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    let state = getState();
    let userId = state?.firebase?.auth?.uid;

    try {
      await firestore
        .collection("harvests")
        .doc(data.harvestId)
        .collection("messages")
        .add({
          body: data.body,
          created_at: new Date(),
          sentByOwner: data.sentByOwner,
          user: firestore.doc("/users/" + userId),
        });

      dispatch({ type: actionTypes.SEND_MESSAGE_SUCCESS, res: "" });
    } catch (err) {
      dispatch({ type: actionTypes.SEND_MESSAGE_ERROR, err });
    }
  };
};
export const updateRating = (data) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    let state = getState();
    let userId = state?.firebase?.auth?.uid;

    try {
      await firestore.collection("harvests").doc(data.harvestId).update({
        rating: data.rating,
      });

      dispatch({ type: actionTypes.RATE_HARVEST_SUCCESS, res: "" });
    } catch (err) {
      dispatch({ type: actionTypes.RATE_HARVEST_ERROR, err });
    }
  };
};
export const editHarvest = ({ key, value, harvestId }) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    let state = getState();
    let userId = state?.firebase?.auth?.uid;

    try {
      await firestore
        .collection("harvests")
        .doc(harvestId)
        .update({
          [key]: value,
        });

      dispatch({ type: actionTypes.RATE_HARVEST_SUCCESS, res: "" });
    } catch (err) {
      dispatch({ type: actionTypes.RATE_HARVEST_ERROR, err });
    }
  };
};
export const setRole = ({ value, userId }) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    let state = getState();

    try {
      await firestore.collection("users").doc(userId).update({
        role: value,
      });

      dispatch({ type: actionTypes.RATE_HARVEST_SUCCESS, res: "" });
    } catch (err) {
      dispatch({ type: actionTypes.RATE_HARVEST_ERROR, err });
    }
  };
};
export const addImage = ({ image, harvestId }) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    let state = getState();
    let userId = state?.firebase?.auth?.uid;
    const timeStamp = Date.now();
    try {
      var storageRef = firebase.storage().ref();
      var photoRef = storageRef.child(
        `/users/${timeStamp}/harvest_${harvestId}.png`
      );
      await photoRef.put(image);
      let photoUrl = await photoRef.getDownloadURL();

      await firestore
        .collection("harvests")
        .doc(harvestId)
        .update({
          images: firestore.FieldValue.arrayUnion(photoUrl),
        });

      dispatch({ type: actionTypes.EDIT_HARVEST_SUCCESS, res: "" });
    } catch (err) {
      console.log(err);
      dispatch({ type: actionTypes.EDIT_HARVEST_ERROR, err });
    }
  };
};
export const removeImage = ({ imageUrl, harvestId }) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    try {
      await firestore
        .collection("harvests")
        .doc(harvestId)
        .update({
          images: firestore.FieldValue.arrayRemove(imageUrl),
        });

      dispatch({ type: actionTypes.EDIT_HARVEST_SUCCESS, res: "" });
    } catch (err) {
      console.log(err);
      dispatch({ type: actionTypes.EDIT_HARVEST_ERROR, err });
    }
  };
};
export const deleteHarvest = ({ harvestId }) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    try {
      await firestore.collection("harvests").doc(harvestId).delete();

      dispatch({ type: actionTypes.DELETE_HARVEST_SUCCESS, res: "" });
    } catch (err) {
      console.log(err);
      dispatch({ type: actionTypes.DELETE_HARVEST_ERROR, err });
    }
  };
};

export const addHarvest = (data) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    let state = getState();
    const timeStamp = Date.now();

    let userId = state?.firebase?.auth?.uid;
    var photoRefs = [];
    var photoUrls = [];

    var storageRef = firebase.storage().ref();

    for (let i = 0; i < data.files.length; i++) {
      photoRefs.push(storageRef.child(`/users/${timeStamp}/harvest_${i}.png`));
    }
    for (let i = 0; i < data.files.length; i++) {
      await photoRefs[i].put(data.files[i]);
    }
    for (let i = 0; i < data.files.length; i++) {
      let url = await photoRefs[i].getDownloadURL();
      photoUrls.push(url);
    }

    try {
      await firestore.collection("harvests").add({
        address: {
          city: data.selectedDistrict,
          province: data.selectedProvince,
          street: data.street,
        },
        categories: [firestore.doc("/categories/" + data.categoryId)],
        created_at: new Date(),
        description: data.description,
        farmer: firestore.doc("/users/" + userId),
        images: photoUrls,
        location: new firestore.GeoPoint(data.latitude, data.longitude),
        mapIconType: data.iconType,
        title: data.title,
      });

      dispatch({ type: actionTypes.ADD_HARVEST_SUCCESS, res: "" });
    } catch (err) {
      console.log(err);
      dispatch({ type: actionTypes.ADD_HARVEST_ERROR, err });
    }
  };
};
