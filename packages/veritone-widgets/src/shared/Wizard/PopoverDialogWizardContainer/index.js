import React from 'react';
import { node, func } from 'prop-types';

import styles from './styles/index.scss';
import { ModalHeader } from 'veritone-react-common';

// instead of
// <Wizard>
//   { ({ currentPage, requestClose, renderStepper, renderButtons, renderConfirmationDialog }) => (
//     <div>
//       ... etc
//     </div>
//   ) }
// </Wizard>

// this wraps the dialog style of wizard so you can do
// <Wizard>
//   { popoverDialogWizardContainer({ title: 'Create New Engine' }) }
// </Wizard>

const popoverDialogWizardContainer = ({ title, headerProps, footerStyles }) => {
  function PopoverDialogWizardContainer({
    currentPage,
    requestClose,
    renderStepper,
    renderButtons,
    renderConfirmationDialog
  }) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <ModalHeader
          title={title}
          {...headerProps}
          closeButton
          onClose={requestClose}
        />
        <div className={styles['container']}>
          <div className={styles['stepperContainer']}>
            <div>{renderStepper()}</div>
          </div>

          <div className={styles['wizardPageContainer']}>{currentPage}</div>
        </div>

        <div className={styles['footer']} style={footerStyles}>
          {renderButtons({ className: styles['footer__button'] })}
        </div>
        {renderConfirmationDialog()}
      </div>
    );
  }

  PopoverDialogWizardContainer.propTypes = {
    currentPage: node,
    requestClose: func,
    renderStepper: func,
    renderButtons: func,
    renderConfirmationDialog: func
  };

  return PopoverDialogWizardContainer;
};

export default popoverDialogWizardContainer;
