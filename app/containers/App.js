import React from "react";
import { hot } from "react-hot-loader";
import SignInPage from '../containers/SignInPage';
import SubmissionsList from '../components/SubmissionsList';
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
        <SubmissionsList />
      }
    </>
  );
}

export default hot(module)(App);
