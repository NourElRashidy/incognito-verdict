const { ipcRenderer } = window.require('electron');
const { dateTimeFromEpoch } = require('../services/Utils');
import React, { useState, useEffect, useRef } from 'react';

import {
  Card, CardMedia, CardActionArea, CardContent,
  Typography, Divider,
  Grid, Box
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  media: {
    height: 160,
  },
  datebox: {
    marginTop: theme.spacing(1)
  },
  box: {
    position: 'relative',
    '&:not(:last-of-type)': {
      '&:after': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        height: '35%',
        width: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
      }
    }
  },
  emptyCard: {
    borderRadius: theme.spacing(1),
    width: 270,
    height: 325
  },
  problemCard: {
    borderRadius: theme.spacing(1),
    width: 270,
  },
  verdictCard: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: -8,
    marginTop: 4,
    verticalAlign: 'middle',
    width: '80%',
    height: 30
  },
  verdictText: {
    paddingTop: 5
  },
  greyCard: {
    backgroundColor: '#37474f',
  },
  yellowCard: {
    backgroundColor: '#ffd600',
  },
  greenCard: {
    backgroundColor: 'green',
  },
  blueCard: {
    backgroundColor: 'blue',
  },
  redCard: {
    backgroundColor: 'red',
  },
  lightText: {
    color: 'white',
  },
  darkText: {
    color: 'black',
    fontWeight: '500'
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
    case null || 'TESTING':
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
  const [submissions, setSubmissions] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const classes = useStyles();

  const requstSubmissions = () => {
    ipcRenderer.send('get-user-submissions');
    ipcRenderer.once('user-submissions', (_, subs) => {
      if (!subs) {
        if ((!submissions || !submissions.length()) && !pendingCount) // avoid making redundant requests
          requstSubmissions();
        return;
      }
      setPendingCount(subs.filter(s => !s.verdict).length);
      setSubmissions(subs.map(s => {
        return {
          id: s.id,
          problemName: `${s.problem.index} - ${s.problem.name}`,
          verdict: verdictMapping(s.verdict),
          timeConsumed: `${s.timeConsumedMillis}  ms`,
          memoryConsumed: `${s.memoryConsumedBytes / 1024}  KB`,
          dateTime: dateTimeFromEpoch(s.creationTimeSeconds)
        };
      }));
    });
  }

  useEffect(() => {
    requstSubmissions();
  }, []);

  useInterval(() => {
    requstSubmissions();
  }, pendingCount ? 1000 : null);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {
          (!submissions || !submissions.length) &&
          [...Array(50)].map((_, i) => {
            return (
              <SkeletonCard key={i} />
            );
          })
        }
        {
          submissions.map(s => {
            return (
              <Grid item xs>
                <Card key={s.id} className={classes.problemCard}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image="./data/assets/bg.jpg"
                    />
                  </CardActionArea>
                  <CardContent>
                    <Typography variant="subtitle1">{s.problemName}</Typography>
                    <Card className={cx(classes.verdictCard, classes[s.verdict.cardStyle])}>
                      <Typography variant="body2" align='center' className={cx(classes.verdictText, classes[s.verdict.textStyle])}>
                        {s.verdict.text}
                      </Typography>
                    </Card>
                  </CardContent>
                  <Divider variant="middle" />
                  <Box display={'block'} className={classes.datebox}>
                    <Typography variant="body2" align='center'>{s.dateTime}</Typography>
                  </Box>
                  <Box display={'flex'}>
                    <Box p={2} flex={'auto'} className={classes.box}>
                      <Typography variant="body2" align='center'>{s.id}</Typography>
                    </Box>
                    <Box p={2} flex={'auto'} className={classes.box}>
                      <Typography variant="body2" align='center'>{s.timeConsumed}</Typography>
                    </Box>
                    <Box p={2} flex={'auto'} className={classes.box}>
                      <Typography variant="body2" align='center'>{s.memoryConsumed}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })
        }
      </Grid>
    </div>
  );
}

const SkeletonCard = ({ id }) => {
  const classes = useStyles();

  return (
    <Grid item xs>
      <Card key={id} className={classes.emptyCard}>
        <Skeleton animation="wave" variant="rect" className={classes.media} />
        {
          [...Array(5)].map(_ => (<Skeleton animation={false} height={15} width="95%" style={{ margin: 6 }} />))
        }
        <Skeleton animation="wave" height={15} width="85%" style={{ margin: 6 }} />
      </Card>
    </Grid>
  );
}

export default SubmissionsList;
