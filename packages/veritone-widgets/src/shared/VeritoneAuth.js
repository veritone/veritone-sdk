import { Promise } from 'es6-promise';

class VeritoneAuth {
    /**
     * @constructor
     * @param {OAuthURI} parameters - URI of the Veritone-Widget-Server
     */
    constructor(OAuthURI, ) {
        if(!OAuthURI) {
            console.error("Missing: Need the backend OAuth2 URI");
        }

        let _OAuthURI = OAuthURI;
        let _authWindow = null;
        let _authWindowListener = null;
        let _OAuthToken = null;
        // the OAuth library needs to work across origins, and the only really feasible way
        // to do that in another window is to poll the other window (by sending it a message and waiting for a response)
        // because without the implicit grant, the window.location will first go to the OAuth2 backend, before going to
        // Veritone's domain, before going back to the OAuth2 backend.
        let _POLL_TIME = 500;

        let cleanupAuthWindow = () => {
            if(_authWindow && _authWindow.close) {
                _authWindow.close();
            }
            _authWindow = null;
        }

        let removeAuthWindowListener = () => {
            if (_authWindowListener) {
                window.removeEventListener('message', _authWindowListener);
                _authWindowListener = null;
            }
        }

        let createAuthWindowListener = (resolve, reject) => {
            return function authWindowListener(event) {
                let uri = ParseURI(_OAuthURI);
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

        let askOAuthServerForToken = (resolve, reject) => {
            setTimeout( () => {
                let uri = ParseURI(_OAuthURI);
                // keep polling until we receive a response
                if(!_OAuthToken) {
                    if(_authWindow) {
                        _authWindow.postMessage("getOAuthToken", `${uri.origin}`);
                    }

                    // if the auth window is closed, stop polling
                    if(_authWindow && !_authWindow.closed) {
                        askOAuthServerForToken(resolve, reject);
                    } else if (_authWindow && _authWindow.closed) {
                        _authWindow = null;
                        reject(new Error("User cancelled OAuth flow"));
                    } else {
                        removeAuthWindowListener();
                        cleanupAuthWindow();
                    }
                }
            }, 500);
        }

        this.login = () => {
            removeAuthWindowListener();
            _OAuthToken = null;

            _authWindow = window.open(_OAuthURI, "_auth", "width=550px,height=650px");
            return new Promise( (resolve, reject) => {
                window.addEventListener('message', createAuthWindowListener(resolve, reject));
                askOAuthServerForToken(resolve, reject);
            });
        }

        this.logout = () => {
            return new Promise( (resolve, reject) => {
                cleanupAuthWindow();
                removeAuthWindowListener();

                // TO DO: Make a backend call to destroy the token
                _OAuthToken = null;
                resolve(true);
            });
        }

        // URI Parser from https://stackoverflow.com/a/39308026 to
        // extract the origin from _widgetServerUri to prevent XSS
        let ParseURI = (url) => {
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
    }
}

export default VeritoneAuth;
