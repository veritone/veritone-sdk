import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
// import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import { shape, string, bool, func, node, objectOf, any } from 'prop-types';

import styles from './styles.scss';

// @withMuiThemeProvider
export default class NullStateCard extends React.Component {
  static propTypes = {
    imgSrc: string.isRequired,
    imgProps: shape({
      alt: string,
      style: objectOf(any)
    }),
    titleText: string,
    btnProps: shape({
      onClick: func.isRequired,
      text: string.isRequired
    }),
    disableHover: bool,
    children: node
  }

  state = {
    hover: false
  }

  handleMouseOver = (boolVal) => () => {
    this.setState({
      hover: boolVal
    })
  }

  render() {
    const { children, disableHover, imgSrc, titleText, imgProps, btnProps } = this.props;

    return (
      <div
        onMouseOver={this.handleMouseOver(true)}
        onMouseLeave={this.handleMouseOver(false)}>
        <Card
          classes={{
            root: styles['null-state-card']
          }}
          raised={!disableHover && this.state.hover}
        >
          <CardContent
            classes={{
              root: styles['null-card-content']
            }}
          >
            {imgProps &&
              <img
                src={imgSrc}
                style={{
                  marginBottom: '20px'
                }}
                {...imgProps}
              />}
            {titleText &&
              <div className={styles['card-title']}>
                {titleText}
              </div>
            }
            {children &&
              <div className={styles['card-desc-text']}>
                {children}
              </div>}
          </CardContent>
          {btnProps &&
            <CardActions>
              <Button
                className={styles.buttonStyle}
                variant="raised"
                color="primary"
                onClick={btnProps.onClick}
              >
                {btnProps.text}
              </Button>
            </CardActions>
          }
        </Card>
      </div>
    );
  }
}
