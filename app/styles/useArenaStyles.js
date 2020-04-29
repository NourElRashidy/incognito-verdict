import { makeStyles } from '@material-ui/core/styles';

const wideDrawerWidth = 575;
const narrowDrawerWidth = 275;
const bottomDrawerHeight = 331;

const useArenaStyles = makeStyles((theme) => ({
  arenaContainer: {
    [theme.breakpoints.between('xs', 'md')]: {
      maxWidth: `100%`,
      maxHeight: `calc(100% - ${bottomDrawerHeight + 20}px)`,
      overflowX: 'auto',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      maxWidth: `calc(100% - ${narrowDrawerWidth + 25}px)`,
      maxHeight: `100%`,
      height: `100%`,
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: `calc(100% - ${wideDrawerWidth + 25}px)`,
      maxHeight: `100%`,
      height: `100%`,
    },
    padding: 0,
  },
  toolbar: theme.mixins.toolbar,
  urlForm: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  submitButton: {
    height: 45,
    margin: '20px 15px 15px',
  },
  problemName: {
    marginRight: 25,
    height: 50,
    borderRadius: 12,
    fontSize: '0.975rem',
  },
  tabPanel: {
    [theme.breakpoints.between('xs', 'md')]: {
      height: 'calc(100% - 65px)',
    },
    [theme.breakpoints.up('md')]: {
      height: `100%`,
    },
    maxHeight: '-webkit-fill-available',
    display: 'flex',
    flexShrink: 1,
    justifyContent: 'center',
  },
  sideDrawer: {
    [theme.breakpoints.up('md')]: {
      width: wideDrawerWidth,
      flexShrink: 0,
    },
    [theme.breakpoints.down('md')]: {
      width: narrowDrawerWidth,
      flexShrink: 0,
    },
    background: '#eceff1',
    padding: 15
  },
  bottomDrawer: {
    height: bottomDrawerHeight,
    background: '#eceff1',
    display: 'flex',
    flexDirection: 'row',
    padding: 15
  },
}));

export default useArenaStyles;
