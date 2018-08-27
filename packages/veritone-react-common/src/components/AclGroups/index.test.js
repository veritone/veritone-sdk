import React from 'react';
import { mount } from 'enzyme';
import SelectAclGroupDialog from './SelectAclGroupDialog/index';
import { generateAcls, generateOrganizations } from './test-helpers';
import AclGroups from './index';

describe('Acl Groups', () => {
  const onAclsChange = jest.fn();

  it('should render acl groups', () => {
    const wrapper = mount(
      <AclGroups
        acls={generateAcls(2, 'viewer')}
        organizations={generateOrganizations(3)}
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
    const acls = generateAcls(2, 'viewer');
    const wrapper = mount(
      <AclGroups
        acls={acls}
        organizations={generateOrganizations(3)}
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
    const secondAcl = acls[1];
    expect(onAclsChange).toHaveBeenCalledWith([secondAcl]);
  });

  it('should render select acl groups dialog', () => {
    const wrapper = mount(
      <AclGroups
        acls={generateAcls(1, 'viewer')}
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

    const expectedAcl = {
      organizationId: 'orgId1',
      permission: 'viewer'
    };
    expect(onAclsChange).toHaveBeenCalledWith([expectedAcl]);
  });

  it('should remove acl group through dialog', () => {
    const wrapper = mount(
      <AclGroups
        acls={generateAcls(2, 'viewer')}
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

    const expectedAcl = {
      organizationId: 'orgId2',
      permission: 'viewer'
    };
    expect(onAclsChange).toHaveBeenCalledWith([expectedAcl]);
  });
});
