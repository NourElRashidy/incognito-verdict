const { ipcRenderer } = window.require('electron');
import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
