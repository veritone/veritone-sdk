import {
  func,
  number,
  node,
  arrayOf,
  oneOfType,
  object,
  string,
  shape,
  bool
} from 'prop-types';

export default {
  threshold: number,
  isLoading: bool,
  loadingComponent: node,
  triggerPagination: func.isRequired,
  children: oneOfType([arrayOf(node), object]),
  classes: shape({ container: string })
}