import { AppBar } from 'veritone-react-common';

export default class AppBarWidget {
  constructor({ elId }) {
    this.elId = elId;
  }

  init() {
    const el = document.getElementById(this.elId);
    if (!el) {
      return console.warn(`Element with ID ${this.elId} was not found in the document.`)
    }

    this.el = el;
  }

  getComponent() {
    return AppBar;
  }
}