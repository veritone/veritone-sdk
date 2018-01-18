import { forOwn } from 'lodash';
import VeritoneApp from './VeritoneApp';

export default function widget(Component) {
  return class Widget {
    constructor({ elId, widgetId, ...props }) {
      this._elId = elId;
      this._props = props;
      this._app = VeritoneApp(null, { _isWidget: true });

      if (this._app) {
        this._app._register(this);
      }
    }

    destroy() {
      this._app._unregister(this);
    }

    setRefProperties(ref) {
      // allow access of ref properties on the widget itself
      // (should only be used by consumers to call component's API)
      forOwn(ref, (value, key) => {
        try {
          Object.defineProperty(this, key, { value });
        } catch (e) { /* */
        }
      });
    }

    get Component() {
      return Component;
    }

    get props() {
      return this._props;
    }
  };
}
