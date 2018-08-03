import { ParseURI } from './util';

let _authWindow = null;
let _authWindowListener = null;
let _OAuthToken = null;

const _POLL_TIME = 500;

const cleanupAuthWindow = () => {
  if (_authWindow && _authWindow.close) {
    _authWindow.close();
  }
  _authWindow = null;
};

const removeAuthWindowListener = () => {
  if (_authWindowListener) {
    window.removeEventListener('message', _authWindowListener);
    _authWindowListener = null;
  }
};

const createAuthWindowListener = (OAuthURI, resolve, reject) => {
  removeAuthWindowListener();
  return function authWindowListener(event) {
    let uri = ParseURI(OAuthURI);
    if (event.origin === `${uri.origin}`) {
      let message = event.data;
      // reject the login promise if there's any oauth2 error from widget-server
      if (message && message.error) {
        removeAuthWindowListener();
        cleanupAuthWindow();
        reject(new Error('Veritone OAuth2 Error: ' + message.data));
        return;
      }

      // resolve the login promise if a token is present
      if (message && message.token) {
        _OAuthToken = message.token;
        removeAuthWindowListener();
        cleanupAuthWindow();
        resolve({ OAuthToken: _OAuthToken });
        return;
      }
    }
  };
};

const askOAuthServerForToken = (OAuthURI, resolve, reject) => {
  setTimeout(() => {
    // keep polling until we receive a response
    if (!_OAuthToken) {
      if (_authWindow) {
        _authWindow.postMessage('getOAuthToken', `*`);
      }

      // if the auth window is closed, stop polling
      if (_authWindow && !_authWindow.closed) {
        askOAuthServerForToken(OAuthURI, resolve, reject);
      } else if (_authWindow && _authWindow.closed) {
        _authWindow = null;
        reject(new Error('User cancelled OAuth flow'));
      } else {
        removeAuthWindowListener();
        cleanupAuthWindow();
      }
    }
  }, _POLL_TIME);
};

const login = async OAuthURI => {
  if (!OAuthURI) {
    throw new Error(
      'Missing parameter: Need to include the backend OAuth2 URI'
    );
  }

  if (_OAuthToken) {
    await logout();
  }

  _authWindow = window.open(OAuthURI, '_auth', 'width=550px,height=650px');
  return new Promise((resolve, reject) => {
    _authWindowListener = createAuthWindowListener(OAuthURI, resolve, reject);
    window.addEventListener('message', _authWindowListener);
    askOAuthServerForToken(OAuthURI, resolve, reject);
  });
};

const logout = async () => {
  return new Promise((resolve, reject) => {
    removeAuthWindowListener();
    cleanupAuthWindow();

    // TO DO: Make a backend call to destroy the token
    _OAuthToken = null;
    resolve(true);
  });
};

const handleImplicitRedirect = (
  hash = window.location.hash,
  opener = window.opener
) => {
  let OAuthToken, error, errorDescription;

  try {
    OAuthToken = hash.match(/access_token=(.+)$/)[1].split('&')[0];
  } catch (e) {
    /**/
  }

  if (!OAuthToken) {
    try {
      error = hash.match(/error=(.+)$/)[1].split('&')[0];
      errorDescription = hash.match(/error_description=(.+)$/)[1].split('&')[0];
    } catch (e) {
      /**/
    }
  }

  opener.postMessage(
    {
      OAuthToken,
      error,
      errorDescription
    },
    window.origin
  );
};

export { login, logout, handleImplicitRedirect };
