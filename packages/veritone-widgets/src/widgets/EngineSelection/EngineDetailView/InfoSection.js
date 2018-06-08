import React from 'react';
import { func, object, bool, string, shape } from 'prop-types';

import { Lozenge } from 'veritone-react-common';
import ToggleButton from '../ToggleButton/';
import networkIsolatedLogo from '../images/networkisolated_logo.png';
import externalAccessLogo from '../images/externalaccess_logo.png';
import externalProcessingLogo from '../images/externalprocessing_logo.png';
import humanReviewLogo from '../images/humanreview_logo.png';

import styles from './styles.scss';

function InfoSection({ id, engine, onAdd, onRemove, isSelected }) {
  const deploymentModelLogo = {
    FullyNetworkIsolated: networkIsolatedLogo,
    MostlyNetworkIsolated: externalAccessLogo,
    NonNetworkIsolated: externalProcessingLogo,
    HumanReview: humanReviewLogo
  };

  const { name: orgName } = engine.ownerOrganization;
  const { name: categoryName, iconClass, color } = engine.category || {};

  return (
    <div className={styles.row}>
      <div className={styles.avatar}>
        {engine.iconPath ? (
          <img src={engine.iconPath} />
        ) : (
          <i className="icon-engines" />
        )}
      </div>
      <div className={styles.container}>
        <div className={styles.primary}>
          <div className={styles.title}>{engine.name}</div>
          <div className={styles.orgName}>{orgName}</div>
          <div className={styles.info}>
            {categoryName && (
              <Lozenge iconClassName={iconClass} backgroundColor={color}>
                {categoryName}
              </Lozenge>
            )}
          </div>
          <div className={styles.logos}>
            <div className={styles.logo}>
              <img src={deploymentModelLogo[engine.deploymentModel]} />
            </div>
          </div>
        </div>
        <div className={styles.secondary}>
          <div className={styles.button}>
            <ToggleButton
              id={id}
              onAdd={onAdd}
              onRemove={onRemove}
              engineId={engine.id}
              isSelected={isSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

InfoSection.propTypes = {
  id: string.isRequired,
  engine: shape({
    id: string.isRequired,
    name: string.isRequired,
    category: object,
    description: string,
    iconPath: string,
    ownerOrganization: object
  }).isRequired,
  onAdd: func.isRequired,
  onRemove: func.isRequired,
  isSelected: bool.isRequired
};

export default InfoSection;
