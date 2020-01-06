import React from 'react';
import { connect } from 'react-redux';

import { withPropsOnChange } from 'recompose';
import { guid } from '../../shared/util';

import * as multipleEngineSelectionModule from '../../redux/modules/multipleEngineSelection';
import { InfinitePicker } from './InfinitePicker';
import SelectionInfoPanel, {
  SelectionInfoPanelWidget
} from './SelectionInfoPanel';
import {
  string,
  arrayOf,
  object,
  any,
  objectOf,
  bool,
  func,
  number
} from 'prop-types';

import widget from '../../shared/widget';

import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

const columns = [
  { name: 'Benchmark', width: '100px' },
  { name: 'Engine', width: '100%', paddingLeft: '40px' },
  { name: 'Build Version', width: '150px' }
];

@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@connect(
  (state, { id, selected, canSelectMore }) => {
    return {
      rows: multipleEngineSelectionModule.engines(state, id),
      loading: multipleEngineSelectionModule.loadingEngines(state, id),
      loadingFailed: multipleEngineSelectionModule.loadingEnginesFailed(
        state,
        id
      ),
      lastSearch: multipleEngineSelectionModule.lastSearch(state, id),
      selected:
        selected || multipleEngineSelectionModule.selectedEngines(state, id),
      hasMorePages: multipleEngineSelectionModule.hasMorePages(state, id),
      canSelectMore:
        canSelectMore || multipleEngineSelectionModule.canSelectMore(state, id)
    };
  },
  {
    fetchMore: multipleEngineSelectionModule.fetchEngines,
    toggleSelection: multipleEngineSelectionModule.toggleEngine
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps,
    ...dispatchProps
  })
)
class EnginePicker extends React.Component {
  static propTypes = {
    failedToLoadMessage: string,
    rows: arrayOf(object),
    loading: bool.isRequired,
    loadingFailed: bool.isRequired,
    lastSearch: string.isRequired,
    canSelectMore: bool,
    hasMorePages: bool.isRequired,
    selected: objectOf(any),
    id: string,
    fetchMore: func,
    toggleGlobally: bool,
    onlyShowMyEngines: bool,
    maxSelections: number,
    title: string
  };

  static defaultProps = {
    failedToLoadMessage: 'Failed to load',
    id: guid(),
    onlyShowMyEngines: false,
    title: 'Available Engines',
    toggleGlobally: false
  };

  fetchMore = ({ id, search = '' }) => {
    this.props.fetchMore({
      id,
      category: 'transcript',
      engineName: search,
      owned: this.props.onlyShowMyEngines
    });
  };

  renderRow = engine => [
    <TableCell key={columns[1].name} style={{ width: columns[1].width }}>
      <Typography variant="subtitle1">{engine.name}</Typography>
      <Typography variant="caption">
        {!this.props.onlyShowMyEngines && engine.ownerOrganization.name}
      </Typography>
    </TableCell>,
    <TableCell key={columns[2].name} style={{ width: columns[2].width }}>
      <Typography variant="subtitle1">{engine.deployedVersion}</Typography>
    </TableCell>
  ];

  render() {
    return (
      <InfinitePicker
        renderRow={this.renderRow}
        {...this.props}
        columns={columns}
        failedToLoadMessage={'Oops! Something went wrong.'}
        pickerTitle={this.props.title}
        fetchMore={this.fetchMore}
        maxSelections={this.props.maxSelections}
      />
    );
  }
}

const EnginePickerWidget = widget(EnginePicker);
export {
  EnginePicker as default,
  EnginePickerWidget,
  SelectionInfoPanel,
  SelectionInfoPanelWidget
};
