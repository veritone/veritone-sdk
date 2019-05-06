import { string, bool, func, node } from 'prop-types';

export default {
  id: string.isRequired,
  label: string,
  isHidden: bool,
  icon: node,
  onClick: func,
};
