import React from 'react';
import { randomIntInRange } from '../services/Utils'
import Skeleton from '@material-ui/lab/Skeleton';

const SkeletonStatement = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div>
        <Skeleton animation="wave" style={{ margin: '8px 42%', height: 50 }} />
        <Skeleton animation="wave" style={{ margin: '8px 40%' }} />
        <Skeleton animation="wave" style={{ margin: '8px 37%' }} />
        <Skeleton animation="wave" style={{ margin: '8px 41%' }} />
        <Skeleton animation="wave" style={{ margin: '8px 40%' }} />
      </div>
      <br />
      <br />
      {
        [...Array(25)].map((_, i) => {
          return (
            <>
              <Skeleton
                animation={false}
                height={20}
                width={i && (i % 5 === 0 || i % 13 === 0) ? `${randomIntInRange(15, 50)}%` : `${randomIntInRange(85, 95)}%`}
                style={{ marginBottom: i && (i % 5 === 0 || i % 13 === 0) ? 30 : 12 }}
              />
            </>
          );
        })
      }
    </div>
  );
}

export default SkeletonStatement;
