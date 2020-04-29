import { makeStyles } from '@material-ui/core/styles';

const useSignInFormStyles = makeStyles((theme) => ({
  signInContainer: {
    margin: theme.spacing(-10, 4),
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'fit-content'
  },
  formContainer: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submitButton: {
    margin: theme.spacing(3, 0, 2),
  }
}));

export default useSignInFormStyles;
