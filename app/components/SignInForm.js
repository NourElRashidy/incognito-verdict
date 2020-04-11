const { ipcRenderer, shell } = window.require('electron');
import React, { useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

function Disclaimer() {
  const REPO_LINK = 'https://github.com/NourElRashidy/incognito-verdict';
  return (
    <>
      <Typography variant="subtitle1" color="textPrimary" align="center">
        {'Disclaimer'}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {`Your username and password are only used to login to codeforces.
        They are not sent to any remote servers other than codeforces.
        They are not stored anywhere not even on your local machine.`}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {'The source code is available, feel free to take a look.'}
      </Typography>
      <Typography variant="body2" align="center">
        <Link
          color="primary"
          underline="always"
          href={REPO_LINK}
          onClick={(event) => {
            event.preventDefault();
            shell.openExternal(event.target.href);
          }}
        >
          Source Code
      </Link>
      </Typography>

    </>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(-10, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

const SignInForm = () => {
  const [handleOrEmail, setHandleOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
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
    ipcRenderer.on('sign-in-failed', (_, message) => {
      setErrorMessage(message);
      setIsLoading(false);
    });
  }

  return (
    <div className={classes.paper}>
      {/* <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar> */}
      <Typography component="h1" variant="h5" color="textSecondary">
        Sign in to codeforces
      </Typography>
      <div className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={fieldError && handleOrEmail === ''}
          fullWidth
          id="handleOrEmail"
          label="handle/email"
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
          label="password"
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={onEnterPress}
        />
        {
          errorMessage &&
          <Typography component="h1" variant="subtitle2" color="error">
            {`*${errorMessage}`}
          </Typography>
        }
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

        <Box mt={5}>
          <Disclaimer />
        </Box>
      </div>
    </div>
  );
}

export default SignInForm;
