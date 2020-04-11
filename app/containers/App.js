import React from "react";
import { hot } from "react-hot-loader";
import SignInPage from '../containers/SignInPage';
import '../assets/baseline.css';

function App({ signedIn }) {
  return (
    <>
      {
        !signedIn &&
        <SignInPage />
      }
      {
        signedIn &&
        'Hi, Incognito Verdict!'
      }
    </>
  );
}

export default hot(module)(App);
