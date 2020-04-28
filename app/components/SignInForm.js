const { ipcRenderer, shell } = window.require('electron');
import React, { useState } from 'react';

import { Box, Button, Link, TextField, Typography, LinearProgress, Divider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(-10, 4),
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'fit-content'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

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
        All rights belong to their respective owners. Thank you Mike Mirzayanov for the great Codeforces platform. Images belong to ICPCNews.
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

  const classes = useStyles();

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
    <div className={classes.paper}>
      <Typography component="h1" variant="h5" color="textSecondary">
        sign in to codeforces
      </Typography>
      <div className={classes.form}>
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
          className={classes.submit}
          onClick={handleSubmit}
        >
          Sign In
        </Button>
        {
          errorMessage &&
          <Alert variant="outlined" severity="error">{errorMessage}</Alert>
        }
      </div>
      <Box mt={5} className={classes.disclaimer} >
        <Disclaimer />
      </Box>
    </div>
  );
}

export default SignInForm;
