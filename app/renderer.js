const { ipcRenderer } = window.require('electron');
import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";

function render(signedIn) {
  ReactDOM.render(
    <App signedIn={signedIn} />,
    document.getElementById("root")
  );
}

// ipcRenderer Listeners
ipcRenderer.on('sign-in-successful', () => {
  render(true);
});

ipcRenderer.on('session-expired', () => {
  // TODO: add feedback for logout
  render(false);
});

// initialize
render(false);