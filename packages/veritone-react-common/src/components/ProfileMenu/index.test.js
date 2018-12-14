import React from 'react';
import { noop, omit } from 'lodash';
import { mount } from 'enzyme';
import { Build, Help } from '@material-ui/icons';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InnerProfileMenu from './InnerProfileMenu';

describe('InnerProfileMenu', function() {
  const testUser = {
    userName: 'mrobb@veritone.com',
    kvp: {
      firstName: 'Mitch',
      lastName: 'Robb',
      image: 'http://placekitten.com/g/400/300'
    }
  };

  it("Shows the user's avatar or a default if not provided", function() {
    let wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={noop}
        />
      </div>
    );
    expect(wrapper.find('img').props().src).toBe(testUser.kvp.image);

    wrapper = mount(
      <div>
        <InnerProfileMenu
          user={{
            ...testUser,
            signedImageUrl: 'https://veritone.com/signed.png'
          }}
          onLogout={noop}
          onEditProfile={noop}
        />
      </div>
    );
    expect(wrapper.find('img').props().src).toMatch(/signed/);

    wrapper = mount(
      <div>
        <InnerProfileMenu
          user={omit(testUser, 'kvp.image')}
          onLogout={noop}
          onEditProfile={noop}
        />
      </div>
    );
    expect(wrapper.find('img').props().src).toMatch(/default/);
  });

  it("shows the user's first name", function() {
    const wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={noop}
        />
      </div>
    );

    expect(wrapper.text()).toMatch(/Mitch/);
  });
  it("shows the user's last name", function() {
    const wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={noop}
        />
      </div>
    );

    expect(wrapper.text()).toMatch(/Robb/);
  });

  it("shows the user's userName", function() {
    const wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={noop}
        />
      </div>
    );

    expect(wrapper.text()).toMatch(/mrobb@veritone\.com/);
  });

  it('calls props.onEditProfile when the edit profile button is clicked', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={handler}
        />
      </div>
    );

    wrapper
      .find('.editProfileButton')
      .first()
      .simulate('click');
    expect(handler).toHaveBeenCalled();
  });

  it('calls props.onLogout when the logout button is clicked', function() {
    const handler = jest.fn();
    const wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={handler}
          onEditProfile={noop}
        />
      </div>
    );

    wrapper
      .find('.logoutButton')
      .first()
      .simulate('click');
    expect(handler).toHaveBeenCalled();
  });

  it('render additional item', function() {
    const additionMenuItems = [
      <MenuItem
        key='helpCenter'
        data='helpCenter'
      >
        <ListItemIcon>
          <Help />
        </ListItemIcon>
        <ListItemText primary='Help Center' />
      </MenuItem>,
        <MenuItem
          key='appConfiguration'
          data='appConfiguration'
        >
          <ListItemIcon>
            <Build />
          </ListItemIcon>
          <ListItemText primary='App Configuration' />
        </MenuItem>
    ]

    const wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={noop}
          additionMenuItems={additionMenuItems}
        />
      </div>
    );

    expect(wrapper.find(MenuItem)).toHaveLength(3);
    expect(
      wrapper.find(MenuItem).filterWhere(n => n.props().data === 'helpCenter')
    ).toHaveLength(1);
    expect(
      wrapper.find(MenuItem).filterWhere(n => n.props().data === 'appConfiguration')
    ).toHaveLength(1);
  })
});
