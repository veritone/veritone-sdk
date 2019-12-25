import { blue1, blue2 } from '../../styles/modules/variables';

export default {
  searchGroup: {
    display: 'inline-flex',
    padding: '0.2em',
    alignItems: 'center',
    border: `1px dashed ${blue1}`,
    borderRadius: '2em',
    flexWrap: 'nowrap',
  },
  searchGroupNestedLeft: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: '0.2em',
    borderLeft: `1px dashed ${blue2}`,
    borderRadius: '2em',
  },
  searchGroupNestedRight: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingRight: '0.2em',
    borderRight: `1px dashed ${blue2}`,
    borderRadius: '2em',
  },
  joiningOperator: {
    padding: '0 0.25em',
    display: 'inline-flex',
    alignItems: 'center',
  },
  searchBarContainer: {
    display: 'inline-flex',
    alignContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    display: 'inline-flex',
  },
}
