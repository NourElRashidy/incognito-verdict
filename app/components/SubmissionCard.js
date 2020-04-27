const { shell } = window.require('electron');
import React from 'react';
import { Card, CardMedia, CardActionArea, CardContent, Typography, Divider, Box } from '@material-ui/core';

import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 160,
  },
  datebox: {
    marginTop: theme.spacing(1)
  },
  box: {
    padding: 14,
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
  submissionCard: {
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

const SubmissionCard = ({ submissionInfo, imageUrl }) => {
  const classes = useStyles();

  return (
    <Card key={submissionInfo.id} className={classes.submissionCard}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={imageUrl}
          onClick={(e) => {
            e.preventDefault();
            shell.openExternal(imageUrl);
          }}
        />
      </CardActionArea>
      <CardContent>
        <Typography variant="subtitle1">{submissionInfo.problemName}</Typography>
        <Card className={cx(classes.verdictCard, classes[submissionInfo.verdict.cardStyle])}>
          <Typography variant="body2" align='center' className={cx(classes.verdictText, classes[submissionInfo.verdict.textStyle])}>
            {submissionInfo.verdict.text}
          </Typography>
        </Card>
      </CardContent>
      <Divider variant="middle" />
      <Box display={'block'} className={classes.datebox}>
        <Typography variant="body2" align='center'>{submissionInfo.dateTime}</Typography>
      </Box>
      <Box display={'flex'}>
        <Box p={2} flex={'auto'} className={classes.box}>
          <Typography variant="body2" align='center'>{submissionInfo.id}</Typography>
        </Box>
        <Box p={2} flex={'auto'} className={classes.box}>
          <Typography variant="body2" align='center'>{submissionInfo.timeConsumed}</Typography>
        </Box>
        <Box p={2} flex={'auto'} className={classes.box}>
          <Typography variant="body2" align='center'>{submissionInfo.memoryConsumed}</Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default SubmissionCard;
