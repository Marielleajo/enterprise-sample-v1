// Import necessary libraries
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
import storage from "redux-persist/lib/storage";

// Import your reducers
import { applyMiddleware, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Reducers/Authentication";
import MenuSlice from "./Reducers/Menus";
import SystemSlice from "./Reducers/System";
import SideNavSlice from "./Reducers/SideNavData";
import UserMenuSlice from "./Reducers/UserMenu";
// Configure persistor with authReducer and local storage
const persistConfig = {
  key: "root",
  storage,
  stateReconciler: hardSet,
  version: 1,
  debug: true,
};

// Combine the reducers
let rootReducer = combineReducers({
  authentication: authReducer,
  menus: MenuSlice,
  userMenu: UserMenuSlice,
  system: SystemSlice,
  sideNav: SideNavSlice,
});

rootReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 })
  : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// Create persistor with store
const persistor = persistStore(store);

// Export store and persistor
export { persistor, store };
