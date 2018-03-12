import React from 'react';
import { bool, func } from 'prop-types';
import { capitalize } from 'lodash';

import { Lozenge, Price, Ellipsis, StarRating } from 'veritone-react-common';
import ToggleButton from '../ToggleButton/';
import cjisLogo from '../images/CJIS_logo.png';
import fedrampLogo from '../images/fedramp_logo.png';
import networkIsolatedLogo from '../images/networkisolated_logo.png';
import externalAccessLogo from '../images/externalaccess_logo.png';
import externalProcessingLogo from '../images/externalprocessing_logo.png';
import humanReviewLogo from '../images/humanreview_logo.png';

import styles from './styles.scss';

export default ({ engine }) => {
  const deploymentModelLogo = {
    FullyNetworkIsolated: networkIsolatedLogo,
    MostlyNetworkIsolated: externalAccessLogo,
    NonNetworkIsolated: externalProcessingLogo,
    HumanReview: humanReviewLogo
  };
  return (
    <div className={styles.row}>
      <div className={styles.avatar}>
        {engine.iconPath && <img src={this.props.engine.iconPath} />}
        {!engine.iconPath && <i className="icon-engines" />}
      </div>
      <div className={styles.container}>
        <div className={styles.primary}>
          <div className={styles.title}>{engine.name}</div>
          <div className={styles.orgName}>{engine.ownerOrganization.name}</div>
          <div className={styles.info}>
            <Lozenge type={engine.category.name} />
            <StarRating rating={engine.rating} />
          </div>
          <div className={styles.logos}>
            <div className={styles.logo}>
              <img src={cjisLogo} />
            </div>
            <div className={styles.logo}>
              <img src={fedrampLogo} />
            </div>
            <div className={styles.logo}>
              <img src={deploymentModelLogo[engine.deploymentModel]} />
            </div>
          </div>
        </div>
        <div className={styles.secondary}>
          <Price amount={engine.price} />
          <div className={styles.button}>
            <ToggleButton />
          </div>
        </div>
      </div>
    </div>
  );
};
