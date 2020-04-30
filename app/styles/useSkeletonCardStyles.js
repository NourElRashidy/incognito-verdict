import { makeStyles } from '@material-ui/core/styles';

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
