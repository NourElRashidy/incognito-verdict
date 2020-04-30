const { ipcRenderer } = window.require('electron');
import React, { useState, useEffect } from 'react';
import { useArenaStore } from '../stores/ArenaStore';
import useWindowDimensions from '../hooks/useWindowDimensions';

import SplashScreen from '../components/SplashScreen';
import SubmitForm from '../components/SubmitForm';
import ProblemStatement from '../components/ProblemStatement';
import SubmissionsList from '../components/SubmissionsList';
import TabPanel from '../components/TabPanel';

import { Toolbar, Tabs, Tab, Drawer, Chip, TextField, Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useArenaStyles from '../styles/useArenaStyles';

const Arena = () => {
  const {
    currentProblemURL, setCurrentProblemURL,
    currentproblemName, setCurrentProblemName,
    setCurrentProblemLimitsAndIO,
    availableSubmitLanguagesList, setAvailableSubmitLanguagesList,
    setCurrentProblemStatementType,
    setCurrentProblemStatementHTML,
    setCurrentProblemStatementPdfLink,
    resetPdfViewerSettings,
  } = useArenaStore();

  const [currentTab, setCurrentTab] = useState(0);
  const [isWaitingForURLInput, setIsWaitingForURLInput] = useState(true);
  const [inputURL, setInputURL] = useState(currentProblemURL);
  const [inputFieldError, setInputFieldError] = useState(false);
  const [iserrorAlertActive, setIsErrorAlertActive] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const { windowWidth } = useWindowDimensions();
  const styles = useArenaStyles();

  const onKeyPress = (e) => {
    if (e.keyCode === 27 && e.target.name === 'problemURL' && currentProblemURL !== '') { // Escape key
      setIsWaitingForURLInput(false);
      e.preventDefault();
    }

    if (e.key === 'Enter' && e.target.name === 'problemURL') {
      handleSubmit();
      e.preventDefault();
    }
  }

  useEffect(() => {
    if (currentProblemURL !== '') {
      startProblem();
    }
  }, [currentProblemURL]);

  const handleSubmit = () => {
    if (inputURL === '') {
      setInputFieldError(true);
      return;
    }

    if (inputURL === currentProblemURL) {
      setIsWaitingForURLInput(false);
      return;
    }

    ipcRenderer.send('validate-problem-url', inputURL);
    ipcRenderer.once('validate-problem-url-feedback', (_, isValidURL) => {
      if (isValidURL) {
        setIsWaitingForURLInput(false);
        setInputFieldError(false);
        setCurrentProblemName('');
        setCurrentProblemStatementType(null);
        setCurrentProblemStatementHTML(null);
        setCurrentProblemStatementPdfLink(null);
        setCurrentProblemURL(inputURL);
        resetPdfViewerSettings();
      }
      else {
        setInputFieldError(true);
      }
    });
  }

  const handleAlertClose = (_, reason) => {
    if (reason !== 'clickaway') {
      setIsErrorAlertActive(false);
      setErrorAlertMessage('');
    }
  };

  const requestProblemName = () => {
    ipcRenderer.send('get-problem-name', currentProblemURL);
    ipcRenderer.once('problem-name', (_, name) => {
      if (name)
        setCurrentProblemName(name);
    });
  }

  const requestProblemStatement = () => {
    ipcRenderer.send('get-problem-statement', currentProblemURL);
    ipcRenderer.once('problem-statement', (_, statementInfo) => {
      if (!statementInfo) {
        setErrorAlertMessage('Failed to retrieve statement!');
        setIsErrorAlertActive(true);
        return;
      }
      else {
        if (statementInfo.type === 'HTML')
          setCurrentProblemStatementHTML(statementInfo.statement);
        else if (statementInfo.type === 'PDF')
          setCurrentProblemStatementPdfLink(statementInfo.englishPdfLink);
        setCurrentProblemStatementType(statementInfo.type);
      }
    });
  }

  const requestAvailableSubmitLanguages = () => {
    if (availableSubmitLanguagesList && availableSubmitLanguagesList.length)
      return;

    ipcRenderer.send('get-available-languages');
    ipcRenderer.once('available-languages', (_, langs) => {
      if (!langs) {
        setErrorAlertMessage('Failed to retrieve available submit languages!');
        setIsErrorAlertActive(true);
        return;
      }
      setAvailableSubmitLanguagesList(langs);
    });
  }

  const requestLimitsAndIO = () => {
    ipcRenderer.send('get-limits-io', currentProblemURL);
    ipcRenderer.once('limits-io', (_, limitsAndIO) => {
      if (!limitsAndIO) {
        setErrorAlertMessage('Failed to retrieve problem limits and io info. Please check on the problem submit page.');
        setIsErrorAlertActive(true);
        return;
      }
      setCurrentProblemLimitsAndIO(limitsAndIO);
    });
  }

  const startProblem = () => {
    requestProblemName();
    requestProblemStatement();
    requestAvailableSubmitLanguages();
    requestLimitsAndIO();
  }

  return (
    <>
      <div className={styles.arenaContainer}>
        <Toolbar className={styles.toolbar}>
          {
            isWaitingForURLInput &&
            <div className={styles.urlForm}>
              <TextField
                ref={input => {
                  if (input != null)
                    input.focus();
                }}
                variant="outlined"
                margin="normal"
                fullWidth
                required
                error={inputFieldError}
                helperText={inputFieldError && "Invalid codeforces problem url."}
                id="problem-url"
                label="Problem URL"
                name="problemURL"
                autoFocus
                onFocus={e => e.target.select()}
                value={inputURL}
                onChange={e => setInputURL(e.target.value)}
                onKeyDown={onKeyPress}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.submitButton}
                onClick={handleSubmit}
              >
                Start
            </Button>
            </div>
          }
          {
            !isWaitingForURLInput &&
            <>
              <Chip
                label={currentproblemName}
                color="primary"
                className={styles.problemName}
                onDelete={e => setIsWaitingForURLInput(true)}
              />
              <Tabs
                variant="scrollable"
                indicatorColor="primary"
                textColor="primary"
                value={currentTab}
                onChange={(e, index) => setCurrentTab(index)}
              >
                <Tab label="Problem Statement" />
                <Tab label="Submit" style={{ minWidth: 100 }} />
              </Tabs>
            </>
          }
        </Toolbar>
        {
          isWaitingForURLInput &&
          <SplashScreen />
        }
        {
          !isWaitingForURLInput &&
          <>
            <TabPanel currentTab={currentTab} tabIndex={0} className={styles.tabPanel}>
              <ProblemStatement />
            </TabPanel>

            <TabPanel currentTab={currentTab} tabIndex={1} className={styles.tabPanel}>
              <SubmitForm />
            </TabPanel>
          </>
        }
      </div>

      <Snackbar
        open={iserrorAlertActive}
        autoHideDuration={10000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleAlertClose} severity="error">{errorAlertMessage}</Alert>
      </Snackbar>

      <Drawer
        variant="permanent"
        classes={{
          paper: windowWidth >= 960 ? styles.sideDrawer : styles.bottomDrawer,
        }}
        anchor={windowWidth >= 960 ? 'right' : 'bottom'}
      >
        <SubmissionsList />
      </Drawer>
    </>
  );
}

export default Arena;
