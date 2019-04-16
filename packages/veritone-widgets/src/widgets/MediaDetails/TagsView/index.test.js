import React from 'react';
import { mount } from 'enzyme/build';
import { Provider } from 'react-redux';
import { Field } from 'redux-form';
import configureMockStore from 'redux-mock-store';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import TagsView from './index';
import TagEditForm from './TagEditForm';
import TagsField from './TagsField';
import TagPill from './tagPill';

import styles from './styles.scss';

const mockStore = configureMockStore();

const testTags = [
  {
    value: 'hello'
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
        <TagsView tags={[]} editModeEnabled={false} />
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
        <TagsView tags={[]} editModeEnabled />
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
        <TagsView tags={[]} />
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
        <TagsView tags={[]} onEditButtonClick={onEditClicked} />
      </Provider>
    );
    const addTagsButton = wrapper
      .find(`.${styles.tagsButtonContainer}`)
      .find(Button);
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
        <TagsView tags={testTags} showEditButton editModeEnabled={false} />
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
    wrapper
      .find(`.${styles.editButton}`)
      .first()
      .simulate('click');
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
        <TagsView tags={testTags} editModeEnabled={false} />
      </Provider>
    );
    expect(
      wrapper.find(`.${styles.tagsContainer}`).find(Typography).length
    ).toEqual(testTags.length);
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
        <TagsView tags={[]} editModeEnabled />
      </Provider>
    );
    expect(wrapper.find(TagEditForm).exists()).toEqual(true);
  });
});

describe('TagsEditForm', () => {
  it('should render a tags field', () => {
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
        <TagEditForm form="tagEditFormMDP" />
      </Provider>
    );
    expect(wrapper.find(Field).exists()).toEqual(true);
  });

  it('should render a cancel button', () => {
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
        <TagEditForm form="tagEditFormMDP" />
      </Provider>
    );
    expect(
      wrapper
        .find(Button)
        .find('[data-veritone-element="cancel-button"]')
        .exists()
    ).toEqual(true);
  });

  it('should call props.onCancel when cancel button is clicked', () => {
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
    const onCancelClicked = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <TagEditForm form="tagEditFormMDP" onCancel={onCancelClicked} />
      </Provider>
    );
    wrapper
      .find(Button)
      .find('[data-veritone-element="cancel-button"]')
      .find('button')
      .simulate('click');
    expect(onCancelClicked).toHaveBeenCalled();
  });

  it('should render a save button', () => {
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
        <TagEditForm form="tagEditFormMDP" />
      </Provider>
    );
    expect(
      wrapper.find(Button).exists('[data-veritone-element="save-button"]')
    ).toEqual(true);
  });

  it('should call props.onSubmit when form is submitted', () => {
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
    const onSubmit = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <TagEditForm
          form="tagEditFormMDP"
          initialValues={{ tags: testTags }}
          onSubmit={onSubmit}
        />
      </Provider>
    );
    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalled();
  });
});

describe('TagsField', () => {
  const onChange = jest.fn();

  it('should render a TagPill component for each tag in input.value', () => {
    const wrapper = mount(
      <TagsField
        input={{
          onChange: onChange,
          value: testTags
        }}
      />
    );
    expect(wrapper.find(TagPill).length).toEqual(testTags.length);
  });

  it('should call input.onChange when a user enters test into TextField and presses enter', () => {
    const wrapper = mount(
      <TagsField
        input={{
          onChange: onChange,
          value: testTags
        }}
      />
    );
    const tagInput = wrapper.find(TextField).find('input');
    tagInput.simulate('change', { target: { value: 'Hello World' } });
    tagInput.simulate('keypress', { key: 'Enter' });
    expect(onChange).toHaveBeenCalled();
  });
});
