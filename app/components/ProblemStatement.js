import React from 'react';
import { useArenaStore } from '../stores/ArenaStore'
import { randomIntInRange } from '../services/Utils'

import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import '../assets/codeforces.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    width: '90%',
  }
}));

const SkeletonStatement = () => {
  return (
    <>
      <Skeleton animation="wave" style={{ margin: '8px 42%', height: 50 }} />
      <Skeleton animation="wave" style={{ margin: '8px 40%' }} />
      <Skeleton animation="wave" style={{ margin: '8px 37%' }} />
      <Skeleton animation="wave" style={{ margin: '8px 41%' }} />
      <Skeleton animation="wave" style={{ margin: '8px 40%' }} />
      <br />
      <br />
      {
        [...Array(30)].map((_, i) => {
          return (
            <>
              <Skeleton
                animation={false}
                height={15}
                width={i && (i % 5 === 0 || i % 13 === 0) ? `${randomIntInRange(15, 50)}%` : `${randomIntInRange(85, 95)}%`}
                style={{ marginBottom: '12px' }}
              />
            </>
          );
        })
      }
    </>
  );
}

const ProblemStatement = () => {
  const classes = useStyles();
  const {
    currentProblemStatementHTML
  } = useArenaStore();

  return (
    <div className={classes.paper}>
      {
        !currentProblemStatementHTML &&
        <SkeletonStatement />
      }
      <div dangerouslySetInnerHTML={{ __html: currentProblemStatementHTML }} />
    </div>
  );
}

export default ProblemStatement;
