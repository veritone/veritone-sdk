import React from 'react';

import {
  any, 
  arrayOf, 
  string,
  func
} from 'prop-types';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import styles from './styles.scss';

//TODO: icons should pass in the icon elements, so the onClick is included already
export default class ModalHeader extends React.Component {
  static propTypes = {
    title: string,
    icons: arrayOf(string), // supports help, menu, trash, exit
    helpCallback: func,
    menuCallback: func,
    trashCallback: func,
    exitCallback: func
  };
  static defaultProps = {

  };

  state = {
    help: false,
    menu: false,
    trash: false,
    separator: false,
    exit: true,
    icons: []
  };

  componentWillMount = () => {
    this.props.icons.forEach(icon => { //TODO: should change to setState
      if (icon == 'exit') {
        this.setState((prevState, props) => ({
          separator: true,
          icons: prevState.icons.concat(['separator'])
        }));
      }
      this.setState((prevState, props) => ({
        [icon]: true,
        icons: prevState.icons.concat([icon])
      }));     
    });
  };

  render() {
    const icons = this.state.icons.map((icon, index) => {
      if (icon == 'help') {
        return (
          <IconButton className={styles.helpIcon} aria-label='help' key={index}>
            <Icon className={'icon-help2'}></Icon>
          </IconButton>
        );
      } else if (icon == 'menu') {
        return (
          <IconButton className={styles.menuIcon} aria-label='menu' key={index}>
            <Icon className={'icon-more_vert'}></Icon>
          </IconButton>
        );
      } else if (icon == 'trash') {
        return (
          <IconButton className={styles.trashIcon} aria-label='trash' key={index}>
            <Icon className={'icon-trash'}></Icon>
          </IconButton>
        );
      } else if (icon == 'separator') {
        return <span className={styles.separator} key={index}></span>
      } else if (icon == 'exit') {
        return (
          <IconButton className={styles.exitIcon} aria-label='exit' key={index}>
            <Icon className={'icon-close-exit'}></Icon>
          </IconButton>
        );
      }
    })
    return (
      <div className={styles.fullScreenTopBar}>
        <div className={styles.topBarTitle}>{this.props.title}</div>
        <div className={styles.iconGroup}>
          {icons}
        </div>
      </div>
    );
  };
}