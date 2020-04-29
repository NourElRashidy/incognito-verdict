import { makeStyles } from '@material-ui/core/styles';

export const useSubmissionCardStyles = makeStyles((theme) => ({
  submissionCard: {
    borderRadius: theme.spacing(1),
    width: 270,
  },
  media: {
    height: 160,
  },
  content: {

  },
  verdictCard: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: -8,
    marginTop: 4,
    verticalAlign: 'middle',
    width: '80%',
    height: 30
  },
  verdictPending: {
    backgroundColor: '#37474f',
    color: 'white',
  },
  verdictAccepted: {
    backgroundColor: 'green',
    color: 'white',
  },
  verdictWA: {
    backgroundColor: 'red',
    color: 'white',
  },
  verdictTLE: {
    backgroundColor: 'blue',
    color: 'white',
  },
  verdictOther: {
    backgroundColor: '#ffd600',
    color: 'black',
    fontWeight: '500',
  },
  verdictText: {
    paddingTop: 5
  },
  footer: {

  },
  date: {
    marginTop: theme.spacing(1)
  },
  infoBox: {
    padding: 14,
    position: 'relative',
    '&:not(:last-of-type)': {
      '&:after': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        height: '35%',
        width: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
      }
    }
  },
}));

export const useSkeletonCardStyles = makeStyles((theme) => ({
  media: {
    height: 160,
  },
  skeletonCard: {
    borderRadius: theme.spacing(1),
    width: 270,
    height: 325
  }
}));
