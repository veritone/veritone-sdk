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

  it("Shows the user's avatar or a default with Initials if not provided", function() {
    let wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={noop}
        />
      </div>
    );
    expect(
      wrapper
        .find('[data-test="userAvatar"]')
        .find('img')
        .props().src
    ).toBe(testUser.kvp.image);

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
    expect(
      wrapper
        .find('[data-test="userAvatar"]')
        .find('img')
        .props().src
    ).toMatch(/signed/);

    wrapper = mount(
      <div>
        <InnerProfileMenu
          user={omit(testUser, 'kvp.image')}
          onLogout={noop}
          onEditProfile={noop}
        />
      </div>
    );
    expect(
      wrapper
        .find('[data-test="userAvatarInitials"]')
        .find('div')
        .text()
    ).toEqual('MR');
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
      .find('[data-test="editProfileButton"]')
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
      .find('[data-test="logoutButton"]')
      .first()
      .simulate('click');
    expect(handler).toHaveBeenCalled();
  });

  it('renders additional items', function() {
    const additionMenuItems = [
      <MenuItem key="helpCenter" data="helpCenter">
        <ListItemIcon>
          <Help />
        </ListItemIcon>
        <ListItemText primary="Help Center" />
      </MenuItem>,
      <MenuItem key="appConfiguration" data="appConfiguration">
        <ListItemIcon>
          <Build />
        </ListItemIcon>
        <ListItemText primary="App Configuration" />
      </MenuItem>
    ];

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

    expect(wrapper.find(MenuItem)).toHaveLength(2);
    expect(
      wrapper.find(MenuItem).filterWhere(n => n.props().data === 'helpCenter')
    ).toHaveLength(1);
    expect(
      wrapper
        .find(MenuItem)
        .filterWhere(n => n.props().data === 'appConfiguration')
    ).toHaveLength(1);
  });

  it('renders settings button if app is discovery and admin access', function() {
    const enabledApps = [
      {
        applicationIconUrl:
          'https://static.veritone.com/veritone-ui/appicons-2/admin.png',
        applicationId: 'ea1d26ab-0d29-4e97-8ae7-d998a243374e',
        applicationKey: 'admin',
        applicationName: 'Admin',
        applicationStatus: 'active',
        applicationUrl: 'https://admin.veritone.com',
        ownerOrganizationId: 1234
      }
    ];
    const isDiscovery = true;

    const wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={noop}
          enabledApps={enabledApps}
          isDiscovery={isDiscovery}
        />
      </div>
    );
    expect(wrapper.find('button')).toHaveLength(3);
  });

  it('doesnt renders settings button if app is not discovery', function() {
    const enabledApps = [
      {
        applicationIconUrl:
          'https://static.veritone.com/veritone-ui/appicons-2/admin.png',
        applicationId: 'ea1d26ab-0d29-4e97-8ae7-d998a243374e',
        applicationKey: 'admin',
        applicationName: 'Admin',
        applicationStatus: 'active',
        applicationUrl: 'https://admin.veritone.com',
        ownerOrganizationId: 768256565
      }
    ];
    const isDiscovery = false;

    const wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={noop}
          enabledApps={enabledApps}
          isDiscovery={isDiscovery}
        />
      </div>
    );
    expect(wrapper.find('button')).toHaveLength(2);
  });

  it('doesnt renders settings button if admin app is not enabled', function() {
    const enabledApps = [];
    const isDiscovery = true;

    const wrapper = mount(
      <div>
        <InnerProfileMenu
          user={testUser}
          onLogout={noop}
          onEditProfile={noop}
          enabledApps={enabledApps}
          isDiscovery={isDiscovery}
        />
      </div>
    );
    expect(wrapper.find('button')).toHaveLength(2);
  });
});
