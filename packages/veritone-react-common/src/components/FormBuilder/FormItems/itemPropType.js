import { arrayOf, shape, string, number, oneOfType } from 'prop-types';

export default arrayOf(shape({
  id: oneOfType([string, number]),
  value: oneOfType([string, number])
}))
