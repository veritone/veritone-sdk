import React from 'react';

import {
  arrayOf,
  any,
  objectOf,
  func
} from 'prop-types';

import { Table, Column } from 'components/DataTable';
import MenuColumn from 'components/DataTable/MenuColumn';
import Avatar from 'material-ui/Avatar';
import { format, distanceInWordsToNow } from 'date-fns';
import { capitalize } from 'lodash';

export default class SourceTileView extends React.Component {
  static propTypes = {
    sources: arrayOf(objectOf(any)).isRequired, // an array of source objects
    onSelectSource: func.isRequired,
    onSelectMenuItem: func
  };

  static defaultProps = {
    sources: []
  };

  getSourceData = (i) => {
    return this.props.sources[i];
  }

  renderThumbnail = (thumbnailUrl) => {
    return (
      <Avatar
        src={thumbnailUrl}
        style={{
          width: '30px',
          height: '30px'
        }}
      />
    )
  }

  renderCreatedDate = (date) => {
    return format(date, 'M/D/YYYY h:mm A');
  }

  renderUpdatedDate = (date) => {
    return capitalize(distanceInWordsToNow(date, { includeSeconds: true }));
  }

  render() {
    return (
      <Table
        rowGetter={this.getSourceData}
        rowCount={this.props.sources.length}
        rowHeight={48}
      >
        <Column
          dataKey='thumbnailUrl'
          header=''
          cellRenderer={this.renderThumbnail}
          width={30}
        />
        <Column
          dataKey='name'
          header='Source Name'
        />
        <Column
          dataKey='sourceType.name'
          header='Source Type'
        />
        <Column
          dataKey='createdDateTime'
          header='Created'
          cellRenderer={this.renderCreatedDate}
        />
        <Column
          dataKey='modifiedDateTime'
          header='Updated'
          cellRenderer={this.renderUpdatedDate}
          style={{
            fontStyle: 'italic',
            opacity: 0.54
          }}
        />
        <MenuColumn
          id="menu"
          dataKey='sourceType.sourceSchema.validActions'
          onSelectItem={this.props.onSelectMenuItem}
        />
      </Table>
    );
  };
}