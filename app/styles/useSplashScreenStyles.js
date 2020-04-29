import { makeStyles } from '@material-ui/core/styles';

const useSplashScreenStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  splashContainer: {
    alignSelf: 'center'
  },
  icon: {
    display: 'grid',
    backgroundSize: 'contain',
    backgroundImage: 'url(./data/assets/icons/logo.png)',
    backgroundRepeat: 'no-repeat',
    alignSelf: 'center',
    justifySelf: 'center',
    height: 250,
    margin: '3%',
  },
}));

export default useSplashScreenStyles;
