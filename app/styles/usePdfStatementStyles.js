import { makeStyles } from '@material-ui/core/styles';

const usePdfStatementStyles = makeStyles((theme) => ({
  mainContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  infoBar: {
    marginBottom: 10,
  },
  pdfViewer: {
    width: '100%',
    height: '85vh',
  },
}));

export default usePdfStatementStyles;
