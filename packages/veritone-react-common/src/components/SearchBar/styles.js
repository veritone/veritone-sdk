import { darkBlack, lightBlack, grey5 } from '../../styles/modules/variables';

export default {
  searchBar: {
    width: '100%',
    height: 45,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
  },
  searchBarContainer: {
    marginLeft: '1em',
    marginRight: '1em',
  },
  supportedCategories: {
    display: 'flex',
    marginRight: '0.25em',
    marginLeft: '0.25em',
    height: 38,
    display: 'flex',
  },
  searchInput: {
    flexGrow: 1,
    cursor: 'text',
    paddingLeft: '0.25em',
    paddingRight: '0.25em',
    overflowX: 'hidden',
    overflowY: 'hidden',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  engineCategoryModal: {
    backgroundColor: '#f8f8f8 !important',
  },
  selectedPill: {
    backgroundColor: `${darkBlack} !important`,
  },
  selectedPillLabel: {
    paddingLeft: '0 !important',
    color: 'white !important',
  },
  engineCategoryPill: {
    width: '1.5em',
    height: '1.5em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    cursor: 'pointer',
    color: lightBlack,
    borderRadius: 4,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
  },
  engineCategoryIcon: {
    '& svg': {
      color: '#222 !important',
    },
  },
  searchPill: {
    height: '1.8em !important',
    marginRight: 3,
    marginLeft: 3,
    fontWeight: 'normal !important',
    backgroundColor: '#e4f2fd !important',
    '& $deleteIcon': {
      height: '65%',
    },
    '&:hover:not($highlighted)': {
      backgroundColor: '#eeeeee !important',
    },
    '&:focus:not($highlighted)': {
      backgroundColor: '#eeeeee !important',
    }
  },
  excludePill: {
    backgroundColor: '#ffcccc !important',
  },
  highlighted: {
    backgroundColor: 'rgba(0, 0, 0, 0.25) !important',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.35) !important',
    }
  },
  searchPillLabel: {
    paddingLeft: '0 !important',
  },
  modalAction: {
    marginTop: '0 !important',
    marginRight: '0 !important',
  },
  modalFooterActions: {
    height: 'auto !important',
  },
  joinOperator: {
    marginLeft: '0.5em',
    padding: '0 22px 2px 0 !important',
    lineHeight: 'calc(1em + 18px) !important',
    color: grey5,
    fontWeight: 'normal !important',
    height: '0.8em',
  },
  joinOperatorChip: {
    paddingLeft: '0.25em !important',
    paddingRight: '0.25em !important',
  },
  joinOperatorRootLeft: {
    borderLeft: '2px dashed lightgrey',
    width: 2,
    color: '#727272',
    height: 'calc(1em + 14px)',
    marginLeft: '0.25em',
  },
  joinOperatorRootRight: {
    borderRight: '2px dashed lightgrey',
  },
  joinOperatorDisabled: {
    color: grey5,
    alignItems: 'center',
    display: 'flex',
    fontWeight: 'normal !important',
  },
  cancelButton: {
    marginLeft: 'auto !important',
  },

  searchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  afterCursor: {
    minWidth: 25,
    border: 0,
    display: 'flex',
    height: '100%',
    flexGrow: '1',
    paddingLeft: '0.5em',
    alignItems: 'center',
  },
  searchGroup: {
    display: 'flex',
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
    paddingRight: '0.1em',
    paddingLeft: '0.1em',
    border: '1px dashed',
    borderRadius: '2em',
    flexWrap: 'nowrap',
  },
  resetButton: {
    width: '1.5em !important',
    fontSize: '1.5em !important',
  },
  searchGroupNestedLeft: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '0.1em',
    borderLeft: '1px dashed',
    borderRadius: '2em',
  },
  searchGroupNestedRight: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '0.1em',
    borderRight: '1px dashed',
    borderRadius: '2em',
  },
  removeUnderline: {
    content: 'none',
  },
  advancedButton: {
    display: 'flex',
    alignItems: 'center',
  },
  customBadge: {
    width: 20,
    height: 20,
    backgroundColor: '#F44336',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  deleteIcon: {},
  highlighted: {},
}
