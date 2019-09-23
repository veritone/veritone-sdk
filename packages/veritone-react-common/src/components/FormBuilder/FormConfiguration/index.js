import React from 'react';
import { string, func } from 'prop-types';
import { noop } from 'lodash';
import typeConfiguration from '../typeConfiguration';
import configurationComponents from './items';

export default function Configuration({ type, onChange, ...data }) {
  return (
    <div>
      {
        typeConfiguration[type].map(configurationType => {
          const ConfigurationComponent = configurationComponents[configurationType];
          return (
            <ConfigurationComponent
              key={configurationType}
              value={data[configurationType]}
              onChange={onChange}
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
