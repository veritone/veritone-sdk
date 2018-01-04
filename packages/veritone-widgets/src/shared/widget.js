import { forEach } from 'lodash';
import VeritoneApp from './VeritoneApp';

export default function widget(Component) {
  return class Widget {
    constructor({ elId, widgetId, ...props }) {
      this._elId = elId;
      this._props = props;
      // this._id = widgetId || guid();
      this._ref = null; // set by VeritoneApp

      this._app = VeritoneApp(null, { _isWidget: true });

      if (this._app) {
        this._app._register(this);
      }
    }

    destroy() {
      this._app._unregister(this);
    }

    set ref(val) {
      this._ref = val;

      // allow access of ref properties on the widget itself
      // (should only be used by consumers to call component's API)
      forEach(val, (value, key) => {
        Object.defineProperty(this, key, { value });
      });

      console.log(this);

      // todo: go through and defineProperty getters for each of
      // the ref's ownProps
    }

    // get id() {
    //   return this._id;
    // }

    get Component() {
      return Component;
    }

    get props() {
      return this._props;
    }
  };
}
