import React from 'react';
import { useArenaStore } from '../stores/ArenaStore';
import SkeletonStatement from './SkeletonStatement';
import HtmlStatement from './HtmlStatement';
import PdfStatement from './PdfStatement';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '95%',
    margin: 15,
    display: 'flex'
  }
}));

const ProblemStatement = () => {
  const classes = useStyles();
  const { currentProblemStatementType } = useArenaStore();

  return (
    <div className={classes.paper}>
      {
        !currentProblemStatementType &&
        <SkeletonStatement />
      }
      {
        currentProblemStatementType === 'HTML' &&
        <HtmlStatement />
      }
      {
        currentProblemStatementType === 'PDF' &&
        <PdfStatement />
      }
    </div>
  );
}

export default ProblemStatement;