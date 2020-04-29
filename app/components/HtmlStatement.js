import React, { useEffect } from 'react';
import { useArenaStore } from '../stores/ArenaStore'

import '../styles/codeforces.css';

const HtmlStatement = () => {
  const { currentProblemStatementHTML } = useArenaStore();

  useEffect(() => {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: currentProblemStatementHTML }} />
  );
}

export default HtmlStatement;
