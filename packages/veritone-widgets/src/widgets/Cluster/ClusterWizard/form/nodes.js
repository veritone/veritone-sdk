import React from 'react';
import {
  shape,
  string,
  arrayOf,
  func,
  objectOf,
  any,
  object
} from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form';
import {
  formComponents,
  NullState,
  Table,
  Column,
  DualStateIcon
} from 'veritone-react-common';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import { get, omit, isFunction, head, uniqueId } from 'lodash';

import wizardConfig from '../wizard-config';
import styles from '../../styles/wizard.scss';
import NullStateImg from '../../images/nodes-null.png';

const { TextField, Select } = formComponents;
const selector = formValueSelector(wizardConfig.formName);

const configFields = [
  ['mgt', 'Management'],
  ['svc', 'Service'],
  ['db', 'Database'],
  ['eng', 'Engine']
];

@connect(state => ({
  nodes: selector(state, 'nodes')
}))
@reduxForm({
  form: wizardConfig.formName,
  validate: wizardConfig.model.validate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})
export default class ClusterNodes extends React.Component {
  static propTypes = {
    fields: shape({
      nodes: string
    }).isRequired,
    // redux-form supplied props
    nodes: arrayOf(object)
  };
  render() {
    return (
      <div className={styles['cluster-wizard-view']}>
        <div className={styles['cluster-heading']}>
          <div>
            <p className={styles['cluster-headline']}>Nodes</p>
            <span className={styles['cluster-text']}>
              Clusters require a minimum of one (1) of each role. Run the{' '}
              <strong>curl command</strong> on your node to automatically
              configure it.
            </span>
          </div>
          <div className={styles['help-text']}>
            <span className="icon-help2" />
            <span>
              Need help? Check out the{' '}
              <a href="#">How to Configure Nodes in aiWARE On-Premise</a>
            </span>
          </div>
        </div>
        <FieldArray
          name={this.props.fields.nodes}
          component={ClusterNodesList}
        />
      </div>
    );
  }
}

class ClusterNodesList extends React.Component {
  state = {
    snackbarIsOpen: false
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.fields.length !== this.props.fields.length;
  }

  renderNodeName = (nodeName, data, dataKey, nodeIdx) => {
    return (
      <Field
        name={`${this.props.fields.name}[${nodeIdx}].${dataKey}`}
        component={TextInputToggleField}
        placeholder={`node-${nodeIdx + 1}`}
        className={styles['text-toggle-field']}
        inputProps={{
          className: styles['text-toggle-field'],
          style: {
            width: '175px'
          }
        }}
      />
    );
  };
  renderIPAddr = (ipAddr, data, dataKey, nodeIdx) => {
    return (
      <Field
        name={`${this.props.fields.name}[${nodeIdx}].${dataKey}`}
        component={TextInputToggleField}
        placeholder="—.—.—.—.—"
        className={styles['text-toggle-field']}
        inputProps={{
          className: styles['text-toggle-field'],
          style: {
            width: '100px'
          }
        }}
      />
    );
  };
  renderDiskSelect = (disk, data, dataKey, nodeIdx) => {
    return (
      <Field
        name={`${this.props.fields.name}[${nodeIdx}].${dataKey}`}
        component={Select}
        displayEmpty
        classes={{
          root: styles['size-select']
        }}
      >
        <MenuItem value="" disabled>
          <em>{'--'}</em>
        </MenuItem>
        <MenuItem value={250}>250GB</MenuItem>
        <MenuItem value={500}>500GB</MenuItem>
        <MenuItem value={1000}>1TB</MenuItem>
        <MenuItem value={2000}>2TB</MenuItem>
        <MenuItem value={4000}>4TB</MenuItem>
      </Field>
    );
  };
  renderCPUSelect = (cpu, data, dataKey, nodeIdx) => {
    return (
      <Field
        name={`${this.props.fields.name}[${nodeIdx}].${dataKey}`}
        component={Select}
        displayEmpty
        classes={{
          root: styles['size-select']
        }}
      >
        <MenuItem value="" disabled>
          <em>{'--'}</em>
        </MenuItem>
        <MenuItem value={2}>2 CPU</MenuItem>
        <MenuItem value={4}>4 CPU</MenuItem>
        <MenuItem value={8}>8 CPU</MenuItem>
        <MenuItem value={16}>16 CPU</MenuItem>
        <MenuItem value={32}>32 CPU</MenuItem>
        <MenuItem value={64}>64 CPU</MenuItem>
      </Field>
    );
  };
  renderMemorySelect = (mem, data, dataKey, nodeIdx) => {
    return (
      <Field
        name={`${this.props.fields.name}[${nodeIdx}].${dataKey}`}
        component={Select}
        displayEmpty
        classes={{
          root: styles['size-select']
        }}
      >
        <MenuItem value="" disabled>
          <em>{'--'}</em>
        </MenuItem>
        <MenuItem value={8}>8 GB</MenuItem>
        <MenuItem value={16}>16 GB</MenuItem>
        <MenuItem value={32}>32 GB</MenuItem>
        <MenuItem value={64}>64 GB</MenuItem>
        <MenuItem value={128}>128 GB</MenuItem>
        <MenuItem value={256}>256 GB</MenuItem>
      </Field>
    );
  };
  renderNodeConfig = (config, data, dataKey, nodeIdx) => {
    const { fields } = this.props;

    return (
      <div className={styles['node-config']}>
        {configFields.map(configField => {
          const config = head(configField);

          return (
            <Field
              key={uniqueId(config)}
              name={`${fields.name}[${nodeIdx}].${dataKey}.${config}`}
              component={DualStateIconField}
              props={{
                caption: configField[1],
                activeClass: styles.activeClass,
                inActiveClass: styles.inActiveClass,
                isActive: get(fields.get(nodeIdx), [dataKey, config], false)
              }}
            >
              <span className="icon-circlecheck" />
            </Field>
          );
        })}
      </div>
    );
  };
  renderNodeRemoveIcon = (val, data, dataKey, nodeIdx) => {
    return (
      <IconButton disableRipple aria-label="Remove Node">
        <DeleteIcon onClick={this.removeNode(nodeIdx)} />
      </IconButton>
    );
  };

  addNode = () => {
    this.props.fields.push({
      nodeName: '',
      ip: '',
      disk: '',
      cpu: '',
      mem: '',
      configs: {
        mgt: false,
        svc: false,
        db: false,
        eng: false
      }
    });
  };

  removeNode = nodeIdx => () => {
    this.props.fields.remove(nodeIdx);
  };

  closeSnackBar = () => {
    this.setState({
      snackbarIsOpen: false
    });
  };

  render() {
    return (
      <div className="cluster-nodes-list">
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={this.state.snackbarIsOpen}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
            className: styles['snack-notification']
          }}
          message={
            <span id="message-id" className={styles['snack-notification-msg']}>
              Your current configuration may affect performance.<br />
              See <a href="#">Node Configuration</a> for details.
            </span>
          }
          action={
            <Button
              variant="flat"
              color="primary"
              size="small"
              className={styles['snack-notification-btn']}
              onClick={this.closeSnackBar}
            >
              Dismiss
            </Button>
          }
        />
        <AddNewNode onClick={this.addNode} />
        {this.props.fields.length ? (
          <Table
            rowGetter={this.props.fields.get}
            rowCount={this.props.fields.length}
            rowHeight={90}
            showHeader
          >
            <Column
              dataKey="nodeName"
              header="Node Name"
              cellRenderer={this.renderNodeName}
              width="250px"
            />
            <Column
              dataKey="ip"
              header="IP Address"
              cellRenderer={this.renderIPAddr}
              width="200px"
            />
            <Column
              dataKey="configs"
              header=""
              cellRenderer={this.renderNodeConfig}
            />
            <Column
              dataKey="disk"
              header="Disk"
              cellRenderer={this.renderDiskSelect}
              width="100px"
            />
            <Column
              dataKey="cpu"
              header="CPU"
              cellRenderer={this.renderCPUSelect}
              width="100px"
            />
            <Column
              dataKey="mem"
              header="Memory"
              cellRenderer={this.renderMemorySelect}
              width="100px"
            />
            <Column
              dataKey=""
              header=""
              cellRenderer={this.renderNodeRemoveIcon}
              align="right"
            />
          </Table>
        ) : (
          <ClusterNodesNullState />
        )}
      </div>
    );
  }
}

ClusterNodesList.propTypes = {
  fields: objectOf(any).isRequired
};

const AddNewNode = ({ onClick }) => {
  return (
    <Paper
      classes={{
        root: styles['cluster-add-node']
      }}
    >
      <Button variant="flat" color="primary" disableRipple onClick={onClick}>
        ADD NODE MANUALLY
      </Button>
    </Paper>
  );
};

AddNewNode.propTypes = {
  onClick: func.isRequired
};

const ClusterNodesNullState = () => {
  return (
    <div>
      <NullState
        titleText="No Nodes Yet"
        imgSrc={NullStateImg}
        imgProps={{
          style: {
            marginBottom: '30px'
          }
        }}
      >
        <span
          style={{ textAlign: 'center' }}
          className={styles['cluster-text']}
        >
          Add devices to your cluster by clicking “ADD NODE MANUALLY”<br />
          If you need help get started, take a look at the<br />
          <a href="#">How to Add Nodes to aiWARE Clusters</a>
        </span>
      </NullState>
    </div>
  );
};

class TextInputToggleField extends React.Component {
  static propTypes = {
    className: string,
    placeholder: string,
    input: shape({
      value: string,
      onBlur: func
    }),
    meta: shape({
      error: string
    })
  };

  state = {
    isEditMode: false
  };

  toggleEdit = boolVal => () => {
    if (this.state.isEditMode !== boolVal) {
      this.setState({
        isEditMode: boolVal
      });
    }
  };

  handleBlur = e => {
    const { input, meta } = this.props;
    e.persist();

    if (!meta.error) {
      this.setState(
        {
          isEditMode: false
        },
        () => {
          if (isFunction(input.onBlur)) {
            input.onBlur(e, e.target.value);
          }
        }
      );
      return;
    }

    return input.onBlur(e, e.target.value);
  };

  render() {
    const {
      meta: { touched, error }
    } = this.props;
    const showEditState = this.state.isEditMode || (touched && error);

    return (
      <div className={styles['toggle-field-wrapper']}>
        {showEditState ? (
          <TextField
            InputProps={{
              disableUnderline: !showEditState,
              readOnly: !showEditState
            }}
            FormHelperTextProps={{
              style: {
                fontStyle: 'italic'
              }
            }}
            {...omit(this.props, 'placeholder')}
            onBlur={this.handleBlur}
          />
        ) : (
          <span className={this.props.className}>
            {this.props.input.value || this.props.placeholder}
          </span>
        )}
        <EditIcon
          className={styles['edit-icon']}
          onClick={this.toggleEdit(true)}
        />
      </div>
    );
  }
}

const DualStateIconField = ({ input, ...rest }) => {
  function handleIconClick(boolVal) {
    input.onChange(boolVal);
  }

  return <DualStateIcon {...omit(rest, 'meta')} onClick={handleIconClick} />;
};

DualStateIconField.propTypes = {
  input: shape({
    onChange: func.isRequired
  })
};
