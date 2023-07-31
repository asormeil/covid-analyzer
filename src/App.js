
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./store";
import "./App.css";
import Layout from "./layouts/index";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App" style={{ backgroundColor: "#1D5B79" }}>
          <Layout />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
