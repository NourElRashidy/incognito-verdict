import React from 'react';
import { Card } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 160,
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
  skeletonCard: {
    borderRadius: theme.spacing(1),
    width: 270,
    height: 325
  }
}));


const SkeletonCard = ({ id }) => {
  const classes = useStyles();

  return (
    <Card key={id} className={classes.skeletonCard}>
      <Skeleton animation="wave" variant="rect" className={classes.media} />
      {
        [...Array(5)].map(_ => (<Skeleton animation={false} height={15} width="95%" style={{ margin: 6 }} />))
      }
      <Skeleton animation="wave" height={15} width="85%" style={{ margin: 6 }} />
    </Card>
  );
}

export default SkeletonCard;
