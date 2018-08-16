import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';
import ProgramInfoWidget from '.';

const generateAcls = function(n, permission) {
  const acls = [];
  for (let i = 1; i <= n; i++) {
    acls.push({
      organizationId: 'orgId' + i,
      permission: permission
    });
  }
  return acls;
};

const generateOrganizations = function(n) {
  const organizations = [];
  for (let i = 1; i <= n; i++) {
    organizations.push({
      id: 'orgId' + i,
      name: 'Organization ' + i
    });
  }
  return organizations;
};

class NoDataStory extends React.Component {
  state = { lastResult: {} };

  componentDidMount() {
    this._programInfo = new ProgramInfoWidget({
      elId: 'programInfo-widget',
      initialValues: {},
      handleSubmit: this.handleSubmit
    });
  }

  componentWillUnmount() {
    this._programInfo.destroy();
  }

  handleSubmit = values => {
    this.setState({
      lastResult: values
    });
  };

  submitForm = () => {
    this._programInfo.submit(values => {
      this.handleSubmit(values);
      console.log('Form Submitted:', values);
    });
  };

  render() {
    return (
      <div>
        <span id="programInfo-widget" />
        <button type="button" onClick={this.submitForm}>
          Submit
        </button>
        <div>
          Last result:
          <pre>{JSON.stringify(this.state.lastResult, null, '\t')}</pre>
        </div>
      </div>
    );
  }
}

class FullDataStory extends React.Component {
  state = { lastResult: {} };

  componentDidMount() {
    this._programInfo = new ProgramInfoWidget({
      elId: 'programInfo-widget',
      canShare: true,
      canEditAffiliates: true,
      canBulkAddAffiliates: true,
      program: {
        id: '12345',
        name: 'Test program',
        imageUri: '',
        liveImageUri: '',
        description: 'This is a test program data with description',
        website: 'www.veritone.com',
        format: 'live',
        language: 'en',
        isNational: true,
        acls: generateAcls(11, 'viewer'),
        isPublic: true,
        affiliates: []
      },
      programFormats: [
        {
          id: 'live',
          name: 'Live'
        },
        {
          id: 'recorded',
          name: 'Recorded'
        }
      ],
      organizations: generateOrganizations(21),
      affiliates: [],
      handleSubmit: this.handleSubmit
    });
  }

  componentWillUnmount() {
    this._programInfo.destroy();
  }

  handleSubmit = values => {
    this.setState({
      lastResult: values
    });
  };

  submitForm = () => {
    this._programInfo.submit(values => {
      this.handleSubmit(values);
      console.log('Form Submitted:', values);
    });
  };

  render() {
    return (
      <div>
        <span id="programInfo-widget" />
        <button type="button" onClick={this.submitForm}>
          Submit
        </button>
        <div>
          Last result:
          <pre>{JSON.stringify(this.state.lastResult, null, '\t')}</pre>
        </div>
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Program Info', module)
  .add('Base No Data', () => {
    return <NoDataStory store={app._store} />;
  })

  .add('Base Full Data', () => {
    return <FullDataStory store={app._store} />;
  });
