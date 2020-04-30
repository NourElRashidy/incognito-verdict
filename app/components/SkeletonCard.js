import React from 'react';
import { Card } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import { useSkeletonCardStyles } from '../styles/useSkeletonCardStyles';

const SkeletonCard = ({ id }) => {
  const styles = useSkeletonCardStyles();

  return (
    <Card key={id} className={styles.skeletonCard}>
      <Skeleton animation="wave" variant="rect" className={styles.media} />
      <div className={styles.content}>

        {
          [...Array(5)].map(_ => (<Skeleton animation={false} height={15} width="95%" style={{ margin: '0 6px' }} />))
        }
        <Skeleton animation="wave" height={15} width="85%" style={{ margin: '0 6px 6px' }} />
      </div>
    </Card>
  );
}

export default SkeletonCard;
