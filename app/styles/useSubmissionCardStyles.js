import { makeStyles } from '@material-ui/core/styles';

export const useSubmissionCardStyles = makeStyles((theme) => ({
  submissionCard: {
    [theme.breakpoints.between('xs', 'lg')]: {
      width: 270
    },
    [theme.breakpoints.up('lg')]: {
      width: 565,
      height: 200,
      display: 'flex',
    },
    borderRadius: theme.spacing(1),
  },
  media: {
    [theme.breakpoints.between('xs', 'md')]: {
      height: 0,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      height: 160,
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
      minWidth: '50%',
      height: '100%',
    },
  },
  content: {
    [theme.breakpoints.between('xs', 'lg')]: {
      marginBottom: -15,
    },
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '90%',
      width: '100%',
    },
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
    [theme.breakpoints.between('xs', 'lg')]: {
      marginTop: 25,
    },
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  },
  date: {
    marginTop: theme.spacing(1)
  },
  infoBox: {
    [theme.breakpoints.between('xs', 'lg')]: {
      padding: 9,
    },
    [theme.breakpoints.up('lg')]: {
      padding: '16px 11px',
    },
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
  skeletonCard: {
    [theme.breakpoints.between('xs', 'lg')]: {
      width: 270,
    },
    [theme.breakpoints.up('lg')]: {
      width: 565,
      height: 200,
      display: 'flex',
    },
    borderRadius: theme.spacing(1),
  },
  media: {
    [theme.breakpoints.between('xs', 'md')]: {
      height: 0,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      height: 160,
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
      minWidth: '50%',
      height: '100%',
    },
  },
  content: {
    [theme.breakpoints.between('xs', 'lg')]: {
      height: 180,
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
      minWidth: '50%',
      height: '100%',
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
}));
