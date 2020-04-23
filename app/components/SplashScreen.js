import React from 'react';
import { Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  splash: {
    alignSelf: 'center'
  },
  icon: {
    display: 'grid',
    backgroundSize: 'contain',
    backgroundImage: 'url(./data/assets/icons/logo.png)',
    backgroundRepeat: 'no-repeat',
    alignSelf: 'center',
    justifySelf: 'center',
    height: 250,
    margin: '3%',
  },
}));


const SplashScreen = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.splash}>
        <div className={classes.icon} />
        <Typography component="h1" variant="h5" color="textSecondary" style={{ textAlign: 'center', margin: '3%' }}>
          please start a problem to start using the arena
        </Typography>
      </div>
    </div>
  );
}

export default SplashScreen;
