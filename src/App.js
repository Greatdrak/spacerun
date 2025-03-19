import React from "react";
import { Provider } from 'react-redux';
import store from './store/store';
import Cockpit from "./components/Cockpit"; // Ensure this matches your folder structure
import "./styles.css";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Cockpit />
      </div>
    </Provider>
  );
}

export default App;
