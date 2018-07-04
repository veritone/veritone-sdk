import React from 'react';
import { storiesOf } from '@storybook/react';
import { map } from 'lodash';

import SourceTypeField from './';

const sourceSchema = {
  definition: {
    properties: {
      url: {
        type: 'string'
      },
      username: {
        type: 'string',
        title: 'User Name'
      },
      password: {
        type: 'string'
      },
      active: {
        type: 'boolean',
        title: 'Active'
      },
      price: {
        type: 'number'
      },
      days: {
        type: 'integer'
      },
      location: {
        type: 'geoPoint',
        title: 'Geo Location'
      },
      endDate: {
        type: 'dateTime',
        title: 'End Date'
      },
      unsupported: {
        type: 'enum',
        title: 'Enum'
      }
    },
    required: ['url', 'username', 'password']
  }
};

const fieldTypes = {
  url: 'http://www.google.com',
  username: 'vtn1',
  password: 'top-secret',
  price: '1.50',
  days: 10,
  location: ['-101.0', '11.0'],
  active: true,
  endDate: new Date()
};

class SourceTypeFields extends React.Component {
  constructor(props) {
    super(props);

    this.state = fieldTypes;
  }

  handleChange = (e, fld, def) => {
    if (def.type === 'dateTime') {
      const date = e;

      return this.setState(prevState => ({
        [fld]: date
      }));
    }

    e.persist();

    this.setState(prevState => ({
      [fld]: def.type !== 'boolean' ? e.target.value : !prevState[fld]
    }));
  };

  handleSubmit = (e, formValues) => {
    e.preventDefault();

    console.log('Form Values:', this.state);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {map(sourceSchema.definition.properties, (def, field) => (
          <SourceTypeField
            key={field}
            id={field}
            type={def.type}
            title={def.title}
            value={this.state[field]}
            onChange={this.handleChange}
            required={sourceSchema.definition.required.includes(field)}
          />
        ))}
        <button type="submit">Submit</button>
      </form>
    );
  }
}

storiesOf('SourceTypeField', module).add('Fields', () => <SourceTypeFields />);
