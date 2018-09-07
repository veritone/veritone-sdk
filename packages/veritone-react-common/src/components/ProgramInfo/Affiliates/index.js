import React from 'react';
import Button from '@material-ui/core/Button';
import { func, string, shape, bool, objectOf } from 'prop-types';
import { get, keys, values } from 'lodash';
import AffiliateItem from './AffiliateItem';
import styles from './styles.scss';
import AffiliateStationsDialog from './AffiliateStationsDialog';
import EditAffiliateDialog from './EditAffiliateDialog';
import BulkAddAffiliatesDialog from './BulkAddAffiliatesDialog';

export default class Affiliates extends React.Component {
  static propTypes = {
    selectedAffiliateById: objectOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        timeZone: string,
        schedule: shape({
          scheduleType: string,
          start: string,
          end: string,
          repeatEvery: shape({
            number: string,
            period: string
          }),
          weekly: shape({
            selectedDays: objectOf(bool)
          })
        }).isRequired
      })
    ),
    loadNextAffiliates: func,
    loadAllAffiliates: func,
    onAffiliatesChange: func,
    readOnly: bool,
    canBulkAddAffiliates: bool
  };

  state = {
    isAffiliateStationsDialogOpen: false,
    isBulkAddAffiliateDialogOpen: false,
    affiliateToEdit: null
  };

  handleOnEditAffiliateClick = affiliate => {
    this.setState({
      affiliateToEdit: affiliate
    });
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

  closeEditAffiliateDialog = () => {
    this.setState({
      affiliateToEdit: null
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

  handleAddAffiliateStation = newAffiliate => {
    const affiliateById = {
      ...this.props.selectedAffiliateById
    };
    affiliateById[newAffiliate.id] = newAffiliate;
    this.props.onAffiliatesChange(affiliateById);
  };

  handleBulkAddAffiliates = bulkAddAffiliateById => {
    this.closeBulkAddAffiliateDialog();
    for (let affiliateId in keys(bulkAddAffiliateById)) {
      if (this.props.selectedAffiliateById[affiliateId]) {
        bulkAddAffiliateById[
          affiliateId
        ].schedule.start = this.props.selectedAffiliateById[
          affiliateId
        ].schedule.start;
        bulkAddAffiliateById[
          affiliateId
        ].schedule.end = this.props.selectedAffiliateById[
          affiliateId
        ].schedule.end;
      }
    }
    const affiliateById = {
      ...this.props.selectedAffiliateById,
      ...bulkAddAffiliateById
    };
    this.props.onAffiliatesChange(affiliateById);
  };

  handleEditAffiliate = newAffiliate => {
    this.closeEditAffiliateDialog();
    for (let selectedDay in keys(
      get(newAffiliate, 'schedule.weekly.selectedDays', {})
    )) {
      if (newAffiliate.schedule.weekly.selectedDays[selectedDay]) {
        delete newAffiliate.schedule.weekly.selectedDays[selectedDay];
        delete newAffiliate.schedule.weekly[selectedDay];
      }
    }
    const affiliateById = {
      ...this.props.selectedAffiliateById
    };
    affiliateById[newAffiliate.id] = newAffiliate;
    this.props.onAffiliatesChange(affiliateById);
  };

  handleDeleteAffiliate = affiliate => {
    this.closeEditAffiliateDialog();
    const affiliateById = {
      ...this.props.selectedAffiliateById
    };
    delete affiliateById[affiliate.id];
    this.props.onAffiliatesChange(affiliateById);
  };

  handleDeleteEditedAffiliate = () => {
    this.handleDeleteAffiliate(this.state.affiliateToEdit);
  };

  render() {
    const {
      selectedAffiliateById,
      readOnly,
      canBulkAddAffiliates,
      loadNextAffiliates,
      loadAllAffiliates
    } = this.props;
    const {
      isAffiliateStationsDialogOpen,
      isBulkAddAffiliateDialogOpen,
      affiliateToEdit
    } = this.state;

    return (
      <div className={styles.affiliatesContainer}>
        <div className={styles.titleLabel}>Affiliated Stations</div>
        <div className={styles.titleDescription}>
          Assign affiliated stations that also broadcast programming from this
          ingestion source.
        </div>
        {values(selectedAffiliateById).length > 0 && (
          <div className={styles.affiliatesListSection}>
            {values(selectedAffiliateById).map(affiliate => {
              return (
                <div key={affiliate.id} className={styles.affiliateItem}>
                  <AffiliateItem
                    affiliate={affiliate}
                    readOnly={readOnly}
                    onDelete={this.handleDeleteAffiliate}
                    onEdit={this.handleOnEditAffiliateClick}
                  />
                </div>
              );
            })}
          </div>
        )}
        {!readOnly && (
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
        )}
        {isAffiliateStationsDialogOpen && (
          <AffiliateStationsDialog
            loadNextAffiliates={loadNextAffiliates}
            onClose={this.closeAffiliateStationsDialog}
            onAdd={this.handleAddAffiliateStation}
          />
        )}
        {affiliateToEdit && (
          <EditAffiliateDialog
            affiliate={affiliateToEdit}
            onClose={this.closeEditAffiliateDialog}
            onSave={this.handleEditAffiliate}
            onDelete={this.handleDeleteEditedAffiliate}
          />
        )}
        {isBulkAddAffiliateDialogOpen && (
          <BulkAddAffiliatesDialog
            loadAllAffiliates={loadAllAffiliates}
            onClose={this.closeBulkAddAffiliateDialog}
            onAdd={this.handleBulkAddAffiliates}
          />
        )}
      </div>
    );
  }
}
