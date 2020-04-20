const { ipcRenderer } = window.require('electron');
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useArenaStore } from '../stores/ArenaStore'

import SplashScreen from '../components/SplashScreen';
import SubmitForm from '../components/SubmitForm';
import ProblemStatement from '../components/ProblemStatement';
import SubmissionsList from '../components/SubmissionsList';

import { Toolbar, Tabs, Tab, Drawer, Chip, TextField, Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

let drawerWidth = 575;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    width: '100%'
  },
  arenaContainer: {
    maxWidth: `calc(100% - ${drawerWidth + 25}px)`,
    height: '100%',
    padding: 0,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
  mainTab: {
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
  },
  toolbar: theme.mixins.toolbar,
  appbar: {
    background: 'white',
    width: '100%',
    padding: 0,

  },
  nameChip: {
    marginRight: 25,
    height: 50,
    borderRadius: 12,
    fontSize: '0.975rem',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    [theme.breakpoints.down('xs')]: {
      width: 300,
      flexShrink: 0,
    },
    background: '#eceff1',
    padding: '15px'
  },
  urlInput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  submit: {
    height: 45,
    margin: '20px 15px 15px',
  }
}));

const Arena = () => {
  const {
    currentProblemURL, setCurrentProblemURL,
    currentproblemName, setCurrentProblemName,
    availableSubmitLanguagesList, setAvailableSubmitLanguagesList,
    setCurrentProblemStatementHTML
  } = useArenaStore();

  const [currentTab, setCurrentTab] = useState(0);
  const [isWaitingForURLInput, setIsWaitingForURLInput] = useState(true);
  const [inputURL, setInputURL] = useState(currentProblemURL);
  const [inputFieldError, setInputFieldError] = useState(false);
  const [iserrorAlertActive, setIsErrorAlertActive] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');


  const classes = useStyles();

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
        setCurrentProblemStatementHTML(null);
        setCurrentProblemURL(inputURL);
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

  useEffect(() => {
    if (currentProblemURL !== '') {
      startProblem();
    }
  }, [currentProblemURL]);

  const requestProblemName = () => {
    ipcRenderer.send('get-problem-name', currentProblemURL);
    ipcRenderer.once('problem-name', (_, name) => {
      if (name)
        setCurrentProblemName(name);
    });
  }

  const requestProblemStatement = () => {
    ipcRenderer.send('get-problem-statement', currentProblemURL);
    ipcRenderer.once('problem-statement', (_, statement) => {
      if (!statement) {
        setErrorAlertMessage('Failed to retrieve statement!');
        setIsErrorAlertActive(true);
        return;
      }
      setCurrentProblemStatementHTML(statement);
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

  const startProblem = () => {
    requestProblemName();
    requestProblemStatement();
    requestAvailableSubmitLanguages();
  }

  return (
    <>
      <div className={classes.arenaContainer}>
        <Toolbar className={classes.toolbar}>
          {
            isWaitingForURLInput &&
            <div className={classes.urlInput}>
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
                className={classes.submit}
                onClick={handleSubmit}
              >
                Start
            </Button>
            </div>
          }
          {
            !isWaitingForURLInput &&
            <>
              <Chip label={currentproblemName} onDelete={e => setIsWaitingForURLInput(true)} color="primary" className={classes.nameChip} />
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
            <TabPanel currentTab={currentTab} tabIndex={0} className={classes.mainTab}>
              <ProblemStatement />
            </TabPanel>

            <TabPanel currentTab={currentTab} tabIndex={1} className={classes.mainTab}>
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
          paper: classes.drawer,
        }}
        anchor="right"
      >
        <SubmissionsList />
      </Drawer>
    </>
  );
}

const TabPanel = ({ children, currentTab, tabIndex, className }) => {
  return (
    <>
      {
        (currentTab === tabIndex) &&
        <div className={className}>{children}</div>
      }
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  currentTab: PropTypes.any.isRequired,
  tabIndex: PropTypes.any.isRequired,
};

export default Arena;
