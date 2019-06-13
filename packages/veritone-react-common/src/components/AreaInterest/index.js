import React, { Component } from 'react'
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import FilterCenterFocus from "@material-ui/icons/FilterCenterFocus";
import Delete from "@material-ui/icons/Delete";
import styles from './styles.scss';

export default class index extends Component {
    render() {
        return (
          <div>
            <div className={styles.rectangle}>
                <IconButton disabled={true}>
                    <FilterCenterFocus />
                </IconButton>
                <div className={styles.coordinate}>(X .20, y .43)</div>
                <div className={styles.editCoordinate}>
                    <IconButton>
                        <Edit />
                    </IconButton>
                    <IconButton>
                        <Delete />
                    </IconButton>
                </div>
            </div>
          </div>
        );
      }
}
