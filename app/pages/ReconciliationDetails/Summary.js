import { Card } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { currencyFormatter, formatDate } from 'lib';

const SummaryCard = styled(Card)`
  margin-bottom: 20px;

  .container {
    display: flex;

    .row {
      flex: 1;

      .label {
        font-weight: bold;
      }

      .value {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;

export default function Summary({ balance, reconciliation }) {
  return (
    <SummaryCard>
      <div className="container">
        <div className="row">
          <div className="label">Start Date</div>
          <div className="value">{formatDate(reconciliation.startDate)}</div>

          <div className="label">Starting Balance</div>
          <div className="value">
            {currencyFormatter(reconciliation.startingBalance)}
          </div>
        </div>

        <div className="row">
          <div className="label">End Date</div>
          <div className="value">{formatDate(reconciliation.endDate)}</div>

          <div style={{ fontWeight: 700 }}>Ending Balance</div>
          <div style={{}}>
            {currencyFormatter(reconciliation.endingBalance)}
          </div>
        </div>

        <div className="row">
          <div className="label">Reconciled Balance</div>
          <div className="value">{currencyFormatter(balance)}</div>

          <div className="label">Difference</div>
          <div className="value">
            {currencyFormatter(balance - reconciliation.endingBalance)}
          </div>
        </div>
      </div>
    </SummaryCard>
  );
}
