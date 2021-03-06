import React from 'react';
import { useArenaStore } from '../stores/ArenaStore'
import { Alert } from '@material-ui/lab';
import Viewer, { Worker, defaultLayout } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import usePdfStatementStyles from '../styles/usePdfStatementStyles';

const PdfStatement = () => {
  const {
    currentProblemStatementPdfLink,
    pdfViewerSettings, setPdfViewerSettings,
    currentProblemLimitsAndIO,
  } = useArenaStore();

  const styles = usePdfStatementStyles();

  const renderToolbar = (toolbarSlot) => {
    if (toolbarSlot.currentPage !== pdfViewerSettings.pageIndex)
      setPdfViewerSettings({ ...pdfViewerSettings, pageIndex: toolbarSlot.currentPage });
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexGrow: 1,
            flexShrink: 1,
            justifyContent: 'center',
          }}
        >
          <div style={{ padding: '0 2px' }}>{toolbarSlot.previousPageButton}</div>
          <div style={{ padding: '0 2px' }}>{toolbarSlot.currentPage + 1} / {toolbarSlot.numPages}</div>
          <div style={{ padding: '0 2px' }}>{toolbarSlot.nextPageButton}</div>
          <div style={{ padding: '0 2px' }}>{toolbarSlot.zoomOutButton}</div>
          <div style={{ padding: '0 2px' }}>{toolbarSlot.zoomPopover}</div>
          <div style={{ padding: '0 2px' }}>{toolbarSlot.zoomInButton}</div>
          <div style={{ padding: '0 2px' }}>{toolbarSlot.fullScreenButton}</div>
          <div style={{ padding: '0 2px' }}>{toolbarSlot.searchPopover}</div>
        </div>
      </div>
    );
  };

  const minifiedlayout = (isSidebarOpened, container, main, toolbar, sidebar) => {
    return defaultLayout(
      false,
      container,
      main,
      toolbar(renderToolbar),
      sidebar
    );
  };

  return (
    <div className={styles.mainContainer}>
      {
        currentProblemLimitsAndIO &&
        <Alert severity="info" className={styles.infoBar}>
          IO info: <strong>{currentProblemLimitsAndIO.io}</strong>, Limits: <strong>{currentProblemLimitsAndIO.limits}</strong>
        </Alert>
      }
      <Worker workerUrl="./lib/pdfjs/build/pdf.worker.min.js">
        <div className={styles.pdfViewer}>
          <Viewer
            fileUrl={currentProblemStatementPdfLink}
            initialPage={pdfViewerSettings.pageIndex}
            defaultScale={pdfViewerSettings.scale}
            layout={minifiedlayout}
            onZoom={(_, scale) => setPdfViewerSettings({ ...pdfViewerSettings, scale })}
          />
        </div>
      </Worker>
    </div>
  );
}

export default PdfStatement;
