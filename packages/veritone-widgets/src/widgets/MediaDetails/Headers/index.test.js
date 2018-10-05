import React from 'react';
import { mount } from 'enzyme';
import EditHeader from './EditHeader';
import Icon from '@material-ui/core/Icon';
import styles from 'styles.scss';

describe('EditHeader', () => {
  const testEngineCategory = {
    categoryType: "face",
    iconClass: "icon-test",
    name: "Test Detection"
  };
  let onClickCloseTest;
  beforeEach(() => {
    onClickCloseTest = jest.fn();
  });

  it('should render an engine category icon', () => {
    const wrapper = mount(
      <EditHeader
        onCloseButtonClick={onClickCloseTest}
        engineCategoryIconClass={testEngineCategory.iconClass}
        engineCategoryType={testEngineCategory.categoryType}
      />
    );
    expect(wrapper.find(Icon).find('.' + styles.engineCategoryIcon).exists()).toEqual(true);
  });

  it('should render a title', () => {
    const wrapper = mount(
      <EditHeader
        onCloseButtonClick={onClickCloseTest}
        engineCategoryIconClass={testEngineCategory.iconClass}
        engineCategoryType={testEngineCategory.categoryType}
      />
    );
    expect(wrapper.find('.' + styles.editHeaderTitle).exists()).toEqual(true);
  });

  it('should render a close icon', () => {
    const wrapper = mount(
      <EditHeader
        onCloseButtonClick={onClickCloseTest}
        engineCategoryIconClass={testEngineCategory.iconClass}
        engineCategoryType={testEngineCategory.categoryType}
      />
    );
    expect(wrapper.find(Icon).find('.' + styles.closeIcon).exists()).toEqual(true);
  });

  it('call props.onCloseButtonClick when close button is clicked', () => {
    const wrapper = mount(
      <EditHeader
        onCloseButtonClick={onClickCloseTest}
        engineCategoryIconClass={testEngineCategory.iconClass}
        engineCategoryType={testEngineCategory.categoryType}
      />
    );
    const closeIcon = wrapper.find(Icon).find('.' + styles.closeIcon);
    closeIcon.simulate('click');
    expect(onClickCloseTest).toHaveBeenCalled();
  });
});
