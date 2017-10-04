import React from 'react';
import VeritoneWidget from '../shared/VeritoneWidget';

import {Avatar, test, RaisedTextField} from 'veritone-react-common';

class EditProfileWrapper extends VeritoneWidget {
  constructor(parameters = {}) {
    parameters.ref = instance => {
      this.ref = instance;

      // explicit binding to make the refresh function available to the outside world
      if (instance && instance.refresh) {
        this.refresh = instance.refresh;
      }
    };
    super(EditProfile, parameters);
  }
}

class EditProfile extends React.Component {
  render() {
    <div />
  }
}

export default EditProfileWrapper;
