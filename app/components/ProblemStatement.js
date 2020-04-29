import React from 'react';
import { useArenaStore } from '../stores/ArenaStore';
import SkeletonStatement from './SkeletonStatement';
import HtmlStatement from './HtmlStatement';
import PdfStatement from './PdfStatement';

import useProblemStatementStyles from '../styles/useProblemStatementStyles';

const ProblemStatement = () => {
  const styles = useProblemStatementStyles();
  const { currentProblemStatementType } = useArenaStore();

  return (
    <div className={styles.problemStatementContainer}>
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
