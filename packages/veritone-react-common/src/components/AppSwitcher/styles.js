import { muiText } from '../../styles/modules/muiTypography';

const bodyText = muiText('body1');
const captionText = muiText('caption');
const subheadText = muiText('subhead');

export default {
  appSwitcherTitle: {
    ...captionText,
    color: 'white',
    display: 'inline-block',
    margin: 0,
    opacity: 0.87,
  },
  popover: {
    marginTop: 18,
  },
  appListButton: {
    ...subheadText,
    minWidth: 220,
    lineHeight: '48px !important',
  },
  appListButtonIcon: {
    margin: 'auto 2px auto 0',
    verticalAlign: 'middle',
    width: 24,
    marginRight: 10,
    display: 'inline-block',
    fontSize: 20,
    textIndent: 1,
  },
  hasSvg: {
    width: 24,
    opacity: 0.54,
    marginRight: 10,
  },
  appListButtonNullstate: {
    ...bodyText,
    padding: '20px 0 !important',
    margin: '0 auto',
    width: 200,
    textAlign: 'center',
    cursor: 'default !important',
  },
  appListButtonErrorState: {
    ...bodyText,
    padding: '20px 0 !important',
    margin: '0 auto !important',
    whiteSpace: 'normal',
    width: 150,
    lineHeight: 'initial',
    textAlign: 'center',
    cursor: 'default',
  },
  '& > button': {
    marginTop: 20
  }
}
