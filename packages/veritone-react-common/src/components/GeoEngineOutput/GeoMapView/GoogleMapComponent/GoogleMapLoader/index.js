const apiLink = Symbol('apiLink');
const loader = Symbol('loader');
const fnResolve = Symbol('resolve');
const fnReject = Symbol('reject');
const callbackName = 'veritone_googleMapCallback';

export default class GoogleMapLoader {
  constructor(apiKey) {
    if (apiKey) {
      this[
        apiLink
      ] = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`;
    }
  }

  load() {
    if (!this[loader]) {
      this[loader] = new Promise((resolve, reject) => {
        this[fnResolve] = resolve;
        this[fnReject] = reject;

        try {
          if (!window.google) {
            if (this[apiLink]) {
              // Setup global callbacks
              window[callbackName] = this.handleAPILoaded;

              // Load Google Map API
              const script = document.createElement('script');
              script.src = this[apiLink];
              script.async = true;
              document.body.append(script);
            } else {
              throw 'missing google map api key';
            }
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
    delete window[callbackName];

    // Trigger success callback
    this[fnResolve] && this[fnResolve](window.google);
  };
}
