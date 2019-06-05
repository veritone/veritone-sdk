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
  onMount: func,
  loadMore: func,
  finishedLoading: bool,
  loadingComponent: node,
  children: oneOfType([arrayOf(node), object]),
  classes: shape({ container: string })
}