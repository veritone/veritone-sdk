import React from 'react';
import { string } from 'prop-types';
import Typography  from '@material-ui/core/Typography';
import Avatar  from '@material-ui/core/Avatar';

/**
 * Sample entity template
 * Any template could be passed into auto complete result along with data
 * Styles intentionally kept here
 * @param name
 * @param description
 * @param image
 * @returns {*}
 * @constructor
 */
export const EntitySearchTemplate = ({ name, description, image }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '48px auto',
        gridTemplateRows: '16px 16px',
        gridColumnGap: '8px',
        gridRowGap: '8px'
      }}
    >
      <div style={{ gridColumn: '1 1', gridRow: '1 2' }}>
        <Avatar src={image} />
      </div>
      <div style={{ gridColumnStart: 2, gridRowStart: 1 }}>{name}</div>
      <div style={{ gridColumnStart: 2, gridRowStart: 2 }}>
        <Typography variant={'caption'}>{description}</Typography>
      </div>
    </div>
  );
};

EntitySearchTemplate.propTypes = {
  name: string,
  image: string,
  description: string
};
