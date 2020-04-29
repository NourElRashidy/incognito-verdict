import React from 'react';
import SignInForm from '../components/SignInForm';
import { Grid, Paper, Avatar, CssBaseline } from '@material-ui/core';

import useSignInPageStyles from '../styles/useSignInPageStyles';

const SignInPage = ({ isSessionExpired }) => {
  const styles = useSignInPageStyles();

  return (
    <Grid container component="main" className={styles.pageContainer}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={styles.sideImage} />
      <Grid item xs={12} sm={8} md={5} component={Paper} square>
        <div className={styles.iconContainer}>
          <Avatar src="./data/assets/icons/icon-transparent.png" className={styles.icon} />
        </div>
        <SignInForm isSessionExpired={isSessionExpired} />
      </Grid>
    </Grid>
  );
}

export default SignInPage;
