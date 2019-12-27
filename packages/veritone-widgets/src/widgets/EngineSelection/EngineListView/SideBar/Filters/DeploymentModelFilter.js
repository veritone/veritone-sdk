import React from 'react';
import { func, shape, string, any } from 'prop-types';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/styles';

import styles from '../styles';

class DeploymentModelFilter extends React.Component {
  static propTypes = {
    id: string.isRequired,
    filters: shape({
      deploymentModel: string
    }).isRequired,
    filterBy: func.isRequired,
    classes: shape({ any }),
  };

  handleChange = event => {
    this.props.filterBy(this.props.id, {
      type: 'deploymentModel',
      value: event.target.value
    });
  };

  render() {
    const deploymentModels = {
      FullyNetworkIsolated: 'Network Isolated',
      MostlyNetworkIsolated: 'External Access',
      NonNetworkIsolated: 'External Processing',
      HumanReview: 'Human Review'
    };
    const { classes } = this.props;

    return (
      <div className={classes.filterContainer}>
        {Object.keys(deploymentModels).map(deploymentModel => (
          <div className={classes.inlineFilter} key={deploymentModel}>
            <Radio
              color="primary"
              classes={{ root: classes.radio }}
              checked={this.props.filters.deploymentModel === deploymentModel}
              onChange={this.handleChange}
              value={deploymentModel}
              aria-label={deploymentModel}
            />
            {deploymentModels[deploymentModel]}
          </div>
        ))}
      </div>
    );
  }
}

export default {
  label: 'Deployment Model',
  id: 'deploymentModel',
  component: withStyles(styles)(DeploymentModelFilter)
};
