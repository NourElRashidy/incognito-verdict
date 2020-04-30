const { shell } = window.require('electron');
import React from 'react';
import { Card, CardMedia, CardActionArea, CardContent, Typography, Divider, Box } from '@material-ui/core';

import cx from 'clsx';
import { useSubmissionCardStyles } from '../styles/useSubmissionCardStyles';

const SubmissionCard = ({ submissionInfo, imageUrl }) => {
  const styles = useSubmissionCardStyles();

  return (
    <Card key={submissionInfo.id} className={styles.submissionCard}>
      <CardActionArea className={styles.media}>
        <CardMedia
          style={{ height: '100%' }}
          image={imageUrl}
          onClick={(e) => {
            e.preventDefault();
            shell.openExternal(imageUrl);
          }}
        />
      </CardActionArea>
      <CardContent className={styles.content}>
        <Typography variant="subtitle1">{submissionInfo.problemName}</Typography>
        <Card className={cx(styles.verdictCard, styles[submissionInfo.verdict.cardStyle])}>
          <Typography variant="body2" align='center' className={styles.verdictText}>
            {submissionInfo.verdict.text}
          </Typography>
        </Card>
        <div className={styles.footer}>
          <Divider variant="middle" />
          <Box display={'block'} className={styles.date}>
            <Typography variant="body2" align='center'>{submissionInfo.dateTime}</Typography>
          </Box>
          <Box display={'flex'}>
            <Box p={2} flex={'auto'} className={styles.infoBox}>
              <Typography variant="body2" align='center'>{submissionInfo.id}</Typography>
            </Box>
            <Box p={2} flex={'auto'} className={styles.infoBox}>
              <Typography variant="body2" align='center'>{submissionInfo.timeConsumed}</Typography>
            </Box>
            <Box p={2} flex={'auto'} className={styles.infoBox}>
              <Typography variant="body2" align='center'>{submissionInfo.memoryConsumed}</Typography>
            </Box>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
}

export default SubmissionCard;
