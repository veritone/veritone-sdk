import React from 'react';
import { string, object, func } from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';
import get from 'lodash/get';

import Loader from './Loader';
import InfiniteSelect from './';
import { fetchSchemas } from './graphql';

const Schema = ({ name, majorVersion, organization }) => {
  if (majorVersion && organization) {
    return (
      <ListItemText primary={`${name} v${majorVersion}`} secondary={`by ${organization}`} />
    )
  } else {
    return (
      <ListItemText primary={name} />
    )
  }
}

Schema.propTypes = {
  name: string,
  majorVersion: string,
  organization: string,
}

export default class SelectSchemas extends React.Component {
  state = {
    data: [],
    firstOption: {
      name: 'All Schemas'
    },
    loading: false,
    selected: this.props.selected,
    offset: 0,
    lastSearch: '',
    done: false
  };

  getSelected() {
    if (!this.state.selected) {
      return this.state.firstOption;
    } else {
      return this.state.selected;
    }
  }

  reduceData = results => {
    const records = [];
    results.forEach(data => {
      const majorVersions = new Set();
      get(data, 'schemas.records').forEach(majorVersion => {
        majorVersions.add(majorVersion.majorVersion);
      });

      majorVersions.forEach(majorVersion =>
        records.push(
          {
            id: get(data, 'id'),
            name: get(data, 'name'),
            organization: get(data, 'organization.name'),
            majorVersion
          }
        )
      );
    });

    return records;
  };

  loadMoreData = async schemaName => {
    if (
      !this.state.loading &&
      (schemaName !== get(this.state.selected, 'name')
        || this.state.selected.name === this.state.firstOption.name
      )
    ) {
      this.setState({
        loading: true
      });
      let offset = schemaName === this.state.lastSearch ? this.state.offset : 0;
      let data = schemaName === this.state.lastSearch ? this.state.data : [];

      let results = await fetchSchemas({
        api: this.props.api,
        auth: this.props.auth,
        name: schemaName === this.state.firstOption.name ? '' : schemaName,
        offset
      });
      data = data.concat(this.reduceData(get(results, 'data.dataRegistries.records')));

      let count = get(results, 'data.dataRegistries.count');

      let nextOffset = offset + count;
      this.setState({
        data: data,
        offset: nextOffset,
        lastSearch: schemaName,
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
      return [this.state.firstOption].concat(data);
    } else {
      // filter out the selected item
      data = [...data].filter(
        x => {
          if (this.state.selected) {
            if (x.name !== get(this.state.selected, 'name')) {
              return true;
            }

            if (x.majorVersion !== get(this.state.selected, 'majorVersion')) {
              return true;
            }
            return false;
          } else {
            return true
          }
        }
      );
      // add the selected item to the top
      data.unshift(this.state.selected);
      // if all schemas is not selected, add it as the first option
      if (
        this.state.selected &&
        this.state.selected.name !== this.state.firstOption.name
      ) {
        data.splice(1, 0, this.state.firstOption);
      }
      return data;
    }
  }

  onSelect = data => {
    this.setState({
      data: [data],
      selected: data,
      offset: 0
    }, () => {
      if (this.props.onSelect) {
        this.props.onSelect(data);
      }
    });
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

  getLabel = (data) => {
    return data.name;
  }

  render() {
    return (
      <InfiniteSelect
        data={this.getData()}
        loadMoreData={this.loadMoreData}
        loading={this.state.loading}
        done={this.state.done}
        loader={<Loader />}
        selected={this.getSelected()}
        defaultSelected={this.getSelected().name === this.state.firstOption.name}
        onSelect={this.onSelect}
        resetSelect={this.resetSelect}
        display={
          schema => <Schema {...schema} />
        }
      />
    );
  }
}

SelectSchemas.propTypes = {
  selected: object,
  onSelect: func,
  api: string,
  auth: string,
}
