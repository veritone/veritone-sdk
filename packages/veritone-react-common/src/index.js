import '../src/styles/global.scss';
import 'normalize.css';

export AppBar, { appBarHeight } from './components/AppBar';
export AppFooter, {
  appFooterHeightShort,
  appFooterHeightTall
} from './components/AppFooter';
export AppSwitcher from './components/AppSwitcher';
export Avatar from './components/Avatar';
export Chip from './components/Chip';
export DiscoverySideBar, { sectionsShape } from './components/DiscoverySideBar';
export FullScreenDialog from './components/FullScreenDialog';
export ProfileMenu from './components/ProfileMenu';
export RaisedTextField from './components/RaisedTextField';
export TopBar, { topBarHeight } from './components/TopBar';
export * as formComponents from './components/formComponents';
export {
  TranscriptSearchModal,
  TranscriptDisplay,
  TranscriptConditionGenerator
} from 'components/TranscriptSearchModal';
