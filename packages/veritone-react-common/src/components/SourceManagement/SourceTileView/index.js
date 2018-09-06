import React from 'react';

import { arrayOf, any, objectOf, func, bool } from 'prop-types';

import { Table, PaginatedTable, Column } from 'components/DataTable';
import MenuColumn from 'components/DataTable/MenuColumn';
import Avatar from '@material-ui/core/Avatar';
import { format, distanceInWordsToNow } from 'date-fns';
import { capitalize, omit, noop } from 'lodash';

import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import SharedIcon from '@material-ui/icons/People';
import ButtonWrapper from '../../share-components/buttons/ButtonWrapper';
import styles from './styles.scss';

export default class SourceTileView extends React.Component {
  static propTypes = {
    sources: arrayOf(objectOf(any)).isRequired, // an array of source objects
    onSelectSource: func,
    onSelectMenuItem: func,
    onSelectLivestream: func,
    paginate: bool,
    onFetchData: func
  };

  static defaultProps = {
    onSelectMenuItem: noop,
    onFetchData: noop
  };

  getSourceData = i => {
    return this.props.sources[i];
  };

  renderThumbnail = thumbnailUrl => {
    return (
      <Avatar
        src={thumbnailUrl}
        style={{
          width: '30px',
          height: '30px'
        }}
      />
    );
  };

  renderSourceName = (name, data) => {
    const isLivestream = data.isLivestream;
    const cellContents = [name];
    if (isLivestream) {
      cellContents.push((<span className={classNames(styles.gap)} />));
      cellContents.push((
        <ButtonWrapper data={data} onClick={this.handleLivestreamButton}>
          <Button
            variant="outlined"
            size="small"
            className={classNames(styles.liveNowButton)}
          >
            Live Now
          </Button>
        </ButtonWrapper>
      ));
    } 

    if (data.permission) {
      cellContents.push((<span className={classNames(styles.gap)} />));
      cellContents.push((
        <Tooltip title="Shared with You" placement="right">
          <SharedIcon className={styles.sharedIcon} />
        </Tooltip>
      ));
    }

    return (
      <span className={classNames(styles.sourceTileViewCell)}>
        {cellContents}
      </span>
    );
  };

  handleLivestreamButton = (event, data) => {
    event.stopPropagation();
    this.props.onSelectLivestream && this.props.onSelectLivestream(event, data);
  };

  renderCreatedDate = date => {
    return format(date, 'M/D/YYYY h:mm A');
  };

  renderUpdatedDate = date => {
    return capitalize(distanceInWordsToNow(date, { includeSeconds: true }));
  };

  render() {
    const TableComp = this.props.paginate ? PaginatedTable : Table;
    const tableProps = omit(this.props, [
      'sources',
      'onSelectMenuItem',
      'paginate',
      'onFetchData'
    ]);

    if (this.props.paginate) {
      tableProps.onShowCellRange = this.props.onFetchData;
    }

    return (
      <TableComp
        rowGetter={this.getSourceData}
        rowCount={this.props.sources.length}
        onCellClick={this.props.onSelectSource}
        rowHeight={48}
        {...tableProps}
      >
        <Column
          dataKey="thumbnailUrl"
          header=""
          cellRenderer={this.renderThumbnail}
          width={30}
        />
        <Column
          dataKey="name"
          header="Source Name"
          cellRenderer={this.renderSourceName}
        />
        <Column dataKey="sourceType.name" header="Source Type" />
        <Column
          dataKey="createdDateTime"
          header="Created"
          cellRenderer={this.renderCreatedDate}
        />
        <Column
          dataKey="modifiedDateTime"
          header="Updated"
          cellRenderer={this.renderUpdatedDate}
          style={{
            fontStyle: 'italic',
            opacity: 0.54
          }}
        />
        <MenuColumn
          id="menu"
          actions={['Edit', 'Delete']}
          protectedActions={['Delete']}
          onSelectItem={this.props.onSelectMenuItem}
        />
      </TableComp>
    );
  }
}
