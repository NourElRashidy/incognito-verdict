import React from 'react';
import { useArenaStore } from '../stores/ArenaStore'

import { makeStyles } from '@material-ui/core/styles';
import '../assets/codeforces.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    width: '90%',
  }
}));

const ProblemStatement = () => {
  const classes = useStyles();
  const {
    currentProblemStatementHTML
  } = useArenaStore();

  return (
    <div className={classes.paper}>
      {/* TODO: Add loading skeleton */}
      <div dangerouslySetInnerHTML={{ __html: currentProblemStatementHTML }} />
    </div>
  );
}

export default ProblemStatement;
