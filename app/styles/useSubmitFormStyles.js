import { makeStyles } from '@material-ui/core/styles';

const useSubmitFormStyles = makeStyles((theme) => ({
  formContainer: {
    width: '70%',
    marginTop: theme.spacing(4),
  },
  select: {
    minHeight: 45,
  },
  submitButton: {
    margin: theme.spacing(3, 0, 2),
    minHeight: 35,
  }
}));

export default useSubmitFormStyles;
