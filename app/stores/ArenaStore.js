import React, { useState, useCallback } from 'react';

const Context = React.createContext();

const DEFAULT_SUBMIT_LANGUAGE = '50'; // GNU G++14 6.4.0


export const ArenaProvider = ({ children }) => {
    const [userSubmissionsList, setUserSubmissionsList] = useState([]);
    const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState(0);
    const incrementPendingSubmissionsCount = () => setPendingSubmissionsCount(pendingSubmissionsCount + 1);

    const [currentProblemURL, setCurrentProblemURL] = useState('');
    const [currentproblemName, setCurrentProblemName] = useState('');
    const [currentProblemStatementHTML, setCurrentProblemStatementHTML] = useState(null);
    const [availableSubmitLanguagesList, setAvailableSubmitLanguagesList] = useState([]);

    const [userSourceCode, setUserSourceCode] = useState('');
    const [selectedSubmitLanguage, setSelectedSubmitLanguage] = useState(DEFAULT_SUBMIT_LANGUAGE);
    const [isSubmitInProgress, setIsSubmitInProgress] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState(null);


    const value = {
        pendingSubmissionsCount, setPendingSubmissionsCount, incrementPendingSubmissionsCount,
        userSubmissionsList, setUserSubmissionsList,
        currentProblemURL, setCurrentProblemURL,
        currentProblemStatementHTML, setCurrentProblemStatementHTML,
        currentproblemName, setCurrentProblemName,
        userSourceCode, setUserSourceCode,
        availableSubmitLanguagesList, setAvailableSubmitLanguagesList,
        selectedSubmitLanguage, setSelectedSubmitLanguage,
        isSubmitInProgress, setIsSubmitInProgress,
        submitErrorMessage, setSubmitErrorMessage,
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export const useArenaStore = () => React.useContext(Context);