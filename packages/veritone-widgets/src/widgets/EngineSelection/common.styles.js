import { lightBlack, faintBlack } from '../../styles/modules/variables';

export const avatar = (dimensions = 137) => ({
  position: 'relative',
  width: dimensions,
  minWidth: dimensions,
  maxWidth: dimensions,
  height: dimensions,
  border: `1px solid ${faintBlack}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& > i': {
    fontSize: 80,
    color: lightBlack,
  },
});

export default {
  row: {
    display: 'flex',
    padding: '19px 0 40px',
    minHeight: 177,
  },
  orgName: {
    marginBottom: 5,
    fontSize: 13,
    color: lightBlack,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    display: 'inline-flex',
    paddingTop: 3,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: '21px',
    marginBottom: 5,
  },
  primary: {
    flexGrow: 1,
    padding: '0 20px',
    display: 'inline-flex',
    flexDirection: 'column',
  },
  logo: {
    height: 16,
    alignItems: 'center',
    display: 'inline-flex',
    '& img': {
      height: 'auto',
    },
  },
  avatar: {
    display: 'inline-flex',
    flexDirection: 'column',
  },
  secondary: {
    display: 'inline-flex',
    flexDirection: 'column',
  },
  logos: {
    display: 'inline-flex',
  },
}
