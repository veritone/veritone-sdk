import React from 'react';
import { func, string } from 'prop-types';
import Button from '@material-ui/core/Button';
import { reduce, isEmpty } from 'lodash';

export default class DropboxAuth extends React.Component {
  static propTypes = {
    clientId: string.isRequired,
    redirectUri: string.isRequired,
    onAuthSuccess: func.isRequired
  };

  state = {
    authTokenInfo: {}
  };

  externalWindow = null;

  openAuthWindow = () => {
    const { redirectUri, onAuthSuccess } = this.props;
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
          fetch(`${location.protocol}//${location.host}/dropbox/auth`, {
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
              this.setState(
                {
                  authTokenInfo: {
                    ...res
                  }
                },
                onAuthSuccess(res)
              );
              return res;
            });
        }
      }
      window.removeEventListener('message', authListener, false);
    };

    window.addEventListener('message', authListener, false);

    const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${
      this.props.clientId
    }&redirect_uri=${this.props.redirectUri}&state=authorized`;
    this.externalWindow = window.open(
      dropboxAuthUrl,
      `_dropboxOauthSigninWindow`,
      'width=700,height=500'
    );
  };

  render() {
    return (
      <div>
        {isEmpty(this.state.authTokenInfo) && (
          <Button onClick={this.openAuthWindow}>Authorize Dropbox</Button>
        )}
      </div>
    );
  }
}
