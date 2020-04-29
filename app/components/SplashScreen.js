import React from 'react';
import { Typography } from '@material-ui/core';

import useSplashScreenStyles from '../styles/useSplashScreenStyles';

const SplashScreen = () => {
  const styles = useSplashScreenStyles();

  return (
    <div className={styles.root}>
      <div className={styles.splashContainer}>
        <div className={styles.icon} />
        <Typography component="h1" variant="h5" color="textSecondary" style={{ textAlign: 'center', margin: '3%' }}>
          please start a problem to start using the arena
        </Typography>
      </div>
    </div>
  );
}

export default SplashScreen;
