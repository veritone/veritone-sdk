import React from 'react';
import { string, number, node } from 'prop-types';
import { Table, Column, MenuColumn, Lozenge } from 'veritone-react-common';
import { reduce, sum } from 'lodash';
import { format, distanceInWordsToNow } from 'date-fns';

import styles from '../styles/details.scss';
const configs = ['mgt', 'svc', 'db', 'eng'];

const ClusterList = ({ clusters }) => {
  const clusterConfigsCount = reduce(clusters, (configHash, cluster, idx) => {
    configHash[idx] = {};

    configs.forEach(config => {
      if (cluster[config]) {
        configHash[idx][config] = configHash[idx][config] ? configHash[idx][config] + 1 : 1;
      }
    });

    return configHash;
  }, {});

  function getCluster(row) {
    return clusters[row];
  }
  function renderNodeConfigCount(val, data, dataKey, clusterIdx) {
    return (
      <ContentBlock>
        <span className={styles['cluster-config-count']}>
          {clusterConfigsCount[clusterIdx][dataKey]}
        </span>
      </ContentBlock>
    );
  }
  function renderTotalConfigCount(val, data, dataKey, clusterIdx) {
    return (
      <ContentBlock>
        <span className={styles['cluster-config-count']}>
          {sum(Object.values(clusterConfigsCount[clusterIdx]))}
        </span>
      </ContentBlock>
    )
  }
  function renderClusterName(clusterName) {
    return <span className={styles['cluster-name']}>{clusterName}</span>;
  }
  function renderStatus(status) {
    return (
      <Lozenge backgroundColor="#607D8B">
        <span style={{ letterSpacing: '0.25px' }}>{status}</span>
      </Lozenge>
    );
  }
  function renderDateCreated(createdDate) {
    return format(createdDate, 'M/D/YYYY');
  };
  function renderLastModified(modifiedDate) {
    return (
      <span className={styles["cluster-last-updated"]}>
        {distanceInWordsToNow(modifiedDate, { includeSeconds: true })}
      </span>
    )
  };

  return (
    <Table
      rowGetter={getCluster}
      rowCount={clusters.length}
    >
      <Column
        dataKey="name"
        header="Name"
        cellRenderer={renderClusterName}
      />
      <Column
        dataKey="status"
        header="Status"
        cellRenderer={renderStatus}
      />
      <Column
        dataKey="mgt"
        header="Mgt"
        cellRenderer={renderNodeConfigCount}
        align="center"
        width={60}
      />
      <Column
        dataKey="svc"
        header="Srv"
        cellRenderer={renderNodeConfigCount}
        align="center"
        width={60}
      />
      <Column
        dataKey="db"
        header="Db"
        cellRenderer={renderNodeConfigCount}
        align="center"
        width={60}
      />
      <Column
        dataKey="eng"
        header="Eng"
        cellRenderer={renderNodeConfigCount}
        align="center"
        width={60}
      />
      <Column
        dataKey=""
        header="Total"
        cellRenderer={renderTotalConfigCount}
        align="center"
        width={60}
      />
      <Column
        dataKey="createdDateTime"
        header="Date Created"
        cellRenderer={renderDateCreated}
      />
      <Column
        dataKey="modifiedDateTime"
        header="Last Updated"
        cellRenderer={renderLastModified}
      />
      <MenuColumn
        actions={['View', 'Edit']}
      />
    </Table>
  )
}

const ContentBlock = ({ bgColor = '#F5F5F5', height = 60, children }) => {
  return (
    <div
      className={styles["content-block"]}
      style={{
        backgroundColor: bgColor,
        width: height,
        height: height
      }}
    >
      {children}
    </div>
  )
}

ContentBlock.propTypes = {
  bgColor: string,
  height: number,
  children: node.isRequired
};


export default ClusterList;
