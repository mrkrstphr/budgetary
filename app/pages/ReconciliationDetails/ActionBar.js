import { Alert, Button, Icon } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { ToastContext } from 'component/ToastContext';
import { currencyFormatter, useToggle } from 'lib';
import { useFinishReconciliation } from 'mutation';

const ActionBarStyles = styled.div`
  align-items: center;
  background-color: #e2e4e4;
  border-radius: 3px;
  bottom: 10px;
  display: flex;
  margin-top: 10px;
  padding: 10px;
  position: -webkit-sticky;
  position: sticky;

  .total {
    align-items: center;
    display: flex;
    flex: 1;
    font-size: 1.2em;
    font-weight: 500;
  }
`;

export default function ActionBar({ reconciliation, balance }) {
  const [isOpen, toggle] = useToggle();
  const [finishReconciliation] = useFinishReconciliation();

  return (
    <ToastContext.Consumer>
      {toaster => (
        <ActionBarStyles>
          <Alert
            icon="help"
            cancelButtonText="No"
            confirmButtonText="Yes"
            isOpen={isOpen}
            onCancel={toggle}
            onConfirm={() =>
              finishReconciliation(reconciliation.id).then(() => {
                toaster.show({
                  icon: 'endorsed',
                  intent: 'success',
                  message: `Reconciliation Completed`,
                });
                toggle();
              })
            }
          >
            <p>
              Are you sure you want to complete this reconciliation? You will no
              longer be able to modify it or any transactions associated with
              it.
            </p>
          </Alert>

          <div className="total">
            <Icon
              icon={
                balance === reconciliation.endingBalance.toFixed(2)
                  ? 'endorsed'
                  : 'ban-circle'
              }
              color={
                balance === reconciliation.endingBalance.toFixed(2)
                  ? 'green'
                  : 'red'
              }
              style={{ paddingRight: 5 }}
            />
            {currencyFormatter(balance - reconciliation.endingBalance)}
          </div>
          <Button
            intent="primary"
            disabled={balance !== reconciliation.endingBalance.toFixed(2)}
            onClick={toggle}
          >
            Complete Reconciliation
          </Button>
        </ActionBarStyles>
      )}
    </ToastContext.Consumer>
  );
}

ActionBar.propTypes = {
  balance: PropTypes.number.isRequired,
  reconciliation: PropTypes.shape({
    endingBalance: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};
