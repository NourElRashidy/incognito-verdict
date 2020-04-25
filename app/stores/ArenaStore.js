import React, { useState, useContext } from 'react';

const Context = React.createContext();

const DEFAULT_SUBMIT_LANGUAGE = '50'; // GNU G++14 6.4.0


export const ArenaProvider = ({ children }) => {
    const [userSubmissionsList, setUserSubmissionsList] = useState([]);
    const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState(0);
    const incrementPendingSubmissionsCount = () => setPendingSubmissionsCount(pendingSubmissionsCount + 1);

    const [currentProblemURL, setCurrentProblemURL] = useState('');
    const [currentproblemName, setCurrentProblemName] = useState('');
    const [currentProblemStatementType, setCurrentProblemStatementType] = useState(null);
    const [currentProblemStatementHTML, setCurrentProblemStatementHTML] = useState(null);
    const [currentProblemStatementPdfLink, setCurrentProblemStatementPdfLink] = useState(null);
    const [pdfViewerSettings, setPdfViewerSettings] = useState({ scale: 1.5, pageIndex: 0 });
    const resetPdfViewerSettings = () => setViewerPdfSettings({ scale: 1.5, pageIndex: 0 });
    const [availableSubmitLanguagesList, setAvailableSubmitLanguagesList] = useState([]);

    const [userSourceCode, setUserSourceCode] = useState('');
    const [selectedSubmitLanguage, setSelectedSubmitLanguage] = useState(DEFAULT_SUBMIT_LANGUAGE);
    const [isSubmitInProgress, setIsSubmitInProgress] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState(null);


    const value = {
        pendingSubmissionsCount, setPendingSubmissionsCount, incrementPendingSubmissionsCount,
        userSubmissionsList, setUserSubmissionsList,
        currentProblemURL, setCurrentProblemURL,
        currentProblemStatementType, setCurrentProblemStatementType,
        currentProblemStatementHTML, setCurrentProblemStatementHTML,
        currentProblemStatementPdfLink, setCurrentProblemStatementPdfLink,
        currentproblemName, setCurrentProblemName,
        pdfViewerSettings, setPdfViewerSettings, resetPdfViewerSettings,
        availableSubmitLanguagesList, setAvailableSubmitLanguagesList,
        userSourceCode, setUserSourceCode,
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

export const useArenaStore = () => useContext(Context);