import React from 'react';
import AttachMoneyIcon from '@material-ui/icons/Apps';
import { storiesOf } from '@storybook/react';
import { makeStyles } from '@material-ui/styles';
import SideBar from './';

const Container = (
  { children } // eslint-disable-line
) => (
  <div
    style={{ width: 245, borderRight: '1px solid #E0E0E0', height: '100vh' }}
  >
    {children}
  </div>
);

const exampleSideBarMenu = {
  children: {
    overview: {
      label: 'Overview',
      iconClassName: 'icon-overview'
    },
    billing: {
      label: 'Billing Dashboard',
      icon: <AttachMoneyIcon />
    },
    engines: {
      label: 'Engines',
      iconClassName: 'icon-engines',
      children: {
        documentation: {
          label: 'Documentation',
          children: {
            api: {
              label: 'API'
            }
          }
        },
        deployments: {
          label: 'Deployments'
        },
        models: {
          label: 'Models'
        },
        public: {
          label: 'Public Engines'
        }
      }
    },
    applications: {
      label: 'Applications',
      iconClassName: 'icon-applications'
    },
    'data-schemas': {
      label: 'Data',
      iconClassName: 'icon-data'
    }
  }
};

const useStyles = makeStyles({
  iconselected: {
    color: '#2196f3',
  }
})

storiesOf('NavigationSideBar', module).add('Base', () => React.createElement(() => {
  const classes = useStyles();
  return (
    <Container>
      <StatefulSideBar
        title="Navigation"
        sections={exampleSideBarMenu}
        selectedItemClasses={{
          leftIcon: classes.iconselected
        }}
      />
    </Container>
  );
}));

class StatefulSideBar extends React.Component {
  state = {
    activePath: []
  };

  handleNavigate = newPath => {
    this.setState({ activePath: newPath });
  };

  render() {
    return (
      <SideBar
        {...this.props}
        activePath={this.state.activePath}
        onNavigate={this.handleNavigate}
      />
    );
  }
}
