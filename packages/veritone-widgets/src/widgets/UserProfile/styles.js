import { grey1, lightBlack } from '../../styles/modules/variables';

export default {
  container: {
    paddingTop: 64, // clear appbar
    backgroundColor: grey1,
    height: '100%',
    width: '100%',
    minHeight: '700px',
    display: 'flex',
    justifyContent: 'center',
  },
  column: {
    height: '100%',
    maxWidth: '50rem',
    padding: '0 1rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  subheading: {
    color: `${lightBlack} !important`,
  },
  greeting: {
    marginTop: '13px !important',
  },
}
