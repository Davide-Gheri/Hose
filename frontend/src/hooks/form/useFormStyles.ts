import { createStyles, makeStyles } from '@material-ui/core';

export const useFormStyles = makeStyles(theme => createStyles({
  form: {
    position: 'relative',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  deleteBtn: {
    marginRight: 'auto',
  },
  confirmButtonWrapper: {
    position: 'relative',
  },
  confirmButtonLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));
