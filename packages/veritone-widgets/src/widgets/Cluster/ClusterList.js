import React from 'react';
import {
  string,
  number,
  node,
  shape,
  arrayOf,
  func,
  objectOf,
  bool
} from 'prop-types';
import { Table, Column, MenuColumn, Lozenge } from 'veritone-react-common';
import { reduce, sum, get, noop } from 'lodash';
import { format, distanceInWordsToNow } from 'date-fns';

import styles from './styles/cluster-list.scss';
const configs = ['mgt', 'svc', 'db', 'eng'];

import widget from '../../shared/widget';

class ClusterList extends React.Component {
  static propTypes = {
    clusters: arrayOf(
      shape({
        name: string,
        definition: shape({
          nodes: arrayOf(
            shape({
              configs: objectOf(bool)
            })
          )
        })
      })
    ).isRequired,
    onRowClick: func
  };

  static defaultProps = {
    onRowClick: noop
  };

  getCluster = row => {
    return this.props.clusters[row];
  };
  renderNodeConfigCount = (clusterConfigsCount, config) => (
    val,
    data,
    dataKey,
    clusterIdx
  ) => {
    return (
      <ContentBlock>
        <span className={styles['cluster-config-count']}>
          {get(clusterConfigsCount, [clusterIdx, config], 0)}
        </span>
      </ContentBlock>
    );
  };
  renderTotalConfigCount = clusterConfigsCount => (
    val,
    data,
    dataKey,
    clusterIdx
  ) => {
    return (
      <ContentBlock>
        <span className={styles['cluster-config-count']}>
          {sum(Object.values(clusterConfigsCount[clusterIdx]))}
        </span>
      </ContentBlock>
    );
  };
  renderClusterName = clusterName => {
    return <span className={styles['cluster-name']}>{clusterName}</span>;
  };
  renderStatus = status => {
    return (
      <Lozenge backgroundColor="#607D8B">
        <span style={{ letterSpacing: '0.25px' }}>{status}</span>
      </Lozenge>
    );
  };
  renderDateCreated = createdDate => {
    return format(createdDate, 'M/D/YYYY');
  };
  renderDateUpdated = updatedDate => {
    return (
      <span className={styles['cluster-last-updated']}>
        {distanceInWordsToNow(updatedDate, { includeSeconds: true })}
      </span>
    );
  };

  render() {
    // build a hash containing the count of the specified configs in the nodes of each cluster
    const clusterConfigsCount = reduce(
      this.props.clusters,
      (configHash, cluster, clusterIdx) => {
        configHash[clusterIdx] = {};

        get(cluster, 'definition.nodes', []).forEach(node => {
          configs.forEach(config => {
            if (node.configs[config]) {
              configHash[clusterIdx][config] = configHash[clusterIdx][config]
                ? configHash[clusterIdx][config] + 1
                : 1;
            }
          });
        });

        return configHash;
      },
      {}
    );

    return (
      <Table
        rowGetter={this.getCluster}
        rowCount={this.props.clusters.length}
        onCellClick={this.props.onRowClick}
      >
        <Column
          dataKey="definition.name"
          header="Name"
          cellRenderer={this.renderClusterName}
        />
        <Column
          dataKey="status"
          header="Status"
          cellRenderer={this.renderStatus}
        />
        <Column
          dataKey=""
          header="Mgt"
          cellRenderer={this.renderNodeConfigCount(clusterConfigsCount, 'mgt')}
          align="center"
          width={60}
        />
        <Column
          dataKey=""
          header="Srv"
          cellRenderer={this.renderNodeConfigCount(clusterConfigsCount, 'svc')}
          align="center"
          width={60}
        />
        <Column
          dataKey=""
          header="Db"
          cellRenderer={this.renderNodeConfigCount(clusterConfigsCount, 'db')}
          align="center"
          width={60}
        />
        <Column
          dataKey=""
          header="Eng"
          cellRenderer={this.renderNodeConfigCount(clusterConfigsCount, 'eng')}
          align="center"
          width={60}
        />
        <Column
          dataKey=""
          header="Total"
          cellRenderer={this.renderTotalConfigCount(clusterConfigsCount)}
          align="center"
          width={60}
        />
        <Column
          dataKey="createdDateTime"
          header="Date Created"
          cellRenderer={this.renderDateCreated}
        />
        <Column
          dataKey="modifiedDateTime"
          header="Last Updated"
          cellRenderer={this.renderDateUpdated}
        />
        <MenuColumn actions={['View', 'Edit']} />
      </Table>
    );
  }
}

const ContentBlock = ({ bgColor = '#F5F5F5', height = 60, children }) => {
  return (
    <div
      className={styles['content-block']}
      style={{
        backgroundColor: bgColor,
        width: height,
        height: height
      }}
    >
      {children}
    </div>
  );
};

ContentBlock.propTypes = {
  bgColor: string,
  height: number,
  children: node.isRequired
};

const ClusterListWidget = widget(ClusterList);
export { ClusterList as default, ClusterListWidget };
