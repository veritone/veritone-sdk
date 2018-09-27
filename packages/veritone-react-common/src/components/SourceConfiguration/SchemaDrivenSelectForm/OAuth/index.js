import React, { Component } from 'react';
import { isEmpty, reduce, startCase } from 'lodash';
import {string, func, oneOf, oneOfType, arrayOf, node} from 'prop-types';
import Button from '@material-ui/core/Button';

export default class OAuth extends Component {
  static propTypes = {
    authSource: oneOf(['dropbox','googleDrive']).isRequired,
    clientId: string.isRequired,
    redirectUri: string.isRequired,
    onAuthSuccess: func.isRequired,
    onAuthError: func.isRequired,
    children: oneOfType([arrayOf(node), node])
  };

  state = {
    error: false,
    baseUrls: {},
    authRedirects: {
      dropbox: `${location.protocol}//${location.host}/dropbox/auth`,
      googleDrive: `${location.protocol}//${location.host}/googleDrive/auth`
    },
    authTokenInfo: {},
    authSource: ''
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {
      baseUrls: {
        dropbox: `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${
          props.clientId
          }&redirect_uri=${props.redirectUri}&state=authorized`,
        googleDrive: `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${
          props.clientId
          }&redirect_uri=${
          props.redirectUri
          }&state=authorized&scope=${window.encodeURI(
          'email profile https://www.googleapis.com/auth/drive'
        )}&access_type=offline&prompt=consent`
      }
    };

    if (props.authSource !== state.authSource) {
      newState.authSource = props.authSource;
      newState.authTokenInfo = {};
    }

    return newState;
  }

  componentWillUnmount() {
    if (this.externalWindow) {
      this.externalWindow.close();
    }
  }

  externalWindow = null;

  openAuthWindow = () => {
    const { redirectUri, onAuthSuccess, onAuthError } = this.props;
    const { authSource } = this.state;
    const authListener = event => {
      const urlParts = event.data.split('#')[0].split('?');
      if (urlParts && urlParts.length > 1) {
        const params = reduce(
          urlParts[1].split('&'),
          (accumulator, p) => {
            const param = p.split('=');
            if (param && param.length) {
              accumulator[param[0]] = param[1];
            }
            return accumulator;
          },
          {}
        );
        if (params.code) {
          fetch(this.state.authRedirects[authSource], {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...params,
              redirectUri
            })
          })
            .then(response => {
              return response.json();
            })
            .then(res => {
              if (res.error) {
                this.setState({
                  error: true,
                  errorDescription: res.error_description
                }, onAuthError(res))
                return res;
              } else {
                this.setState(
                  {
                    error: false,
                    authTokenInfo: {
                      ...res
                    }
                  },
                  onAuthSuccess(res)
                );
                return res;
              }
            });
        }
      }
      window.removeEventListener('message', authListener, false);
    };

    window.addEventListener('message', authListener, false);

    this.externalWindow = window.open(
      this.state.baseUrls[authSource],
      `_${authSource}OauthSigninWindow`,
      'width=700,height=500'
    );
  };

  render() {
    return (
      <div>
        {isEmpty(this.state.authTokenInfo) && (
          <Button
            variant="contained"
            color="primary"
            onClick={this.openAuthWindow}
          >
            Authorize {startCase(this.state.authSource)}
          </Button>
        )}
        { this.state.error &&
            <div>There was an error authorizing your {startCase(this.state.authSource)} account.</div>
        }
        { !this.state.error && !isEmpty(this.state.authTokenInfo) && this.props.children }
      </div>
    );
  }
}
