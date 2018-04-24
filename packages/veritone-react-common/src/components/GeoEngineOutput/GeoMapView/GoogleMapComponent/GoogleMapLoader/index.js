const apiLink = Symbol('apiLink');
const loader = Symbol('loader');
const fnResolve = Symbol('resolve');
const fnReject = Symbol('reject');
const callbackName = 'veritone_googleMapCallback';

export default class GoogleMapLoader {
  constructor(apiKey) {
    const key = apiKey;
    this[
      apiLink
    ] = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=${callbackName}`;
  }

  load() {
    if (!this[loader]) {
      this[loader] = new Promise((resolve, reject) => {
        this[fnResolve] = resolve;
        this[fnReject] = reject;

        try {
          if (!window.google) {
            // Setup global callbacks
            //window.gm_authFailure = this.handleAuthError;
            window[callbackName] = this.handleAPILoaded;

            // Load Google Map API
            const script = document.createElement('script');
            script.src = this[apiLink];
            script.async = true;
            document.body.append(script);
          } else {
            // Google API has already loaded
            this[fnResolve](window.google);
          }
        } catch (error) {
          this[fnReject](error);
        }
      });
    }

    return this[loader];
  }

  handleAPILoaded = () => {
    // Remove global callbacks
    //delete window.gm_authFailure;
    delete window[callbackName];

    // Trigger success callback
    this[fnResolve] && this[fnResolve](window.google);
  };

  handleAuthError = error => {
    // Remove global callbacks
    //delete window.gm_authFailure;
    //delete window.veritoneGoogleMapAPI;

    // Trigger error callback
    this[fnResolve] && this[fnResolve](error);
  };
}
