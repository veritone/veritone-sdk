import React from 'react';
import { shape, func, number, string, arrayOf } from 'prop-types';
import { useDrop } from 'react-dnd';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Block, { blockTypes } from './FormBlocks';
import formItems, { PreviewWrapper } from './FormItems';
import FormConfiguration from './FormConfiguration';
import PreviewDialog from './PreviewDialog';
import { form as formType } from './configuration';
import { generateSchema } from './utils';

import styles from './styles.scss';

function formEqual({ form }, { form: nextForm }) {
  return _.isEqual(form, nextForm);
}

function FormBuilder({
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
      if (isNaN(item.index) && form.definition.length === 0) {
        addBlock(0, item.id);
        item.index = 0;
      }
    }
  });

  const onUpdateForm = React.useCallback(
    ({ name, value }) => {
      updateBlock(form.selected, {
        ...form.definition[form.selected],
        [name]: value
      })
    }, [updateBlock]);

  const handleClickPreview = React.useCallback(() => {
    setIsPreview(x => !x);
  }, []);

  return (
    <div className={styles['form-builder']}>
      <Grid container spacing={3}>
        <Grid item xs>
          <div className={styles['blocks-wrapper']}>
            {blockTypes.map(block => (
              <Block
                key={block.type}
                {...block}
                removeBlock={removeBlock}
                addBlock={() => addBlock(form.definition.length, block.type)}
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
            <PreviewDialog form={form} handleClose={handleClickPreview} />
          )}
        </Grid>
        <Grid item xs={6}>
          <div ref={drop}>
            {form.definition.map((block, index) => {
              const BlockItem = formItems[block.type];
              return (
                <PreviewWrapper
                  index={index}
                  selected={index === form.selected}
                  key={block.name}
                  addBlock={addBlock}
                  swapBlock={swapBlock}
                  updateBlock={updateBlock}
                  removeBlock={removeBlock}
                  selectBlock={selectBlock}
                >
                  <BlockItem {...block} />
                </PreviewWrapper>
              );
            })}
            {
              <pre>
                {JSON.stringify(generateSchema(form.definition), null, 2)}
              </pre>
            }
          </div>
        </Grid>
        <Grid item xs={3}>
          {
            (form.definition.length > 0) && (
              <FormConfiguration
                onChange={onUpdateForm}
                {...form.definition[form.selected]}
              />
            )
          }
        </Grid>
      </Grid>
    </div>
  );
}

FormBuilder.propTypes = {
  form: shape({
    selected: number,
    definition: arrayOf(shape({
      type: string,
      name: string
    })),
  }),
  addBlock: func,
  swapBlock: func,
  removeBlock: func,
  selectBlock: func,
  updateBlock: func,
}

FormBuilder.defaultProps = {
  addBlock: _.noop,
  swapBlock: _.noop,
  removeBlock: _.noop,
  selectBlock: _.noop,
  updateBlock: _.noop,
  form: {
    selected: 0,
    definition: []
  }
}

export default React.memo(FormBuilder, formEqual);
