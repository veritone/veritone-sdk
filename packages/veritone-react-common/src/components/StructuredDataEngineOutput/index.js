import React, { Component } from 'react';
import {
  arrayOf,
  bool,
  shape,
  number,
  string,
  objectOf,
  any,
  func,
  node
} from 'prop-types';
import { get, findIndex, isEqual } from 'lodash';
import classNames from 'classnames';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import EngineOutputHeader from '../EngineOutputHeader';
import SDOTable from '../SDOTable';
import styles from './styles.scss';

class StructuredDataEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        sourceEngineId: string,
        sourceEngineName: string,
        taskId: string,
        series: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            structuredData: objectOf(any)
          })
        )
      })
    ),
    engines: arrayOf(
      shape({
        sourceEngineId: string,
        sourceEngineName: string
      })
    ),
    schemasById: objectOf(any),
    selectedEngineId: string,
    onEngineChange: func,
    className: string,
    onExpandClick: func,
    isExpandedMode: bool,
    onSdoClick: func,
    mediaPlayerTimeMs: number,
    outputNullState: node
  };

  static defaultProps = {
    data: []
  };

  state = {
    selectedSchemaId: null,
    flattenStructuredData: {},
    engineSchemaIds: [],
    focusedSdoTableRow: null
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    this.processStructuredData(this.props.data);
  }

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data && !isEqual(nextProps.data, this.props.data)) {
      this.processStructuredData(nextProps.data);
      return;
    }
    if (this.props.mediaPlayerTimeMs != nextProps.mediaPlayerTimeMs) {
      this.setState(prevState => ({
        focusedSdoTableRow: this.getFocusedSdoDataRowIndex(
          prevState.selectedSchemaId,
          prevState.flattenStructuredData
        )
      }));
    }
  }

  processStructuredData = data => {
    const flattenStructuredData = {};
    data
      .filter(jsonData => get(jsonData, 'series.length', 0))
      .forEach(jsonData => {
        jsonData.series.forEach(seriesItem => {
          const structuredData = get(seriesItem, 'structuredData');
          if (structuredData) {
            const schemaIds = Object.keys(structuredData);
            schemaIds.forEach(schemaId => {
              if (!flattenStructuredData[schemaId]) {
                flattenStructuredData[schemaId] = [];
              }
              const structuredDataForSchema = Array.isArray(
                structuredData[schemaId]
              )
                ? structuredData[schemaId]
                : [structuredData[schemaId]];
              structuredDataForSchema.forEach(structuredDataItem => {
                flattenStructuredData[schemaId].push({
                  ...structuredDataItem,
                  startTimeMs: seriesItem.startTimeMs,
                  stopTimeMs: seriesItem.stopTimeMs
                });
              });
            });
          }
        });
      });

    const engineSchemaIds = Object.keys(flattenStructuredData);
    let selectedSchemaId = null;
    if (engineSchemaIds.length) {
      selectedSchemaId = engineSchemaIds[0];
    }

    const focusedSdoTableRow = this.getFocusedSdoDataRowIndex(
      selectedSchemaId,
      flattenStructuredData
    );

    this.setState({
      selectedSchemaId: selectedSchemaId,
      flattenStructuredData: flattenStructuredData,
      engineSchemaIds: engineSchemaIds,
      focusedSdoTableRow
    });
  };

  getFocusedSdoDataRowIndex = (selectedSchemaId, flattenStructuredData) => {
    if (!selectedSchemaId || !flattenStructuredData) {
      return null;
    }
    const { mediaPlayerTimeMs } = this.props;
    const structuredData = flattenStructuredData[selectedSchemaId];
    if (!get(structuredData, 'length')) {
      return null;
    }
    if (
      structuredData.some(
        item =>
          item.startTimeMs <= mediaPlayerTimeMs &&
          item.stopTimeMs >= mediaPlayerTimeMs
      )
    ) {
      const index = findIndex(
        structuredData,
        item =>
          item.startTimeMs <= mediaPlayerTimeMs &&
          item.stopTimeMs >= mediaPlayerTimeMs
      );
      return index;
    }
    return null;
  };

  getSchemaName = schemaId => {
    const schema = this.props.schemasById[schemaId];
    if (get(schema, 'dataRegistry.name')) {
      return get(schema, 'dataRegistry.name');
    }
    return schemaId;
  };

  onSchemaChange = evt => {
    const selectedSchemaId = evt.target.value;
    this.setState(prevState => ({
      selectedSchemaId,
      focusedSdoTableRow: this.getFocusedSdoDataRowIndex(
        selectedSchemaId,
        this.state.flattenStructuredData
      )
    }));
  };

  handleEngineChange = engineId => {
    if (engineId === this.props.selectedEngineId) {
      return;
    }
    this.setState({
      selectedSchemaId: null,
      flattenStructuredData: {},
      engineSchemaIds: [],
      focusedSdoTableRow: null
    });
    this.props.onEngineChange(engineId);
  };

  handleOnCellClick = rowNum => {
    const structuredData = this.state.flattenStructuredData[
      this.state.selectedSchemaId
    ];
    const structuredDataItem = structuredData[rowNum];
    this.props.onSdoClick(
      structuredDataItem.startTimeMs,
      structuredDataItem.stopTimeMs
    );
    this.setState({
      focusedSdoTableRow: rowNum
    });
  };

  render() {
    const {
      className,
      engines,
      schemasById,
      selectedEngineId,
      onExpandClick,
      isExpandedMode,
      outputNullState
    } = this.props;

    const {
      selectedSchemaId,
      flattenStructuredData,
      engineSchemaIds,
      focusedSdoTableRow
    } = this.state;

    return (
      <div className={classNames(styles.structuredDataOutputView, className)}>
        <EngineOutputHeader
          title="Structured Data"
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={this.handleEngineChange}
          onExpandClick={onExpandClick}
          hideExpandButton={isExpandedMode}
        >
          {schemasById[selectedSchemaId] && (
            <Select
              autoWidth
              value={selectedSchemaId}
              className={styles.schemaMenu}
              onChange={this.onSchemaChange}
              MenuProps={{
                anchorOrigin: {
                  horizontal: 'center',
                  vertical: 'bottom'
                },
                transformOrigin: {
                  horizontal: 'center'
                },
                getContentAnchorEl: null
              }}
            >
              {engineSchemaIds.map(schemaId => {
                return (
                  <MenuItem
                    key={`structured-data-schema-menu-item-${schemaId}`}
                    value={schemaId}
                    className={styles.schemaMenuItem}
                  >
                    {this.getSchemaName(schemaId)}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </EngineOutputHeader>
        {outputNullState ||
          (schemasById[selectedSchemaId] &&
            flattenStructuredData[selectedSchemaId] && (
              <SDOTable
                data={flattenStructuredData[selectedSchemaId]}
                schema={schemasById[selectedSchemaId].definition.properties}
                onCellClick={this.handleOnCellClick}
                focusedRow={focusedSdoTableRow}
              />
            ))}
      </div>
    );
  }
}

export default StructuredDataEngineOutput;
