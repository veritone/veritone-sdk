import React from 'react';
import { NullStateCard, ModalHeader } from 'veritone-react-common';
import { noop } from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';

import styles from './styles/splash-screen.scss';

import ClusterTypeImage1 from './images/aws-logo-md.png';
import ClusterTypeImage2 from './images/quantum-logo-md.png';
import ClusterTypeImage3 from './images/on-premise-icon.png';


export default class ClusterSplashScreen extends React.Component {
  render() {
    return (
      <Dialog
        fullScreen
        open
        onClose={this.handleCloseDialog}
      >
        <ModalHeader
          title="Add aiWARE"
          backgroundColor={blueGrey[500]}
          color={grey[50]}
          closeButton
          onClose={this.handleCloseDialog}
        />
        <div className={styles['cluster-type-container']}>
          <div className={styles['splash-title']}>Configure your first aiWARE cluster</div>
          <div className={styles['cluster-types']}>
            <NullStateCard
              imgSrc={ClusterTypeImage1}
              imgProps={{
                alt: "https://static.veritone.com/veritone-ui/default-nullstate.svg"
              }}
              btnProps={{
                text: "Get Started",
                onClick: noop
              }}
            >
              <p>
                Proin porta augue nec venenatis malesuada. Aenean at nulla at magna accumsan varius. Vivamus tempus purus at est venenatis.
              </p>
            </NullStateCard>
            <NullStateCard
              imgSrc={ClusterTypeImage2}
              imgProps={{
                alt: "https://static.veritone.com/veritone-ui/default-nullstate.svg"
              }}
              btnProps={{
                text: "Get Started",
                onClick: noop
              }}
            >
              <p>
                Proin porta augue nec venenatis malesuada. Aenean at nulla at magna accumsan varius. Vivamus tempus purus at est venenatis.
              </p>
            </NullStateCard>
            <NullStateCard
              imgSrc={ClusterTypeImage3}
              imgProps={{
                style: {
                  fontSize: '100px',
                  marginBottom: '10px',
                },
                alt: "https://static.veritone.com/veritone-ui/default-nullstate.svg"
              }}
              titleText="On Premise"
              btnProps={{
                text: "Get Started",
                onClick: noop
              }}
            >
              <p>
                Proin porta augue nec venenatis malesuada. Aenean at nulla at magna accumsan varius. Vivamus tempus purus at est venenatis.
              </p>
            </NullStateCard>
          </div>
        </div>
      </Dialog>
    )
  }
}
