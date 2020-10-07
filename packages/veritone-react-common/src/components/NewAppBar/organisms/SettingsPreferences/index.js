import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Gird from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import IconAIWare from '../../../../resources/images/icon_aiware.png';
import IconApplications from '../../../../resources/images/icon_app.svg';
import IconConfig from '../../../../resources/images/icon_config.svg';
import IconEdge from '../../../../resources/images/icon_edge.svg';
import IconEngine from '../../../../resources/images/icon_engine.svg';
import IconOrg from '../../../../resources/images/icon_org.svg';
import IconProfile from '../../../../resources/images/icon_profile.svg';
import IconUser from '../../../../resources/images/icon_user.svg';

import styles from './styles';
const useStyles = makeStyles(styles);

const SettingsPreferences = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.infoBox}>
        <Gird container>
          <Gird item xs={5} className={classes.avatarGird}>
            <Box className={classes.squareBox}>
              <Avatar
                src="https://i.imgur.com/iyo2Vtp.png"
                className={classes.avatar}
              />
            </Box>
          </Gird>
          <Gird item xs={7} pr="20px">
            <Box className={classes.appInfo}>
              <Typography className={classes.appName}>aiWARE </Typography>
              <Typography className={classes.version}>
                <span className={classes.versionTitle}>Version</span>{' '}
                3.10.019303a{' '}
              </Typography>
            </Box>
            <Box className={classes.appInfoDetail}>
              <Typography className={classes.speci}>
                <span className={classes.speciTitle}>Environment</span> US AWS
                Production
              </Typography>
              <Typography className={classes.speci}>
                <span className={classes.speciTitle}>Edge Clusters</span> 2
              </Typography>
              <Typography className={classes.speci}>
                <span className={classes.speciTitle}>Peak Edge Processors</span>{' '}
                3,121 cores
              </Typography>
              <Typography className={classes.speci}>
                <span className={classes.speciTitle}>Storage</span> 65,200 GB
              </Typography>
            </Box>
            <Box>
              <Button variant="outlined" color="primary" className={classes.buttonSU}>
                Software Update
              </Button>
            </Box>
          </Gird>
        </Gird>
      </Box>
      <Box className={classes.listMenuBox}>
        <Gird container>
          <Gird item xs={6} className={classes.listItemGird}>
            <Box className={classes.listItemBox}>
              <Box className={classes.iconItem}>
                <img className={classes.iconImage} src={IconProfile} alt="" />
              </Box>
              <Typography className={classes.listItemTitle}>Profile</Typography>
              <Typography className={classes.listItemDec}>
                view and edit organization info
              </Typography>
            </Box>
          </Gird>
          <Gird item xs={6} className={classes.listItemGird}>
            <Box className={classes.listItemBox}>
              <Box className={classes.iconItem}>
                <img className={classes.iconImage} src={IconUser} alt="" />
              </Box>
              <Typography className={classes.listItemTitle}>User</Typography>
              <Typography className={classes.listItemDec}>
                view and edit all client users
              </Typography>
            </Box>
          </Gird>
          <Gird item xs={6} className={classes.listItemGird}>
            <Box className={classes.listItemBox}>
              <Box className={classes.iconItem}>
                <img className={classes.iconImage} src={IconOrg} alt="" />
              </Box>
              <Typography className={classes.listItemTitle}>
                Organizations
              </Typography>
              <Typography className={classes.listItemDec}>
                view and add new organizations
              </Typography>
            </Box>
          </Gird>
          <Gird item xs={6} className={classes.listItemGird}>
            <Box className={classes.listItemBox}>
              <Box className={classes.iconItem}>
                <img
                  className={classes.iconImage}
                  src={IconApplications}
                  alt=""
                />
              </Box>
              <Typography className={classes.listItemTitle}>
                Applications
              </Typography>
              <Typography className={classes.listItemDec}>
                view and edit all clients applications
              </Typography>
            </Box>
          </Gird>
          <Gird item xs={6} className={classes.listItemGird}>
            <Box className={classes.listItemBox}>
              <Box className={classes.iconItem}>
                <img className={classes.iconImage} src={IconEngine} alt="" />
              </Box>
              <Typography className={classes.listItemTitle}>Engines</Typography>
              <Typography className={classes.listItemDec}>
                manage and edit all client engines
              </Typography>
            </Box>
          </Gird>
          <Gird item xs={6} className={classes.listItemGird}>
            <Box className={classes.listItemBox}>
              <Box className={classes.iconItem}>
                <img className={classes.iconImage} src={IconEdge} alt="" />
              </Box>
              <Typography className={classes.listItemTitle}>
                Edge Overview
              </Typography>
              <Typography className={classes.listItemDec}>
                administrative view of Edge Ecosystem
              </Typography>
            </Box>
          </Gird>
          <Gird item xs={6} className={classes.listItemGird}>
            <Box className={classes.listItemBox}>
              <Box className={classes.iconItem}>
                <img className={classes.iconImage} src={IconAIWare} alt="" />
              </Box>
              <Typography className={classes.listItemTitle}>
                aiWARE Edge
              </Typography>
              <Typography className={classes.listItemDec}>
                add and configure software settings
              </Typography>
            </Box>
          </Gird>
          <Gird item xs={6} className={classes.listItemGird}>
            <Box className={classes.listItemBox}>
              <Box className={classes.iconItem}>
                <img className={classes.iconImage} src={IconConfig} alt="" />
              </Box>
              <Typography className={classes.listItemTitle}>
                Configuration
              </Typography>
              <Typography className={classes.listItemDec}>
                view and edit all system settings
              </Typography>
            </Box>
          </Gird>
        </Gird>
      </Box>
    </Box>
  );
};

SettingsPreferences.propTypes = {};

export default SettingsPreferences;
