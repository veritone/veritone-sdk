import React from 'react';
import { shape, func, string, arrayOf } from 'prop-types';
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useDrop } from 'react-dnd';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import cx from 'classnames';
import DragLayer from './DragLayer';
import Block, { blockTypes } from './FormBlocks';
import formItems, { PreviewWrapper } from './FormItems';
import FormConfiguration from './FormConfiguration';
import PreviewDialog from './PreviewDialog';
import { form as formType } from './configuration';
import { generateSchema } from './utils';
import * as blockUtils from './blockUtils';
import typeConfiguration, { initData } from './typeConfiguration';

import styles from './styles.scss';

function formEqual({ form }, { form: nextForm }) {
  return _.isEqual(form, nextForm);
}

function FormBuilderComponent({
  form,
  addBlock,
  swapBlock,
  updateBlock,
  removeBlock,
  selectBlock
}) {
  const [isPreview, setIsPreview] = React.useState(false);

  const [, drop] = useDrop({
    accept: formType,
    drop: item => {
      if (isNaN(item.index) && form.length === 0) {
        addBlock(0, item.id);
        item.index = 0;
      }
    }
  });

  const onUpdateForm = React.useCallback(
    ({ name, value }) => {
      const updateIndex = form.findIndex(formItem => formItem.selected);
      updateBlock(updateIndex, { [name]: value });
    }, [updateBlock, form]);

  const handleClickPreview = React.useCallback(() => {
    setIsPreview(x => !x);
  }, []);

  const onBlockClick = React.useCallback((type) => {
    addBlock(form.length, type);
  }, [addBlock, form]);

  const configurationOpen = form.filter(formItem => formItem.selected);

  return (
    <div className={cx(styles['form-builder'])}>
      <div className={cx(styles['form-blocks'])}>
        <div className={styles['blocks-wrapper']}>
          {blockTypes.map(block => (
            <Block
              key={block.type}
              {...block}
              onCancel={removeBlock}
              onClick={onBlockClick}
            />
          ))}
        </div>
        <hr />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClickPreview}
        >
          Preview
          </Button>
        {isPreview && (
          <PreviewDialog
            form={form}
            handleClose={handleClickPreview}
          />
        )}
      </div>
      <div className={styles['blocks-preview']}>
        <div ref={drop}>
          {form.map((block, index) => {
            const BlockItem = formItems[block.type];
            return (
              <PreviewWrapper
                index={index}
                key={block.name}
                selected={block.selected}
                addBlock={addBlock}
                swapBlock={swapBlock}
                updateBlock={updateBlock}
                removeBlock={removeBlock}
                selectBlock={selectBlock}
              >
                <BlockItem {...block} name={`preview-${block.name}`} />
              </PreviewWrapper>
            );
          })}
          {
            <pre>
              {JSON.stringify(generateSchema(form), null, 2)}
            </pre>
          }
        </div>
      </div>
      <div className={styles['configuration-container']}>
        {
          (configurationOpen.length > 0) && (
            <FormConfiguration
              onChange={onUpdateForm}
              {...configurationOpen[0]}
            />
          )
        }
      </div>
    </div>
  );
}

const formPropType = arrayOf(
  shape({
    type: string,
    name: string
  })
);

FormBuilderComponent.propTypes = {
  form: formPropType,
  addBlock: func,
  swapBlock: func,
  removeBlock: func,
  selectBlock: func,
  updateBlock: func,
}

FormBuilderComponent.defaultProps = {
  addBlock: _.noop,
  swapBlock: _.noop,
  removeBlock: _.noop,
  selectBlock: _.noop,
  updateBlock: _.noop,
  form: []
}

const FormBuilderComponentMemo = React.memo(FormBuilderComponent, formEqual);

function FormBuilder({ form, onChange }) {
  const addBlock = React.useCallback((index, type) => {
    const name = `${type}-${(new Date()).getTime()}`;
    const item = typeConfiguration[type]
      .slice(1)
      .reduce((data, type) => ({
        ...data,
        [type]: initData[type]
      }), { type, name });
    onChange(blockUtils.add(index, form, item));
  }, [onChange, form]);

  const removeBlock = React.useCallback((index) => {
    onChange(blockUtils.remove(index, form));
  }, [onChange, form]);

  const updateBlock = React.useCallback((index, item) => {
    onChange(blockUtils.update(index, form, item));
  }, [onChange, form]);

  const swapBlock = React.useCallback((from, to) => {
    onChange(blockUtils.swap({ from, to }, form));
  }, [onChange, form]);

  const selectBlock = React.useCallback((index) => {
    onChange(blockUtils.select(index, form));
  }, [onChange, form]);

  return (
    <DndProvider backend={HTML5Backend}>
      <DragLayer />
      <FormBuilderComponentMemo
        form={form}
        addBlock={addBlock}
        removeBlock={removeBlock}
        updateBlock={updateBlock}
        swapBlock={swapBlock}
        selectBlock={selectBlock}
      />
    </DndProvider>
  )
}

FormBuilder.propTypes = {
  onChange: func,
  form: formPropType,
}

FormBuilder.defaultProps = {
  onChange: _.noop,
  form: []
}

export default FormBuilder;
