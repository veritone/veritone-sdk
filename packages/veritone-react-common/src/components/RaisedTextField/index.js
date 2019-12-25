import React from 'react';
import cx from 'classnames';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';
import { func, string, objectOf, any, bool, node } from 'prop-types';

import styles from './styles';

const useStyles = makeStyles(styles);

const RaisedTextField = ({
  label,
  value,
  action,
  onClickAction,
  className,
  containerStyle,
  disabled,
  actionTooltipLabel
}) => {
  const classes = useStyles();
  const actionIcon = {
    edit: <EditIcon />,
    go: <ArrowRightIcon />
  }[action];

  return (
    <Paper
      className={cx(classes.paper, className)}
      style={containerStyle}
      square
    >
      <div className={classes.container}>
        <div className={classes.label}>{label}</div>
        <div className={classes.value}>{value}</div>
        <ConditionalToolTip title={actionTooltipLabel} placement="left">
          <div className={classes.actionIconContainer}>
            {action &&
              (actionIcon ? (
                <IconButton
                  className={classes.actionIcon}
                  onClick={onClickAction}
                  disabled={!action || disabled}
                >
                  {actionIcon}
                </IconButton>
              ) : (
                <Button // className={classes.actionIcon}
                  onClick={onClickAction}
                  disabled={disabled}
                >
                  {action}
                </Button>
              ))}
          </div>
        </ConditionalToolTip>
      </div>
    </Paper>
  );
};

RaisedTextField.propTypes = {
  className: string,
  containerStyle: objectOf(any),
  label: string,
  value: string,
  action: string,
  onClickAction: func,
  disabled: bool,
  actionTooltipLabel: string
};

export default RaisedTextField;

const ConditionalToolTip = ({ title, children, ...props }) =>
  title ? (
    <Tooltip title={title} {...props}>
      {children}
    </Tooltip>
  ) : (
    children
  );

ConditionalToolTip.propTypes = {
  title: string,
  children: node
};
