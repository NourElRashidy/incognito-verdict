const { ipcRenderer, shell } = window.require('electron');
import React, { useState } from 'react';

import { Box, Button, Link, TextField, Typography, LinearProgress, Divider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import useSignInFormStyles from '../styles/useSignInFormStyles';

const Disclaimer = () => {
  const REPO_LINK = 'https://github.com/NourElRashidy/incognito-verdict';
  return (
    <Alert variant="outlined" severity="info">
      <div style={{ color: '#546e7a' }} >
        Your username and password are only used to login to codeforces.
        They are not sent to any remote servers other than codeforces.
        They are not stored anywhere not even on your local machine. <br /> <br />
        The&nbsp;
        <Link
          color="primary"
          underline="always"
          href={REPO_LINK}
          onClick={(e) => {
            e.preventDefault();
            shell.openExternal(e.target.href);
          }}
        >source code</Link>
        &nbsp;is available, feel free to take a look.
      <Divider style={{ margin: 15 }} />
        All rights belong to their respective owners. Thank you Mike Mirzayanov for the great Codeforces platform. Images belong to ICPCNews & ACPC.
        </div>
    </Alert>
  );
}

const SignInForm = ({ isSessionExpired }) => {
  const [handleOrEmail, setHandleOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(isSessionExpired ? 'Session expired, please sign in again.' : null);
  const [isLoading, setIsLoading] = useState(false);

  const styles = useSignInFormStyles();

  const onEnterPress = (ev) => {
    if (ev.key === 'Enter') {
      handleSubmit();
      ev.preventDefault();
    }
  }

  const handleSubmit = () => {
    if (handleOrEmail === '' || password === '') {
      setFieldError(true);
      return;
    }
    setFieldError(false);
    setIsLoading(true);
    setErrorMessage(null);
    ipcRenderer.send('sign-in', { handleOrEmail, password });
    ipcRenderer.once('sign-in-failed', (_, message) => {
      setErrorMessage(message);
      setIsLoading(false);
    });
  }

  return (
    <div className={styles.signInContainer}>
      <Typography component="h1" variant="h5" color="textSecondary">
        sign in to codeforces
      </Typography>
      <div className={styles.formContainer}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={fieldError && handleOrEmail === ''}
          fullWidth
          id="handle-or-email"
          label="Handle/Email"
          name="handleOrEmail"
          autoFocus
          value={handleOrEmail}
          onChange={e => setHandleOrEmail(e.target.value)}
          onKeyPress={onEnterPress}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={fieldError && password === ''}
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={onEnterPress}
        />
        {
          isLoading &&
          <LinearProgress variant="query" />
        }
        <Button
          type="submit"
          disabled={isLoading}
          fullWidth
          variant="contained"
          color="primary"
          className={styles.submitButton}
          onClick={handleSubmit}
        >
          Sign In
        </Button>
        {
          errorMessage &&
          <Alert variant="outlined" severity="error">{errorMessage}</Alert>
        }
      </div>
      <Box mt={5} >
        <Disclaimer />
      </Box>
    </div>
  );
}

export default SignInForm;
