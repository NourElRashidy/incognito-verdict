import React from 'react';
import { useArenaStore } from '../stores/ArenaStore'

import '../assets/codeforces.css';

const HtmlStatement = () => {
  const { currentProblemStatementHTML } = useArenaStore();

  return (
    <div dangerouslySetInnerHTML={{ __html: currentProblemStatementHTML }} />
  );
}

export default HtmlStatement;