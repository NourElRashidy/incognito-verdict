import React from "react";
import { hot } from "react-hot-loader";
import { ArenaProvider } from '../stores/ArenaStore';
import SignInPage from '../containers/SignInPage';
import Arena from '../containers/Arena';

function App({ signedIn, isSessionExpired }) {
  return (
    <>
      {
        !signedIn &&
        <SignInPage isSessionExpired={isSessionExpired} />
      }
      {
        signedIn &&
        <ArenaProvider>
          <Arena />
        </ArenaProvider>
      }
    </>
  );
}

export default hot(module)(App);
