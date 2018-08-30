import React from 'react';
import {
  shape,
  string,
  arrayOf,
  func,
  objectOf,
  any,
  number,
  object,
  oneOfType
} from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { formComponents, NullState, withMuiThemeProvider, Table, Column, DualStateIcon } from 'veritone-react-common';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MenuItem from '@material-ui/core/MenuItem';
import { get, pick, omit, isFunction, map, head, uniqueId } from 'lodash';

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
  initialValues: {
    nodes: []
  },
  validate: wizardConfig.validate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})
@withMuiThemeProvider
export default class ClusterNodes extends React.Component {
  static propTypes = {
    fields: shape({
      nodes: string
    }).isRequired,
    fieldValidations: shape({
      nodes: shape({
        name: func,
        ip: func
      })
    }),
    // redux-form supplied props
    nodes: arrayOf(object),
    array: objectOf(any).isRequired,
    change: func.isRequired
  };

  state = {
    nodes: 0
  };

  addNode = () => {
    const { array, fields } = this.props;

    array.push(fields.nodes, {
      nodeName: '',
      ip: '',
      disk: '',
      cpu: '',
      mem: '',
      mgt: [],
      svc: [],
      db: [],
      eng: []
    });
  };

  removeNode = nodeIdx => {
    const { nodes } = this.props;
    const newNodes = nodes.slice(0, nodeIdx).concat(nodes.slice(nodeIdx + 1));

    this.props.change(this.props.fields.nodes, newNodes);
  };

  updateNodeConfig = (nodeIdx, config, value) => {
    const { fields, nodes } = this.props;
    const configFieldKeys = map(configFields, head);

    configFieldKeys.forEach(cfk => {
      const fldVal = get(nodes, [nodeIdx, cfk], []);

      if (fldVal.length) {
        this.props.change(`${fields.nodes}[${nodeIdx}].${cfk}`, [{
          ...fldVal[0],
          [config]: value
        }]);
      }
    });
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
        <div className="cluster-nodes-list">
          <AddNewNode onClick={this.addNode} />
          {this.props.nodes && this.props.nodes.length
          ?
            <ClusterNodesList
              nodes={this.props.nodes}
              fields={this.props.fields}
              validations={this.props.fieldValidations}
              onRemoveNode={this.removeNode}
              onConfigChange={this.updateNodeConfig}
            />
          :
            <ClusterNodesNullState />
          }
        </div>
      </div>
    );
  }
}



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
        <span style={{ textAlign: 'center' }} className={styles['cluster-text']}>
          Add devices to your cluster by clicking “ADD NODE MANUALLY”<br />
          If you need help get started, take a look at the<br />
          <a href="#">How to Add Nodes to aiWARE Clusters</a>
        </span>
      </NullState>
    </div>
  )
}

const ClusterNodesList = ({ nodes, fields, validations, onRemoveNode, onConfigChange }) => {
  const handleConfigChange = (node, config) => (e, val) => {
    onConfigChange(node, config, val);
  }

  function getRowData(row) {
    return nodes[row];
  }
  function renderNodeName(nodeName, data, nodeIdx) {
    return (
      <Field
        name={`${fields.nodes}[${nodeIdx}].nodeName`}
        component={TextFieldToggle}
        placeholder={`node-${nodeIdx + 1}`}
        validate={validations[fields.nodes].name}
        className={styles['text-toggle-field']}
        inputProps={{
          className: styles['text-toggle-field'],
          style: {
            width: '175px'
          }
        }}
      />
    );
  }
  function renderIPAddr(ipAddr, data, nodeIdx) {
    return (
      <Field
        name={`${fields.nodes}[${nodeIdx}].ip`}
        component={TextFieldToggle}
        placeholder="—.—.—.—.—"
        onBlur={handleConfigChange(nodeIdx, 'ip')}
        validate={validations[fields.nodes].ip}
        className={styles['text-toggle-field']}
        inputProps={{
          className: styles['text-toggle-field'],
          style: {
            width: '100px'
          }
        }}
      />
    );
  }
  function renderDiskSelect(disk, data, nodeIdx) {
    return (
      <Field
        name={`${fields.nodes}[${nodeIdx}].disk`}
        component={Select}
        displayEmpty
        classes={{
          root: styles['size-select']
        }}
        onChange={handleConfigChange(nodeIdx, 'disk')}
      >
        <MenuItem value="" disabled>
          <em>{"--"}</em>
        </MenuItem>
        <MenuItem value={250}>250GB</MenuItem>
        <MenuItem value={500}>500GB</MenuItem>
        <MenuItem value={1000}>1TB</MenuItem>
        <MenuItem value={2000}>2TB</MenuItem>
        <MenuItem value={4000}>4TB</MenuItem>
      </Field>
    )
  }
  function renderCPUSelect(cpu, data, nodeIdx) {
    return (
      <Field
        name={`${fields.nodes}[${nodeIdx}].cpu`}
        component={Select}
        displayEmpty
        classes={{
          root: styles['size-select']
        }}
        onChange={handleConfigChange(nodeIdx, 'cpu')}
      >
        <MenuItem value="" disabled>
          <em>{"--"}</em>
        </MenuItem>
        <MenuItem value={2}>2 CPU</MenuItem>
        <MenuItem value={4}>4 CPU</MenuItem>
        <MenuItem value={8}>8 CPU</MenuItem>
        <MenuItem value={16}>16 CPU</MenuItem>
        <MenuItem value={32}>32 CPU</MenuItem>
        <MenuItem value={64}>64 CPU</MenuItem>
      </Field>
    )
  }
  function renderMemorySelect(mem, data, nodeIdx) {
    return (
      <Field
        name={`${fields.nodes}[${nodeIdx}].mem`}
        component={Select}
        displayEmpty
        classes={{
          root: styles['size-select']
        }}
        onChange={handleConfigChange(nodeIdx, 'mem')}
      >
        <MenuItem value="" disabled>
          <em>{"--"}</em>
        </MenuItem>
        <MenuItem value={8}>8 GB</MenuItem>
        <MenuItem value={16}>16 GB</MenuItem>
        <MenuItem value={32}>32 GB</MenuItem>
        <MenuItem value={64}>64 GB</MenuItem>
        <MenuItem value={128}>128 GB</MenuItem>
        <MenuItem value={256}>256 GB</MenuItem>
      </Field>
    )
  }
  function renderNodeConfig(config, data, nodeIdx) {
    function normalizeVal(value, previousValue, allValues) {
      if (!value) {
        return [];
      }

      const node = get(allValues, [fields.nodes, nodeIdx]);
      const configVals = pick(node, ['ip', 'cpu', 'disk', 'mem']);

      return [configVals];
    }
    return (
      <div className={styles['node-config']}>
        {configFields.map((configField) => {
          return (
            <Field
              key={uniqueId(configField[0])}
              name={`${fields.nodes}[${nodeIdx}].${configField[0]}`}
              component={DualStateIconField}
              normalize={normalizeVal}
              props={{
                caption: configField[1],
                activeClass: styles.activeClass,
                inActiveClass: styles.inActiveClass,
                isActive: !!get(nodes, [nodeIdx, configField[0], 'length'])
              }}
            >
              <span className="icon-circlecheck" />
            </Field>
          )
        })}
      </div>
    )
  }
  function renderNodeRemoveIcon(val, data, row) {
    return (
      <IconButton disableRipple aria-label="Remove Node">
        <DeleteIcon onClick={handleRemoveNode(row)} />
      </IconButton>
    );
  }

  function handleRemoveNode(row) {
    return () => onRemoveNode(row);
  }

  return (
    <Table rowGetter={getRowData} rowCount={nodes.length} rowHeight={90} showHeader>
      <Column dataKey="nodeName" header="Node Name" cellRenderer={renderNodeName} width="250px" />
      <Column dataKey="ip" header="IP Address" cellRenderer={renderIPAddr} width="200px" />
      <Column dataKey="" header="" cellRenderer={renderNodeConfig} />
      <Column dataKey="disk" header="Disk" cellRenderer={renderDiskSelect} width="100px" />
      <Column dataKey="cpu" header="CPU" cellRenderer={renderCPUSelect} width="100px" />
      <Column dataKey="mem" header="Memory" cellRenderer={renderMemorySelect} width="100px" />
      <Column dataKey="" header="" cellRenderer={renderNodeRemoveIcon} align="right" />
    </Table>
  );
}

ClusterNodesList.propTypes = {
  nodes: arrayOf(shape({
    nodeName: string,
    ip: string,
    disk: oneOfType([number, string]),
    cpu: oneOfType([number, string]),
    mem: oneOfType([number, string])
  })).isRequired,
  fields: objectOf(string).isRequired,
  validations: objectOf(any).isRequired,
  onRemoveNode: func.isRequired,
  onConfigChange: func.isRequired
}

const AddNewNode = ({ onClick }) => {
  return (
    <Paper
      classes={{
        root: styles['cluster-add-node']
      }}
    >
      <Button
        variant="flat"
        color="primary"
        disableRipple
        onClick={onClick}
      >
        ADD NODE MANUALLY
      </Button>
    </Paper>
  )
}

AddNewNode.propTypes = {
  onClick: func.isRequired
}

class TextFieldToggle extends React.Component {
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
  }

  state = {
    isEditMode: false
  }

  toggleEdit = (boolVal) => () => {
    if (this.state.isEditMode !== boolVal) {
      this.setState({
        isEditMode: boolVal
      });
    }
  }

  handleBlur = (e) => {
    const { input, meta } = this.props;
    e.persist();

    if (!meta.error)  {
      this.setState({
        isEditMode: false
      }, () => {
        if (isFunction(input.onBlur)) {
          input.onBlur(e, e.target.value);
        }
      });
      return;
    }

    return input.onBlur(e, e.target.value);
  }

  render() {
    const showEditState = this.state.isEditMode || this.props.meta.error;

    return (
      <div className={styles['toggle-field-wrapper']}>
        {showEditState
        ?
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
          :
          <span className={this.props.className}>
            {this.props.input.value || this.props.placeholder}
          </span>}
        <EditIcon className={styles['edit-icon']} onClick={this.toggleEdit(true)} />
      </div>
    )
  }
}

const DualStateIconField = ({ input, ...rest }) => {
  function handleIconClick(boolVal) {
    input.onChange(boolVal);
  }

  return (
    <DualStateIcon
      {...omit(rest, 'meta')}
      onClick={handleIconClick}
    />
  )
}

DualStateIconField.propTypes = {
  input: shape({
    onChange: func.isRequired
  })
};
