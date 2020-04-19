const { ipcRenderer } = window.require('electron');
import React, { useState, useEffect } from 'react';
import { useArenaStore } from '../stores/ArenaStore'

import { FormControl, InputLabel, Select, MenuItem, TextField, Button, LinearProgress, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import '../assets/baseline.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  form: {
    width: '70%',
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));


const SubmitForm = () => {
  const classes = useStyles();

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
      // TODO: handle feedback for both error and success
      setIsSubmitInProgress(false);
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
    <div className={classes.paper}>
      <FormControl variant="filled" className={classes.form}>
        <InputLabel id="languages-select">Language</InputLabel>
        <Select
          labelId="languages-select"
          id="languages-select"
          value={selectedSubmitLanguage}
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
          submitErrorMessage &&
          <Typography component="h1" variant="subtitle2" color="error">
            {`*${submitErrorMessage}`}
          </Typography>
        }
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
          className={classes.submit}
          onClick={handleSubmit}
        >
          Submit
            </Button>
      </FormControl>
    </div >
  );
}

export default SubmitForm;
