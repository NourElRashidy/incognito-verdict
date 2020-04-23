const { ipcRenderer } = window.require('electron');
const { dateTimeFromEpoch } = require('../services/Utils');
import React, { useState, useEffect, useRef } from 'react';
import { useArenaStore } from '../stores/ArenaStore'

import SubmissionCard from './SubmissionCard';
import SkeletonCard from './SkeletonCard';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  }
}));

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const verdictMapping = (verdict) => {
  switch (verdict) {
    case undefined:
    case null:
    case 'TESTING':
      return {
        text: 'Pending',
        cardStyle: 'greyCard',
        textStyle: 'lightText'
      };
    case 'OK':
      return {
        text: 'Accepted',
        cardStyle: 'greenCard',
        textStyle: 'lightText'
      };
    case 'WRONG_ANSWER':
      return {
        text: 'Wrong Answer',
        cardStyle: 'redCard',
        textStyle: 'lightText'
      };
    case 'TIME_LIMIT_EXCEEDED':
      return {
        text: 'Time Limit Exceeded',
        cardStyle: 'blueCard',
        textStyle: 'lightText'
      };
    default:
      return {
        text: verdict.toLowerCase().split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        cardStyle: 'yellowCard',
        textStyle: 'darkText'
      };
  }
}

const SubmissionsList = () => {
  const {
    pendingSubmissionsCount, setPendingSubmissionsCount,
    userSubmissionsList, setUserSubmissionsList
  } = useArenaStore();

  const [imagesList, setImagesList] = useState([]);
  const classes = useStyles();

  const updateSubmissions = (subs) => {
    ipcRenderer.send('get-images-window', subs.length);
    ipcRenderer.once('images-window', (_, imgs) => {
      setImagesList(imgs);
      setUserSubmissionsList(subs);
    });
  }

  const requstSubmissions = () => {
    ipcRenderer.send('get-user-submissions');
    ipcRenderer.once('user-submissions', (_, subs) => {
      if (!subs) {
        // retry on failure
        if ((!userSubmissionsList || !userSubmissionsList.length()) && !pendingSubmissionsCount) // avoid making redundant requests
          requstSubmissions();
        return;
      }
      subs = subs.map(s => {
        return {
          id: s.id,
          problemName: `${s.problem.index} - ${s.problem.name}`,
          verdict: verdictMapping(s.verdict),
          timeConsumed: `${s.timeConsumedMillis}  ms`,
          memoryConsumed: `${s.memoryConsumedBytes / 1024}  KB`,
          dateTime: dateTimeFromEpoch(s.creationTimeSeconds)
        };
      });
      setPendingSubmissionsCount(subs.filter(s => s.verdict.text === 'Pending').length);
      updateSubmissions(subs);
    });
  }

  useEffect(() => {
    requstSubmissions();
  }, []);

  useInterval(() => {
    requstSubmissions();
  }, pendingSubmissionsCount ? 2000 : null);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {
          (!userSubmissionsList || !userSubmissionsList.length) &&
          [...Array(30)].map((_, i) => {
            return (
              <Grid item xs>
                <SkeletonCard key={i} />
              </Grid>
            );
          })
        }
        {
          userSubmissionsList.map((sub, i) => {
            return (
              <Grid item xs>
                <SubmissionCard submissionInfo={sub} imageUrl={imagesList[i]} />
              </Grid>
            );
          })
        }
      </Grid>
    </div>
  );
}

export default SubmissionsList;
