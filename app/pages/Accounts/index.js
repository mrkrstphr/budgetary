import { HTMLTable, InputGroup } from '@blueprintjs/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from 'component';
import { currencyFormatter, ucfirst } from 'lib';
import { useAccounts } from 'query';

function groupAccounts(accounts, filter = '') {
  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return [...new Set(filteredAccounts.map(account => account.type))]
    .sort()
    .map(group => ({
      name: group,
      accounts: filteredAccounts.filter(a => a.type === group),
    }));
}

function Accounts() {
  const { accounts } = useAccounts();
  const [filter, setFilter] = useState('');

  const groupedAccounts = groupAccounts(accounts, filter);

  return (
    <div>
      <PageTitle
        title="Accounts"
        action={
          <InputGroup
            type="search"
            leftIcon="search"
            onChange={e => setFilter(e.target.value)}
          />
        }
      />

      {groupedAccounts && (
        <>
          {groupedAccounts.map(group => (
            <div key={`account-group-${group.name}`}>
              <h3>{ucfirst(group.name)}</h3>
              <HTMLTable striped interactive style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th style={{ textAlign: 'right' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {group.accounts.map(account => (
                    <tr key={`accounts-${account.id}`}>
                      <td>
                        <Link to={`/accounts/${account.id}`}>
                          {account.name}
                        </Link>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {currencyFormatter(account.currentBalance, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Accounts;
