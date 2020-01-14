import React from 'react';

import Loader from './Loader';
import { StructuredDataModal } from '../StructuredDataModal';
import InfiniteSelect from './';
import { fetchProperties } from './graphql';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import cx from 'classnames';
import styles from './styles';

import { get, includes } from 'lodash';

const SchemaAttributes = ({
  name,
  schemaName,
  type,
  organization,
  dataRegistryId,
  majorVersion
}) => {
  if (dataRegistryId && majorVersion) {
    return <ListItemText primary={name} />;
  } else {
    return [
      <ListItemText
        primary={`${name}`}
        secondary={`${schemaName} v${majorVersion}`}
      />,
      <ListItemText
        primary={'\u00A0'}
        secondary={`by ${organization}`}
        secondaryTypographyProps={{
          style: {
            textAlign: 'right'
          }
        }}
      />
    ];
  }
};

export default class SelectAttributes extends React.Component {
  state = {
    data: [],
    loading: false,
    selected: this.props.selected,
    offset: 0,
    lastSearch: '',
    done: false
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.majorVersion !== prevProps.majorVersion ||
      this.props.dataRegistryId !== prevProps.dataRegistryId
    ) {
      this.resetSelect();
    }
  }

  getSelected() {
    return this.state.selected;
  }

  reduceData = results => {
    const data = [];
    results.forEach(result => {
      if (includes(StructuredDataModal.SUPPORTED_TYPES, get(result, 'type'))) {
        data.push({
          id: get(result, 'schema.id'),
          name: get(result, 'title') || get(result, 'searchPath').split(".").pop() ,
          field: get(result, 'searchPath'),
          schemaName: get(result, 'schema.dataRegistry.name'),
          organization: get(result, 'schema.dataRegistry.organization.name'),
          type: get(result, 'type'),
          majorVersion: get(result, 'schema.majorVersion')
        });
      }
    });

    return data;
  };

  loadMoreData = async propertyName => {
    if (
      !this.state.loading &&
      propertyName !== get(this.state.selected, 'path')
    ) {
      this.setState({
        loading: true
      });
      let offset =
        propertyName === this.state.lastSearch ? this.state.offset : 0;
      let data = propertyName === this.state.lastSearch ? this.state.data : [];

      let results = await fetchProperties({
        api: this.props.api,
        auth: this.props.auth,
        name: propertyName,
        dataRegistryId: this.props.dataRegistryId,
        majorVersion: this.props.majorVersion,
        offset
      });
      data = data.concat(
        this.reduceData(get(results, 'data.schemaProperties.records'))
      );
      let count = get(results, 'data.schemaProperties.count');

      let nextOffset = offset + count;
      this.setState({
        data: data,
        offset: nextOffset,
        lastSearch: propertyName,
        loading: false,
        done: count === 0
      });
    }
    return true;
  };

  getData() {
    let data = this.state.data;

    // nothing selected, default to all schemas
    if (!this.state.selected) {
      return [].concat(data);
    } else {
      // filter out the selected item
      data = [...data].filter(
        x => x.name !== (this.state.selected && this.state.selected.name)
      );
      // add the selected item to the top
      data.unshift(this.state.selected);
      return data;
    }
  }

  onSelect = data => {
    this.setState(
      {
        data: [data],
        selected: data,
        offset: 0
      },
      () => {
        if (this.props.onSelect) {
          this.props.onSelect(data);
        }
      }
    );
  };

  resetSelect = () => {
    this.setState({
      selected: null,
      data: [],
      loading: false,
      offset: 0,
      lastSearch: '',
      done: false
    });
  };

  getLabel = data => {
    return data.name;
  };

  render() {
    return (
      <InfiniteSelect
        data={this.getData()}
        loadMoreData={this.loadMoreData}
        loading={this.state.loading}
        done={this.state.done}
        loader={<Loader />}
        getSelectedItemText={this.getLabel}
        placeholder={this.props.placeholder}
        selected={this.getSelected()}
        onSelect={this.onSelect}
        resetSelect={this.resetSelect}
        noChoices={<ListItemText primary="No properties" />}
        display={schemaAttribute => (
          <SchemaAttributes
            dataRegistryId={this.props.dataRegistryId}
            majorVersion={this.props.majorVersion}
            {...schemaAttribute}
          />
        )}
      />
    );
  }
}
