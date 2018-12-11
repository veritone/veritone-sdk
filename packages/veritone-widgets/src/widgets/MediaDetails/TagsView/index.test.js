import React from 'react';
import { mount } from "enzyme/build";
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TagsView from './index';
import TagEditForm from './TagEditForm';

import styles from './styles.scss';

const mockStore = configureMockStore();

const testTags = [
  {
    value: 'hello',
    key: 'world'
  },
  {
    hello: 'world'
  }
];

describe('TagsView', () => {
  it('should display a title if props.editModeEnabled is false', () => {
    const store = mockStore({
      form: {
        tagEditFormMDP: {
          values: {
            tags: []
          },
          initial: {
            tags: []
          }
        }
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <TagsView
          tags={[]}
          editModeEnabled={false}
        />
      </Provider>
    );
    expect(wrapper.exists(`.${styles.tagsTitle}`)).toEqual(true);
  });

  it('should not display a title if props.editModeEnabled is true', () => {
    const store = mockStore({
      form: {
        tagEditFormMDP: {
          values: {
            tags: []
          },
          initial: {
            tags: []
          }
        }
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <TagsView
          tags={[]}
          editModeEnabled
        />
      </Provider>
    );
    expect(wrapper.exists(`.${styles.tagsTitle}`)).toEqual(false);
  });

  it('should not display "No Tags" view if props.tags is empty', () => {
    const store = mockStore({
      form: {
        tagEditFormMDP: {
          values: {
            tags: []
          },
          initial: {
            tags: []
          }
        }
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <TagsView
          tags={[]}
        />
      </Provider>
    );
    expect(wrapper.exists(`.${styles.noTags}`)).toEqual(true);
    expect(wrapper.exists(`.${styles.noTagsText}`)).toEqual(true);
    expect(wrapper.exists(`.${styles.noTagsSubText}`)).toEqual(true);
    expect(wrapper.exists(`.${styles.tagsButtonContainer}`)).toEqual(true);
  });

  it('should call props.onEditButtonClick when "Add Tags" button is clicked', () => {
    const store = mockStore({
      form: {
        tagEditFormMDP: {
          values: {
            tags: []
          },
          initial: {
            tags: []
          }
        }
      }
    });
    const onEditClicked = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <TagsView
          tags={[]}
          onEditButtonClick={onEditClicked}
        />
      </Provider>
    );
    const addTagsButton = wrapper.find(`.${styles.tagsButtonContainer}`).find(Button);
    addTagsButton.simulate('click');
    expect(onEditClicked).toHaveBeenCalled();
  });

  it('should display edit tags pencil icons if props.tags.length > 0 and props.editModeEnabled is false', () => {
    const store = mockStore({
      form: {
        tagEditFormMDP: {
          values: {
            tags: []
          },
          initial: {
            tags: []
          }
        }
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <TagsView
          tags={testTags}
          showEditButton
          editModeEnabled={false}
        />
      </Provider>
    );
    expect(wrapper.exists(`.${styles.editButton}`)).toEqual(true);
  });

  it('should display edit tags pencil icons if props.tags.length > 0 and props.editModeEnabled is false', () => {
    const store = mockStore({
      form: {
        tagEditFormMDP: {
          values: {
            tags: []
          },
          initial: {
            tags: []
          }
        }
      }
    });
    const onEditClicked = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <TagsView
          tags={testTags}
          showEditButton
          editModeEnabled={false}
          onEditButtonClick={onEditClicked}
        />
      </Provider>
    );
    wrapper.find(`.${styles.editButton}`).first().simulate('click');
    expect(onEditClicked).toHaveBeenCalled();
  });

  it('should display each tag if props.editModeEnabled is false', () => {
    const store = mockStore({
      form: {
        tagEditFormMDP: {
          values: {
            tags: []
          },
          initial: {
            tags: []
          }
        }
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <TagsView
          tags={testTags}
          editModeEnabled={false}
        />
      </Provider>
    );
    expect(wrapper.find(`.${styles.tagsContainer}`).find(Typography).length).toEqual(testTags.length);
  });

  it('should display TagEditForm if props.editModeEnabled is true', () => {
    const store = mockStore({
      form: {
        tagEditFormMDP: {
          values: {
            tags: []
          },
          initial: {
            tags: []
          }
        }
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <TagsView
          tags={[]}
          editModeEnabled
        />
      </Provider>
    );
    expect(wrapper.find(TagEditForm).exists()).toEqual(true);
  });
});
