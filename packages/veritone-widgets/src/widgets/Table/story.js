import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import faker from 'faker';

import VeritoneApp from '../../shared/VeritoneApp';
import { TableWidget } from './';
import { startCase, upperCase, map, flow, truncate, range } from 'lodash';

const row = () => ({
  date: faker.date.future(),
  name: faker.internet.userName(),
  text: faker.lorem.paragraph(),
  ip: faker.internet.ip(),
  actions: ['View', 'Edit', 'Delete']
});
const data = range(50).map(row);

const menuHandler = action('menu item selected');
const columns = map(data[0], (val, key) => {
  const isMenu = key === 'actions';
  return {
    dataKey: key,
    header: startCase(key),
    transform: flow([upperCase, truncate]),
    align: 'center',
    width: Math.min((Math.min(key.length, 4) + 1) * 10, 100),
    menu: isMenu,
    onSelectItem: isMenu ? menuHandler : undefined
  };
});

class Story extends React.Component {
  componentDidMount() {
    this._table = new TableWidget({
      elId: 'table-widget',
      title: 'TableWidget Widget',
      paginate: true,
      initialItemsPerPage: 10,
      data,
      columns
    });
  }

  componentWillUnmount() {
    this._table.destroy();
  }

  render() {
    return (
      <div>
        <span id="table-widget" />
      </div>
    );
  }
}

const app = VeritoneApp({
  applicationId: '7ef232e8-7c4e-46e0-b9c3-ba53ed9851c1'
});

storiesOf('Table', module).add('Base', () => {
  return <Story store={app._store} />;
});
