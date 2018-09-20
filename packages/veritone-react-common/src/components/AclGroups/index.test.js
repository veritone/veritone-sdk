import React from 'react';
import { mount } from 'enzyme';
import SelectAclGroupDialog from './SelectAclGroupDialog/index';
import { generateOrganizations } from './test-helpers';
import AclGroups from './index';

describe('Acl Groups', () => {
  const onAclsChange = jest.fn();

  it('should render acl groups', () => {
    const wrapper = mount(
      <AclGroups
        organizations={generateOrganizations(3, 2, 'viewer')}
        defaultPermission={'viewer'}
        onAclsChange={onAclsChange}
        description={'Acl groups description'}
      />
    );
    expect(wrapper.find('.selectAclGroupButton')).toHaveLength(1);
    expect(wrapper.find('.titleDescription').text()).toEqual(
      'Acl groups description'
    );
    expect(wrapper.find('.aclRow')).toHaveLength(2);
    expect(wrapper.find('.aclRowLabel')).toHaveLength(2);
    expect(wrapper.find('IconButton.aclRowDeleteIcon')).toHaveLength(2);
  });

  it('should remove acl group', () => {
    const acls = generateOrganizations(3, 2, 'viewer');
    const wrapper = mount(
      <AclGroups
        organizations={acls}
        defaultPermission={'viewer'}
        onAclsChange={onAclsChange}
        description={'Acl groups description'}
      />
    );
    expect(wrapper.find('.aclRow')).toHaveLength(2);
    wrapper
      .find('IconButton.aclRowDeleteIcon')
      .first()
      .simulate('click');
    const expectedAcls = {
      orgId1: {
        id: 'orgId1',
        name: 'Organization 1',
        permission: null
      }
    };
    expect(onAclsChange).toHaveBeenCalledWith(expectedAcls);4
  });

  it('should render select acl groups dialog', () => {
    const wrapper = mount(
      <AclGroups
        organizations={generateOrganizations(3, 1, 'viewer')}
        defaultPermission={'viewer'}
        onAclsChange={onAclsChange}
        description={'Acl groups description'}
      />
    );

    wrapper
      .find('.selectAclGroupButton')
      .find('Button')
      .simulate('click');

    const selectAclGroupDialogElement = wrapper.find(SelectAclGroupDialog);
    expect(selectAclGroupDialogElement).toHaveLength(1);
    expect(
      selectAclGroupDialogElement.find('.tableOrganizationNameCell')
    ).toHaveLength(3);
    expect(selectAclGroupDialogElement.find('Checkbox')).toHaveLength(3);
    expect(
      selectAclGroupDialogElement
        .find('Checkbox')
        .first()
        .props().checked
    ).toEqual(true);
    expect(selectAclGroupDialogElement.find('.actionButtonLabel')).toHaveLength(
      2
    );
  });

  it('should add acl group through dialog', () => {
    const wrapper = mount(
      <AclGroups
        organizations={generateOrganizations(3)}
        defaultPermission={'viewer'}
        onAclsChange={onAclsChange}
        description={'Acl groups description'}
      />
    );

    wrapper
      .find('.selectAclGroupButton')
      .find('Button')
      .simulate('click');

    const selectAclGroupDialogElement = wrapper.find(SelectAclGroupDialog);
    selectAclGroupDialogElement
      .find('.tableOrganizationNameCell')
      .first()
      .simulate('click');
    selectAclGroupDialogElement
      .find('.selectAclGroupActionButtons')
      .find('Button')
      .last()
      .simulate('click');

    const expectedAcls = {
      orgId1: {
        id: 'orgId1',
        name: 'Organization 1',
        permission: 'viewer'
      }
    };
    expect(onAclsChange).toHaveBeenCalledWith(expectedAcls);
  });

  it('should remove acl group through dialog', () => {
    const wrapper = mount(
      <AclGroups
        organizations={generateOrganizations(3, 2, 'viewer')}
        defaultPermission={'viewer'}
        onAclsChange={onAclsChange}
        description={'Acl groups description'}
      />
    );

    wrapper
      .find('.selectAclGroupButton')
      .find('Button')
      .simulate('click');

    const selectAclGroupDialogElement = wrapper.find(SelectAclGroupDialog);
    selectAclGroupDialogElement
      .find('.tableOrganizationNameCell')
      .first()
      .simulate('click');
    selectAclGroupDialogElement
      .find('.selectAclGroupActionButtons')
      .find('Button')
      .last()
      .simulate('click');

    const expectedAcls = {
      orgId1: {
        id: 'orgId1',
        name: 'Organization 1',
        permission: null
      }
    };
    expect(onAclsChange).toHaveBeenCalledWith(expectedAcls);
  });
});
