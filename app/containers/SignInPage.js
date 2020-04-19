import React from 'react';
import SignInForm from '../components/SignInForm';
import { Grid, Paper, Avatar, CssBaseline } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  icon: {
    display: 'grid',
  },
  image: {
    backgroundImage: 'url(./data/assets/bg.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  avatar: {
    alignSelf: 'center',
    justifySelf: 'center',
    width: theme.spacing(50),
    height: theme.spacing(50),
    marginLeft: -30
  },
  form: {
    paddingTop: '-50px'
  }
}));

const SignInPage = ({ isSessionExpired }) => {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.icon}>
          <Avatar alt="Remy Sharp" src="./data/assets/icons/icon-transparent.png" className={classes.avatar} />
        </div>
        <SignInForm isSessionExpired={isSessionExpired} />
      </Grid>
    </Grid>
  );
}

export default SignInPage;
