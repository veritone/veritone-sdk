import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import { string, number, func } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import styles from './styles';

const useStyles = makeStyles(styles);

const Avatar = ({ src, size = 85, label, onClick }) => {
  const classes = useStyles();
  return (
    <ButtonBase centerRipple onClick={onClick} disabled={!onClick}>
      <div
        style={{
          backgroundImage: `url(${src})`,
          height: size,
          width: size,
          cursor: onClick ? 'pointer' : 'initial'
        }}
        className={classes.container}
      >
        {label && (
          <div className={classes.labelBackgroundContainer}>
            <div className={classes.labelContainer}>
              <span>{label}</span>
            </div>
          </div>
        )}
      </div>
    </ButtonBase>
  );
};

Avatar.propTypes = {
  src: string.isRequired,
  size: number,
  label: string,
  onClick: func
};

export default Avatar;
