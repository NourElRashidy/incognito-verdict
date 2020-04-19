const { ipcRenderer } = window.require('electron');
import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";

function render(signedIn, isSessionExpired) {
  ReactDOM.render(
    <App signedIn={signedIn} isSessionExpired={isSessionExpired} />,
    document.getElementById("root")
  );
}

// ipcRenderer Listeners
ipcRenderer.on('sign-in-successful', () => {
  render(true);
});

ipcRenderer.on('session-expired', () => {
  render(false, true);
});

// initialize
render(false);