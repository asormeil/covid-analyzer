import { createStore, applyMiddleware, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import covidReducer from "../reducers/covid";
import moralityReducer from "../reducers/morality";
import baselineReducer from "../reducers/baselines";

const rootReducer = combineReducers({
  covidData: covidReducer,
  moralityData: moralityReducer,
  baselineData: baselineReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["baselineData", "baselineGraphsData"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export { store, persistor };
