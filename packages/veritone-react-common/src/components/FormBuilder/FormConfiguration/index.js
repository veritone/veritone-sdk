import React from 'react';
import { string, func } from 'prop-types';
import { noop } from 'lodash';
import typeConfiguration from '../typeConfiguration';
import configurationComponents from './items';

import styles from './styles.scss';

export default function Configuration({ type, onChange, ...data }) {
  return (
    <div>
      {
        typeConfiguration[type].map(configurationType => {
          const ConfigurationComponent = configurationComponents[configurationType];
          ConfigurationComponent.displayName = 'FormConfigurationItem';
          return (
            <ConfigurationComponent
              key={configurationType}
              value={data[configurationType]}
              onChange={onChange}
              className={styles['configuration-item']}
              {...data}
            />);
        })
      }
    </div>
  )
}

Configuration.propTypes = {
  type: string,
  onChange: func
}

Configuration.defaultProps = {
  onChange: noop
}
