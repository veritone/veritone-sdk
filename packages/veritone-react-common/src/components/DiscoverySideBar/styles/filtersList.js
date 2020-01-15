import { grey4, blue1 } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';

const body1Text = muiText('body1');
const captionText = muiText('caption');

export default {
  container: {
    width: '100%',
    padding: 15,
    borderBottom: `1px solid ${grey4}`,
  },
  headerContainer: {
    ...body1Text,
    display: 'flex',
    justifyContent: 'space-between',
  },
  clearLink: {
    ...captionText,
    textDecoration: 'none',
  },
  filtersContainer: {
    ...body1Text,
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 5,
  },
  clearButton: {
    padding: 4,
    backgroundColor: blue1,
    '& svg': {
      color: 'white',
      height: 10,
      width: 10,
    }
  },
  filterItemLink: {
    paddingLeft: 5,
  },
}
