import { Promise } from 'es6-promise';

let _authWindow = null;
let _authWindowListener = null;
let _OAuthToken = null;

const _POLL_TIME = 500;

const cleanupAuthWindow = () => {
    if(_authWindow && _authWindow.close) {
        _authWindow.close();
    }
    _authWindow = null;
}

const removeAuthWindowListener = () => {
    if (_authWindowListener) {
        window.removeEventListener('message', _authWindowListener);
        _authWindowListener = null;
    }
}

const createAuthWindowListener = (OAuthURI, resolve, reject) => {
    return function authWindowListener(event) {
        let uri = ParseURI(OAuthURI);
        if(event.origin === `${uri.origin}`) {
            let message = event.data;
            if(message && message.token) {
                _OAuthToken = message.token;
                resolve( {OAuthToken: _OAuthToken } );
                removeAuthWindowListener();
                cleanupAuthWindow();
            }
        }
    }
}

const askOAuthServerForToken = (OAuthURI, resolve, reject) => {
    setTimeout( () => {
        let uri = ParseURI(OAuthURI);
        // keep polling until we receive a response
        if(!_OAuthToken) {
            if(_authWindow) {
                _authWindow.postMessage("getOAuthToken", `${uri.origin}`);
            }

            // if the auth window is closed, stop polling
            if(_authWindow && !_authWindow.closed) {
                askOAuthServerForToken(OAuthURI, resolve, reject);
            } else if (_authWindow && _authWindow.closed) {
                _authWindow = null;
                reject(new Error("User cancelled OAuth flow"));
            } else {
                removeAuthWindowListener();
                cleanupAuthWindow();
            }
        }
    }, _POLL_TIME);
}

// URI Parser from https://stackoverflow.com/a/39308026 to
// extract the origin from _widgetServerUri to prevent XSS
const ParseURI = (url) => {
    var m = url.match(/^(([^:\/?#]+:)?(?:\/\/(([^\/?#:]*)(?::([^\/?#:]*))?)))?([^?#]*)(\?[^#]*)?(#.*)?$/),
        r = {
            hash: m[8] || "",                    // #asd
            host: m[3] || "",                    // localhost:257
            hostname: m[4] || "",                // localhost
            href: m[0] || "",                    // http://localhost:257/deploy/?asd=asd#asd
            origin: m[1] || "",                  // http://localhost:257
            pathname: m[6] || (m[1] ? "/" : ""), // /deploy/
            port: m[5] || "",                    // 257
            protocol: m[2] || "",                // http:
            search: m[7] || ""                   // ?asd=asd
        };
    if (r.protocol.length == 2) {
        r.protocol = "file:///" + r.protocol.toUpperCase();
        r.origin = r.protocol + "//" + r.host;
    }
    r.href = r.origin + r.pathname + r.search + r.hash;
    return m && r;
};

const login = (OAuthURI) => {
    if(!OAuthURI) {
        throw new Error("Missing parameter: Need to include the backend OAuth2 URI");
    }

    removeAuthWindowListener();
    _authWindow = window.open(OAuthURI, "_auth", "width=550px,height=650px");
    return new Promise( (resolve, reject) => {
        window.addEventListener('message', createAuthWindowListener(OAuthURI, resolve, reject));
        askOAuthServerForToken(OAuthURI, resolve, reject);
    });
}

const logout = () => {
    return new Promise( (resolve, reject) => {
        removeAuthWindowListener();
        cleanupAuthWindow();

        // TO DO: Make a backend call to destroy the token
        _OAuthToken = null;
        resolve(true);
    });
}

export { login, logout };
