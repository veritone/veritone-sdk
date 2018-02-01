import React from 'react';
import cx from 'classnames';
import Paper from 'material-ui/es/Paper';
import IconButton from 'material-ui/es/IconButton';
import ArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import EditIcon from 'material-ui-icons/ModeEdit';

import { func, oneOf, string, objectOf, any } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';

const RaisedTextField = ({
  label,
  value,
  action,
  onClickAction,
  className,
  containerStyle
}) => {
  const actionIcon = {
    edit: <EditIcon />,
    go: <ArrowRightIcon />
  }[action];

  return (
    <Paper
      className={cx(styles.paper, className)}
      style={containerStyle}
      square
    >
      <div className={styles.container}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        <div className={styles.actionIconContainer}>
          <IconButton
            className={styles.actionIcon}
            onClick={onClickAction}
            disabled={!actionIcon}
          >
            {actionIcon}
          </IconButton>
        </div>
      </div>
    </Paper>
  );
};

RaisedTextField.propTypes = {
  className: string,
  containerStyle: objectOf(any),
  label: string,
  value: string,
  action: oneOf(['edit', 'go']),
  onClickAction: func
};

export default withMuiThemeProvider(RaisedTextField);
