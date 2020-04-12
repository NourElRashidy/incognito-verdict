const { ipcRenderer } = window.require('electron');
import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import InputLabel from '@material-ui/core/InputLabel';

import { makeStyles } from '@material-ui/core/styles';
import '../assets/baseline.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(0, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

const DEFAULT_LANGUAGE = '50'; // GNU G++14 6.4.0

const SubmitForm = () => {
  var [sourceCode, setSourceCode] = useState('');
  var [problemURL, setProblemURL] = useState('');
  var [problemName, setProblemName] = useState('');
  var [availableLanguages, setAvailableLanguages] = useState([]);
  var [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);
  const [fieldError, setFieldError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    ipcRenderer.send('get-available-languages');
    ipcRenderer.on('available-languages', (_, langs) => {
      if (!langs) {
        alert('Failed to retrieve languages!');
        return;
      }
      setAvailableLanguages(langs);
    });
  }, []);

  useEffect(() => {
    setProblemName('');
    if (problemURL !== '')
      ipcRenderer.send('get-problem-name', problemURL);

    ipcRenderer.on('problem-name', (_, name) => {
      if (name)
        setProblemName(name);
    });
  }, [problemURL])

  const requestProblemName = () => {

  }

  const onEnterPress = (ev) => {
    if (ev.key === 'Enter') {
      handleSubmit();
      ev.preventDefault();
    }
  }

  const handleSubmit = () => {
    if (problemURL === '' || sourceCode === '' || selectedLanguage === '') {
      setFieldError(true);
      return;
    }
    setFieldError(false);
    setIsLoading(true);
    setErrorMessage(null);
    ipcRenderer.send('submit-problem', { problemURL, selectedLanguage, sourceCode });
    ipcRenderer.on('submit-feedback', (_, errMessage) => {
      if (errMessage)
        setErrorMessage(errMessage);

      setIsLoading(false);
      setSourceCode('');
      setSelectedLanguage(DEFAULT_LANGUAGE);
    });
  }

  return (
    <div className={classes.paper}>
      <div className={classes.form}>
        {
          problemName !== '' &&
          <Typography component="h1" variant="h5" color="textSecondary">{problemName}</Typography>
        }
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={fieldError && problemURL === ''}
          fullWidth
          id="problem-url"
          label="Problem URL"
          name="problemURL"
          autoFocus
          value={problemURL}
          onChange={e => setProblemURL(e.target.value)}
          onKeyPress={onEnterPress}
        />

        <InputLabel id="languages-select">Language</InputLabel>
        <Select
          labelId="languages-select"
          id="languages-select"
          value={selectedLanguage}
          fullWidth
          onChange={e => setSelectedLanguage(e.target.value)}
        >
          {
            availableLanguages.map(lang => {
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
          error={fieldError && sourceCode === ''}
          fullWidth
          id="source-code"
          label="Source Code"
          name="sourceCode"
          value={sourceCode}
          onChange={e => setSourceCode(e.target.value)}
        />
        {
          errorMessage &&
          <Typography component="h1" variant="subtitle2" color="error">
            {`*${errorMessage}`}
          </Typography>
        }
        {
          isLoading &&
          <LinearProgress variant="query" />
        }
        <Button
          type="submit"
          disabled={isLoading}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Submit
            </Button>
      </div>
    </div>
  );
}

export default SubmitForm;
