import React from 'react';
import { Card } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import { useSkeletonCardStyles } from '../styles/useSubmissionCardStyles';

const SkeletonCard = ({ id }) => {
  const styles = useSkeletonCardStyles();

  return (
    <Card key={id} className={styles.skeletonCard}>
      <Skeleton animation="wave" variant="rect" className={styles.media} />
      {
        [...Array(5)].map(_ => (<Skeleton animation={false} height={15} width="95%" style={{ margin: 6 }} />))
      }
      <Skeleton animation="wave" height={15} width="85%" style={{ margin: 6 }} />
    </Card>
  );
}

export default SkeletonCard;
