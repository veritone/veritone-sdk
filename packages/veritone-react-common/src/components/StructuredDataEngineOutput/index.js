import React, { Component } from 'react';
import {
  arrayOf,
  bool,
  shape,
  number,
  string,
  objectOf,
  any,
  func
} from 'prop-types';
import { get } from 'lodash';
import classNames from 'classnames';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import EngineOutputHeader from '../EngineOutputHeader';
import SDOTable from '../SDOTable';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
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
    isExpandedMode: bool
  };

  static defaultProps = {
    data: []
  };

  state = {
    selectedSchemaId: null,
    flattenStructuredData: {},
    engineSchemaIds: []
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    this.processStructuredData(this.props.data);
  }

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.processStructuredData(nextProps.data);
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
              if (Array.isArray(structuredData[schemaId])) {
                structuredData[schemaId].forEach(structuredDataItem =>
                  flattenStructuredData[schemaId].push(structuredDataItem)
                );
              } else {
                flattenStructuredData[schemaId].push(structuredData[schemaId]);
              }
            });
          }
        });
      });

    const engineSchemaIds = Object.keys(flattenStructuredData);
    let selectedSchemaId = null;
    if (engineSchemaIds.length) {
      selectedSchemaId = engineSchemaIds[0];
    }

    this.setState({
      selectedSchemaId: selectedSchemaId,
      flattenStructuredData: flattenStructuredData,
      engineSchemaIds: engineSchemaIds
    });
  };

  getSchemaName = schemaId => {
    const schema = this.props.schemasById[schemaId];
    if (get(schema, 'dataRegistry.name')) {
      return get(schema, 'dataRegistry.name');
    }
    return schemaId;
  };

  onSchemaChange = evt => {
    this.setState({
      selectedSchemaId: evt.target.value
    });
  };

  handleEngineChange = engineId => {
    if (engineId === this.props.selectedEngineId) {
      return;
    }
    this.setState({
      selectedSchemaId: null,
      flattenStructuredData: {},
      engineSchemaIds: []
    });
    this.props.onEngineChange(engineId);
  };

  render() {
    const {
      className,
      engines,
      schemasById,
      selectedEngineId,
      onExpandClick,
      isExpandedMode
    } = this.props;

    const {
      selectedSchemaId,
      flattenStructuredData,
      engineSchemaIds
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
        {schemasById[selectedSchemaId] &&
          flattenStructuredData[selectedSchemaId] && (
            <SDOTable
              data={flattenStructuredData[selectedSchemaId]}
              schema={schemasById[selectedSchemaId].definition.properties}
            />
          )}
      </div>
    );
  }
}

export default StructuredDataEngineOutput;
