import { guid } from './util';

export default function widget(Component) {
  return class Widget {
    static displayName = Component.displayName || Component.name;

    constructor({ elId, widgetId, ...props }) {
      this._elId = elId;
      this._props = props;
      this._id = widgetId || guid();
    }

    init() {
      const el = document.getElementById(this._elId);
      if (!el) {
        return console.warn(
          `Element with ID ${this._elId} was not found in the document.`
        );
      }

      this.el = el;
    }

    get id() {
      return this._id;
    }

    get Component() {
      return Component;
    }

    get props() {
      return this._props;
    }
  };
}
