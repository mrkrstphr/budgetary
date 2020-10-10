import { Button, HTMLTable, NonIdealState } from '@blueprintjs/core';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { useReconciliations } from 'query';
import { formatDate, useToggle } from 'lib';
import AddReconciliationForm from './AddReconciliationForm';

export default withRouter(function Reconciliations({ account, history }) {
  const [addOpen, toggleAddOpen] = useToggle();
  const { error, loading, reconciliations } = useReconciliations(account.id);

  if (error || loading) {
    return null;
  }
  return (
    <>
      {addOpen && (
        <AddReconciliationForm
          onClose={toggleAddOpen}
          initialValues={{
            accountId: account.id,
            details: {
              startingBalance: '',
              endingBalance: '',
            },
          }}
        />
      )}

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          padding: '10px 0',
        }}
      >
        <h3 style={{ flex: 1, margin: 0 }}>Reconciliations</h3>

        {account.isOpen && (
          <Button icon="plus" intent="success" onClick={toggleAddOpen}>
            Create Reconciliation
          </Button>
        )}
      </div>

      {reconciliations.length > 0 ? (
        <HTMLTable
          interactive
          striped
          style={{ width: '100%' }}
          className="valignMiddle"
        >
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th className="right">Starting Balance</th>
              <th className="right">Ending Balance</th>
              <th style={{ width: 40 }}> </th>
            </tr>
          </thead>
          <tbody>
            {reconciliations.map((reconciliation) => (
              <tr key={`reconciliation-${reconciliation.id}`}>
                <td>{formatDate(reconciliation.startDate)}</td>
                <td>{formatDate(reconciliation.endDate)}</td>
                <td>{reconciliation.status}</td>
                <td className="right">
                  {reconciliation.startingBalance.toFixed(2)}
                </td>
                <td className="right">
                  {reconciliation.endingBalance.toFixed(2)}
                </td>
                <td className="center">
                  <Button
                    icon="search"
                    minimal
                    intent="primary"
                    onClick={() =>
                      history.push(`/reconciliation/${reconciliation.id}`)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      ) : (
        <NonIdealState
          icon="folder-open"
          title="There are no reconciliations for this account."
          description="But you can create the first one."
        />
      )}
    </>
  );
});
