import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider, useSelector } from "react-redux";
import thunk from "redux-thunk";
import {
  reduxFirestore,
  getFirestore,
  createFirestoreInstance,
} from "redux-firestore";
import {
  ReactReduxFirebaseProvider,
  getFirebase,
  isLoaded,
} from "react-redux-firebase";
import firebaseConfig from "./utils/firebaseConfig";
import firebase from "firebase/app";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./state/rootReducer";
import LoadingContainer from "./pages/Loading/LoadingContainer";
import 'react-toastify/dist/ReactToastify.min.css';
import "./assets/output.css";
import "./assets/style.css";
import App from "./App";

function AuthIsLoaded({ children }) {
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  if (!isLoaded(auth)) {
    return <LoadingContainer />;
  } else {
    console.log(profile?.token?.token);
    return children;
  }
}

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirestore, getFirebase })),
    reduxFirestore(firebaseConfig)
  )
);

const profileSpecificProps = {
  userProfile: "users",
  useFirestoreForProfile: true,
  enableRedirectHandling: false,
  resetBeforeLogin: false,
  enableClaims: true,
};
const rrfProps = {
  firebase,
  config: firebaseConfig,
  config: profileSpecificProps,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <AuthIsLoaded>
        <App />
      </AuthIsLoaded>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
