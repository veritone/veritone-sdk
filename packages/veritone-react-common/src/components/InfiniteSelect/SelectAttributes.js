import React from 'react';
import { func, object, string, any } from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';
import { get, includes } from 'lodash';

import Loader from './Loader';
// eslint-disable-next-line import/no-cycle
import { StructuredDataModal } from '../StructuredDataModal';
import InfiniteSelect from './index';
import { fetchProperties } from './graphql';

const SchemaAttributes = ({
  name,
  schemaName,
  organization,
  dataRegistryId,
  majorVersion,
}) => {
  if (dataRegistryId && majorVersion) {
    return <ListItemText primary={name} />;
  }
  return [
    <ListItemText
      key={name}
      primary={`${name}`}
      secondary={`${schemaName} v${majorVersion}`}
    />,
    <ListItemText
      key="\u00A0"
      primary={'\u00A0'}
      secondary={`by ${organization}`}
      secondaryTypographyProps={{
        style: {
          textAlign: 'right',
        },
      }}
    />,
  ];
};

export default class SelectAttributes extends React.Component {
  state = {
    data: [],
    loading: false,
    selected: this.props.selected,
    offset: 0,
    lastSearch: '',
    done: false,
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
          name:
            get(result, 'title') ||
            get(result, 'searchPath')
              .split('.')
              .pop(),
          field: get(result, 'searchPath'),
          schemaName: get(result, 'schema.dataRegistry.name'),
          organization: get(result, 'schema.dataRegistry.organization.name'),
          type: get(result, 'type'),
          majorVersion: get(result, 'schema.majorVersion'),
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
        loading: true,
      });
      const offset =
        propertyName === this.state.lastSearch ? this.state.offset : 0;
      let data = propertyName === this.state.lastSearch ? this.state.data : [];

      const results = await fetchProperties({
        api: this.props.api,
        auth: this.props.auth,
        name: propertyName,
        dataRegistryId: this.props.dataRegistryId,
        majorVersion: this.props.majorVersion,
        offset,
      });
      data = data.concat(
        this.reduceData(get(results, 'data.schemaProperties.records'))
      );
      const count = get(results, 'data.schemaProperties.count');

      const nextOffset = offset + count;
      this.setState({
        data,
        offset: nextOffset,
        lastSearch: propertyName,
        loading: false,
        done: count === 0,
      });
    }
    return true;
  };

  getData() {
    let { data } = this.state;

    // nothing selected, default to all schemas
    if (!this.state.selected) {
      return [].concat(data);
    }
    // filter out the selected item
    data = [...data].filter(
      x => x.name !== (this.state.selected && this.state.selected.name)
    );
    // add the selected item to the top
    data.unshift(this.state.selected);
    return data;
  }

  onSelect = data => {
    this.setState(
      {
        data: [data],
        selected: data,
        offset: 0,
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
      done: false,
    });
  };

  getLabel = data => data.name;

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

SelectAttributes.propTypes = {
  placeholder: string,
  selected: object,
  majorVersion: any,
  dataRegistryId: string,
  api: string,
  auth: string,
  onSelect: func,
};
