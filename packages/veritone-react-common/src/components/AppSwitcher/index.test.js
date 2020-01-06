import React from 'react';
import { sortBy, noop } from 'lodash';
import { mount } from 'enzyme';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import AppSwitcherErrorState from './AppSwitcherErrorState';
import AppSwitcherList from './AppSwitcherList';
import AppSwitcher from './';

describe('AppSwitcher', () => {
  it('Should render props.currentAppName', () => {
    const wrapper = mount(<AppSwitcher currentAppName="test-app" />);
    expect(wrapper.text()).toMatch(/test-app/);
  });

  it('should show the AppSwitcherList or appSwitcherErrorState based on props.enabledAppsFailedLoading', function() {
    // fixme once enzyme supports portals
    // const wrapper = mount(<AppSwitcher enabledAppsFailedLoading={false}/>);
    // wrapper.find('IconButton').simulate('click');
    // expect(wrapper.find('AppSwitcherList')).toHaveLength(1)
  });
});

describe('AppSwitcherErrorState', () => {
  it('Should show an error message', () => {
    const wrapper = mount(<AppSwitcherErrorState />);
    expect(wrapper.text()).toMatch(/error/i);
  });

  it('should call props.onRefresh when the retry button is clicked', function() {
    const handler = jest.fn();
    const wrapper = mount(<AppSwitcherErrorState onRefresh={handler} />);
    expect(wrapper.text()).toMatch(/error/i);

    wrapper.find(Button).simulate('click');
    expect(handler).toHaveBeenCalled();
  });
});

describe('AppSwitcherList', () => {
  const sampleApps = [
    {
      applicationId: '0',
      applicationName: 'Discovery',
      applicationIconUrl:
        'https://static.veritone.com/veritone-ui/appicons-2/discovery.png',
      applicationIconSvg:
        'https://static.veritone.com/veritone-ui/app-icons-svg/discovery-app.svg'
    },
    {
      applicationId: '1',
      applicationName: 'Test App',
      applicationIconUrl: '',
      applicationIconSvg: null
    },
    {
      applicationId: '2',
      applicationName: 'CMS',
      applicationIconUrl:
        'https://static.veritone.com/veritone-ui/appicons-2/cms.png',
      applicationIconSvg:
        'https://static.veritone.com/veritone-ui/app-icons-svg/cms-app.svg'
    }
  ];

  it('Should show each application name', () => {
    const wrapper = mount(
      <AppSwitcherList enabledApps={sampleApps} onSwitchApp={noop} />
    );

    sampleApps.forEach(({ applicationName }) =>
      expect(wrapper.text().match(applicationName)).toBeTruthy()
    );
  });

  it('Should sort apps by name', function() {
    const wrapper = mount(
      <AppSwitcherList enabledApps={sampleApps} onSwitchApp={noop} />
    );
    expect(wrapper.text()).toMatch(/.*CMS.*Discovery.*Test App/i);
  });

  it('Should link each app to its switch-app href', function() {
    const handleSwitchApp = jest.fn();
    const wrapper = mount(
      <AppSwitcherList onSwitchApp={handleSwitchApp} enabledApps={sampleApps} />
    );
    const buttons = wrapper.find(MenuItem);
    expect(buttons).toHaveLength(3);

    const sortedApps = sortBy(sampleApps, 'applicationName');
    buttons.forEach((b, i) => {
      b.simulate('click');
      expect(handleSwitchApp).toHaveBeenCalledWith(sortedApps[i].applicationId);
    });
  });

  it("Shows the app's icon by signed URL, then URL, then SVG, or a generic icon if neither exist", function() {
    let wrapper = mount(
      <AppSwitcherList
        enabledApps={[
          {
            applicationId: '0',
            applicationName: 'Discovery',
            signedApplicationIconUrl: 'https://app-icon-url-signed',
            applicationIconUrl: 'https://app-icon-url',
            applicationIconSvg: 'https://app-icon-svg'
          }
        ]}
        onSwitchApp={noop}
      />
    );
    expect(
      wrapper.containsMatchingElement(<img src="https://app-icon-url-signed" />)
    ).toBeTruthy();

    wrapper = mount(
      <AppSwitcherList
        enabledApps={[
          {
            applicationId: '0',
            applicationName: 'Discovery',
            applicationIconUrl: 'https://app-icon-url',
            applicationIconSvg: 'https://app-icon-svg'
          }
        ]}
        onSwitchApp={noop}
      />
    );
    expect(
      wrapper.containsMatchingElement(<img src="https://app-icon-url" />)
    ).toBeTruthy();

    wrapper = mount(
      <AppSwitcherList
        enabledApps={[
          {
            applicationId: '0',
            applicationName: 'Discovery',
            applicationIconSvg: 'https://app-icon-svg'
          }
        ]}
        onSwitchApp={noop}
      />
    );
    expect(
      wrapper.containsMatchingElement(<img src="https://app-icon-svg" />)
    ).toBeTruthy();

    wrapper = mount(
      <AppSwitcherList
        enabledApps={[
          {
            applicationId: '0',
            applicationName: 'Discovery'
          }
        ]}
        onSwitchApp={noop}
      />
    );
    expect(wrapper.find('span.icon-applications')).toHaveLength(1);
  });

  it('should show a message if no apps exist', function() {
    let wrapper = mount(<AppSwitcherList onSwitchApp={noop} />);
    expect(wrapper.text()).toMatch(/no applications/i);
  });
});
