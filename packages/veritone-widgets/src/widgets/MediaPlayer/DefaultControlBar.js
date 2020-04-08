import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import {
  VolumeMenuButton,
  ControlBar,
  ReplayControl,
  ForwardControl,
  PlayToggle,
  playerActions,
  videoActions,
  CurrentTimeDisplay,
  TimeDivider,
  DurationDisplay,
  ProgressControl,
  FullscreenToggle
} from 'video-react';
import { shape, objectOf, any, bool, number } from 'prop-types';
import { withStyles } from '@material-ui/styles';

import { RestartMediaButton } from 'veritone-react-common';
import 'video-react/dist/video-react.css';

import styles from './styles';

@withStyles(styles)
@connect(
  state => ({
    playerState: state.player,
    hasStarted: state.player.hasStarted
  }),
  dispatch => ({
    videoReactActions: bindActionCreators(
      { ...playerActions, ...videoActions },
      dispatch
    )
  })
)
export default class DefaultControlBar extends React.Component {
  static propTypes = {
    playerRef: shape({
      current: objectOf(any)
    }),
    hasStarted: bool,
    btnRestart: bool,
    btnReplay: bool,
    btnForward: bool,
    btnPlayToggle: bool,
    btnVolume: bool,
    btnFullscreenToggle: bool,
    ctrlProgress: bool,
    displayTime: bool,
    autoHide: bool,
    autoHideTime: number,
    classes: shape({ any })
  };
  static defaultProps = {
    btnRestart: true,
    btnReplay: true,
    btnForward: true,
    btnPlayToggle: true,
    btnVolume: true,
    btnFullscreenToggle: true,
    ctrlProgress: true,
    displayTime: true,
    autoHide: true,
    autoHideTime: 1000
  };

  render() {
    const manager = get(this.props.playerRef, 'current.manager');
    let player, actions, store;
    if (manager) {
      player = manager.getState().player;
      actions = manager.getActions();
      store = manager.store;
    }

    if (!manager) {
      return null;
    }

    const {
      hasStarted,
      btnRestart,
      btnReplay,
      btnForward,
      btnPlayToggle,
      btnVolume,
      btnFullscreenToggle,
      ctrlProgress,
      displayTime,
      autoHide,
      autoHideTime,
      classes
    } = this.props;

    return (
      <div
        className={cx(
          'video-react',
          {
            'video-react-has-started': hasStarted || get(player, 'hasStarted', false)
          },
          classes.externalStyles
        )}
        data-test="DefaultControlBar"
      >
        <ControlBar
          className={cx('mediaPlayerControls')}
          // need to provide these manually because ControlBar is
          // supposed to be a child of Player and get them automatically
          autoHide={autoHide}
          autoHideTime={autoHideTime}
          player={player}
          manager={manager}
          actions={actions}
          store={store}
          disableDefaultControls
        >
          {btnRestart && <RestartMediaButton order={1.1} />}
          {btnReplay && <ReplayControl seconds={10} order={1.2} />}
          {btnForward && <ForwardControl seconds={10} order={1.3} />}
          {btnPlayToggle && <PlayToggle order={2} />}
          {displayTime && <CurrentTimeDisplay player={player} order={3.1} />}
          {displayTime && <TimeDivider order={3.2} />}
          {displayTime && <DurationDisplay player={player} order={3.3} />}
          {ctrlProgress && <ProgressControl order={6} />}
          {btnVolume && <VolumeMenuButton vertical={ctrlProgress} order={7} />}
          {btnFullscreenToggle && <FullscreenToggle order={8} />}
        </ControlBar>
      </div>
    );
  }
}
