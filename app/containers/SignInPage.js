import React from 'react';
import SignInForm from '../components/SignInForm';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
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
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  avatar: {
    alignSelf: 'center',
    justifySelf: 'center',
    width: theme.spacing(50),
    height: theme.spacing(50)
  },
  form: {
    paddingTop: '-50px'
  }
}));

const SignInPage = () => {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.icon}>
          <Avatar alt="Remy Sharp" src="./data/assets/icons/icon-transparent.png" className={classes.avatar} />
        </div>
        <SignInForm />
      </Grid>
    </Grid>
  );
}

export default SignInPage;
