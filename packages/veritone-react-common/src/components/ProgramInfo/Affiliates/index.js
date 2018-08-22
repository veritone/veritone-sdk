import React from 'react';
import Button from '@material-ui/core/Button';
import { func, string, arrayOf, shape, bool } from 'prop-types';
import { get } from 'lodash';
import AffiliateItem from './AffiliateItem';
import styles from './styles.scss';
import AffiliateStationsDialog from "./AffiliateStationsDialog";
import EditAffiliateDialog from "./EditAffiliateDialog";

export default class Affiliates extends React.Component {
  static propTypes = {
    selectedAffiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        schedule: shape({
          scheduleType: string,
          start: string,
          end: string,
          repeatEvery: shape({
            number: string,
            period: string
          }),
          daily: arrayOf(
            shape({
              start: string,
              end: string
            })
          ),
          weekly: shape({
            selectedDays: arrayOf(string)
          })
        }).isRequired
      })
    ),
    affiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        schedule: shape({
          scheduleType: string,
          start: string,
          end: string,
          repeatEvery: shape({
            number: string,
            period: string
          }),
          daily: arrayOf(
            shape({
              start: string,
              end: string
            })
          ),
          weekly: shape({
            selectedDays: arrayOf(string)
          })
        }).isRequired
      })
    ),
    onAffiliatesChange: func.isRequired,
    canBulkAddAffiliates: bool
  };

  state = {
    isAffiliateStationsDialogOpen: false,
    isEditAffiliateDialogOpen: false,
    isBulkAddAffiliateDialogOpen: false,
    affiliateToEdit: null
  };

  handleOnEditAffiliateClick = affiliate => {
    this.setState({
      affiliateToEdit: affiliate
    });
    this.openEditAffiliateDialog();
  };

  openAffiliateStationsDialog = () => {
    this.setState({
      isAffiliateStationsDialogOpen: true
    });
  };

  closeAffiliateStationsDialog = () => {
    this.setState({
      isAffiliateStationsDialogOpen: false
    });
  };

  openEditAffiliateDialog = () => {
    this.setState({
      isEditAffiliateDialogOpen: true
    });
  };

  closeEditAffiliateDialog = () => {
    this.setState({
      isEditAffiliateDialogOpen: false
    });
  };

  openBulkAddAffiliateDialog = () => {
    this.setState({
      isBulkAddAffiliateDialogOpen: true
    });
  };

  closeBulkAddAffiliateDialog = () => {
    this.setState({
      isBulkAddAffiliateDialogOpen: false
    });
  };

  handleAddAffiliateStations = newAffiliates => {
    this.closeAffiliateStationsDialog();
    // TODO: implement
  };

  handleEditAffiliate = newAffiliate => {
    this.closeEditAffiliateDialog();
    // TODO: implement
  };

  render() {
    const { selectedAffiliates, canBulkAddAffiliates } = this.props;
    const { isAffiliateStationsDialogOpen, isEditAffiliateDialogOpen, affiliateToEdit } = this.state;

    // TODO: use when ready
    // eslint-disable-next-line no-unused-vars
    const { affiliates, onAffiliatesChange } = this.props;

    return (
      <div className={styles.affiliatesContainer}>
        <div className={styles.titleLabel}>Affiliated Stations</div>
        <div className={styles.titleDescription}>
          Assign affiliated stations that also broadcast programming from this
          ingestion source.
        </div>
        {get(selectedAffiliates, 'length') > 0 && (
          <div className={styles.affiliatesListSection}>
            {selectedAffiliates.map(affiliate => {
              return (
                <div key={affiliate.id} className={styles.affiliateItem}>
                  <AffiliateItem
                    affiliate={affiliate}
                    onEdit={this.handleOnEditAffiliateClick}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div className={styles.addAffiliateActionButtons}>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.openAffiliateStationsDialog}
            classes={{
              root: styles.addAffiliateButton,
              label: styles.addAffiliateButtonLabel
            }}
          >
            ADD AFFILIATE
          </Button>
          {canBulkAddAffiliates && (
            <Button
              variant="outlined"
              color="primary"
              onClick={this.openBulkAddAffiliateDialog}
              classes={{
                root: styles.addAffiliateButton,
                label: styles.addAffiliateButtonLabel
              }}
            >
              BULK ADD AFFILIATES
            </Button>
          )}
        </div>
        {isAffiliateStationsDialogOpen && (
          <AffiliateStationsDialog
            affiliates={affiliates}
            onClose={this.closeAffiliateStationsDialog}
            onAdd={this.handleAddAffiliateStations}
          />
        )}
        {isEditAffiliateDialogOpen && affiliateToEdit && (
          <EditAffiliateDialog
            affiliate={affiliateToEdit}
            onClose={this.closeEditAffiliateDialog}
            onAdd={this.handleEditAffiliate}
          />
        )}
      </div>
    );
  }
}
