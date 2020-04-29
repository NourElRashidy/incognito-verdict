const { ipcRenderer } = window.require('electron');
import React, { useState } from 'react';
import { useArenaStore } from '../stores/ArenaStore'

import { FormControl, InputLabel, Select, MenuItem, TextField, Button, LinearProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import useSubmitFormStyles from '../styles/useSubmitFormStyles';

const SubmitForm = () => {
  const styles = useSubmitFormStyles();

  const {
    currentProblemURL,
    userSourceCode, setUserSourceCode,
    availableSubmitLanguagesList,
    selectedSubmitLanguage, setSelectedSubmitLanguage,
    isSubmitInProgress, setIsSubmitInProgress,
    submitErrorMessage, setSubmitErrorMessage,
    incrementPendingSubmissionsCount,
  } = useArenaStore();

  const [inputFieldError, setInputFieldError] = useState(false);

  const handleSubmit = () => {
    if (userSourceCode === '' || selectedSubmitLanguage === '') {
      setInputFieldError(true);
      return;
    }
    setInputFieldError(false);
    setIsSubmitInProgress(true);
    setSubmitErrorMessage(null);

    ipcRenderer.send('session-health-check');
    ipcRenderer.send('submit-problem', { currentProblemURL, selectedSubmitLanguage, userSourceCode });
    ipcRenderer.once('submit-response', (_, response) => {
      setIsSubmitInProgress(false);
      ipcRenderer.send('shift-images-window');
      if (response.success) {
        setUserSourceCode('');
        incrementPendingSubmissionsCount();
      }
      else {
        setSubmitErrorMessage(response.message);
      }
    });
  }

  return (
    <FormControl variant="filled" className={styles.formContainer}>
      <InputLabel id="languages-select">Language</InputLabel>
      <Select
        labelId="languages-select"
        id="languages-select"
        value={selectedSubmitLanguage}
        className={styles.select}
        fullWidth
        onChange={e => setSelectedSubmitLanguage(e.target.value)}
      >
        {
          availableSubmitLanguagesList.map(lang => {
            return (<MenuItem value={lang.value}>{lang.name}</MenuItem>);
          })
        }
      </Select>

      <TextField
        variant="outlined"
        margin="normal"
        multiline
        rows="30"
        rowsMax="30"
        required
        error={inputFieldError && userSourceCode === ''}
        fullWidth
        id="source-code"
        label="Source Code"
        name="userSourceCode"
        value={userSourceCode}
        onChange={e => setUserSourceCode(e.target.value)}
      />
      {
        isSubmitInProgress &&
        <LinearProgress variant="query" />
      }
      <Button
        type="submit"
        disabled={isSubmitInProgress}
        fullWidth
        variant="contained"
        color="primary"
        className={styles.submitButton}
        onClick={handleSubmit}
      >
        Submit
            </Button>
      {
        submitErrorMessage &&
        <Alert variant="outlined" severity="error">{submitErrorMessage}</Alert>
      }
    </FormControl>
  );
}

export default SubmitForm;
