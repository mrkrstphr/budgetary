import { HTMLTable, InputGroup } from '@blueprintjs/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrowserTitle } from 'component';
import { currencyFormatter, ucfirst } from 'lib';
import { useAccountsQuery } from 'query';

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
  const { accounts } = useAccountsQuery();
  const [filter, setFilter] = useState('');

  const groupedAccounts = groupAccounts(accounts, filter);

  return (
    <div>
      <BrowserTitle title="Accounts" />

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          padding: '10px 0',
        }}
      >
        <h2 style={{ flex: 1, margin: '0 0 10px 0' }}>Accounts</h2>

        <InputGroup
          type="search"
          leftIcon="search"
          onChange={e => setFilter(e.target.value)}
        />
      </div>

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
