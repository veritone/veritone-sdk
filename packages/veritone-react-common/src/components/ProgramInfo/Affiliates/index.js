import React from 'react';
import Button from '@material-ui/core/Button';
import { func, string, arrayOf, shape, bool, objectOf } from 'prop-types';
import { get, concat, findIndex, reject, intersectionBy, differenceBy } from 'lodash';
import AffiliateItem from './AffiliateItem';
import styles from './styles.scss';
import AffiliateStationsDialog from './AffiliateStationsDialog';
import EditAffiliateDialog from './EditAffiliateDialog';
import BulkAddAffiliatesDialog from './BulkAddAffiliatesDialog';

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
          weekly: shape({
            selectedDays: objectOf(bool)
          })
        }).isRequired
      })
    ),
    affiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    onAffiliatesChange: func.isRequired,
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
    this.props.onAffiliatesChange(
      concat(this.props.selectedAffiliates, newAffiliate)
    );
  };

  handleBulkAddAffiliates = newAffiliates => {
    this.closeBulkAddAffiliateDialog();
    const result = [];
    // TODO: optimize this by using affiliates map as a component and callback inputs.
    const affiliatesToKeep = differenceBy(this.props.selectedAffiliates, newAffiliates, 'id');
    affiliatesToKeep.forEach(affiliate => result.push(affiliate));
    const affiliatesToMerge = intersectionBy(newAffiliates, this.props.selectedAffiliates, 'id');
    affiliatesToMerge.forEach(affiliate => {
      const index = findIndex(this.props.selectedAffiliates, { id: affiliate.id });
      const mergedAffiliate = {
        ...affiliate
      };
      mergedAffiliate.schedule.start = this.props.selectedAffiliates[index].schedule.start;
      mergedAffiliate.schedule.end = this.props.selectedAffiliates[index].schedule.end;
      result.push(mergedAffiliate);
    });
    const affiliatesToAdd = differenceBy(newAffiliates, this.props.selectedAffiliates, 'id');
    affiliatesToAdd.forEach(affiliate => result.push(affiliate));
    this.props.onAffiliatesChange(result);
  };

  handleEditAffiliate = newAffiliate => {
    this.closeEditAffiliateDialog();
    const newAffiliates = [...this.props.selectedAffiliates];
    const affiliateIndex = findIndex(newAffiliates, { id: newAffiliate.id });
    if (affiliateIndex >= 0) {
      newAffiliates[affiliateIndex] = newAffiliate;
      this.props.onAffiliatesChange(newAffiliates);
    }
  };

  handleDeleteAffiliate = affiliate => {
    this.closeEditAffiliateDialog();
    this.props.onAffiliatesChange(
      reject(this.props.selectedAffiliates, { id: affiliate.id })
    );
  };

  handleDeleteEditedAffiliate = () => {
    this.props.onAffiliatesChange(
      reject(this.props.selectedAffiliates, { id: this.state.affiliateToEdit.id })
    );
    this.closeEditAffiliateDialog();
  };

  render() {
    const { selectedAffiliates, canBulkAddAffiliates, affiliates } = this.props;
    const { isAffiliateStationsDialogOpen, isBulkAddAffiliateDialogOpen, affiliateToEdit } = this.state;

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
                    onDelete={this.handleDeleteAffiliate}
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
            affiliates={differenceBy(affiliates, selectedAffiliates, 'id')}
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
            affiliates={affiliates}
            onClose={this.closeBulkAddAffiliateDialog}
            onAdd={this.handleBulkAddAffiliates}
          />
        )}
      </div>
    );
  }
}
