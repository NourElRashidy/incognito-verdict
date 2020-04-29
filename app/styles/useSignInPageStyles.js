import { makeStyles } from '@material-ui/core/styles';

const useSignInPageStyles = makeStyles((theme) => ({
  pageContainer: {
    minHeight: '100vh',
    height: 'max-content',
  },
  sideImage: {
    backgroundImage: 'url(./data/assets/bg.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  iconContainer: {
    display: 'grid',
  },
  icon: {
    alignSelf: 'center',
    justifySelf: 'center',
    width: theme.spacing(60),
    height: theme.spacing(60),
    marginLeft: -30,
  },
}));

export default useSignInPageStyles;
