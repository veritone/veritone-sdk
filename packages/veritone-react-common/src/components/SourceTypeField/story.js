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
      unsupported: {
        type: 'enum',
        title: 'Enum'
      }
      // datetimeEnd: {
      //   type: 'dateTime',
      //   title: 'datetimeEnd'
      // }
    },
    required: ['url', 'username', 'password']
  }
};


const fieldTypes = {
  url: 'http://www.google.com',
  username: 'vtn1',
  password:'top-secret',
  price: '1.50',
  days: 10,
  location: ['-101.0', '11.0'],
  active: true,
};


class SourceTypeFields extends React.Component {
  constructor(props) {
    super(props);

    this.state = fieldTypes;
  }

  handleChange = (fld, def) => (e) => {
    e.persist();

    this.setState(prevState => ({
      [fld]: def.type !== 'boolean' ? e.target.value : !prevState[fld]
    }));
  }

  handleSubmit = (e, formValues) => {
    e.preventDefault();

    console.log('Form Values:', this.state)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {map(sourceSchema.definition.properties, (def, field) => (
          <SourceTypeField
            id={field}
            type={def.type}
            title={def.title}
            value={this.state[field]}
            onChange={this.handleChange(field, def)}
            required={sourceSchema.definition.required.includes(field)}
          />
        ))}
        <button type="submit">Submit</button>
      </form>
    )
  }
}

storiesOf('SourceTypeField', module)
  .add('Fields', () => <SourceTypeFields />)
