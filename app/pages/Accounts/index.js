import {
  HTMLTable,
  InputGroup,
  Button,
  ControlGroup,
  Tag,
} from '@blueprintjs/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from 'component';
import { currencyFormatter, ucfirst, useToggle } from 'lib';
import { useAccounts } from 'query';
import AddAccountForm from '../../component/AddAccountForm';
import AccountActions from './AccountActions';

function groupAccounts(accounts, filter = '') {
  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return [...new Set(filteredAccounts.map((account) => account.type))]
    .sort()
    .map((group) => ({
      name: group,
      accounts: filteredAccounts.filter((a) => a.type === group),
    }));
}

export default function Accounts() {
  const { accounts, refetch } = useAccounts();
  const [filter, setFilter] = useState('');
  const [isAddOpen, toggleAddOpen] = useToggle();

  const groupedAccounts = groupAccounts(accounts, filter);

  return (
    <div>
      {isAddOpen && (
        <AddAccountForm onClose={toggleAddOpen} onSave={() => refetch()} />
      )}

      <PageTitle
        title="Accounts"
        action={
          <>
            <ControlGroup>
              <InputGroup
                placeholder="Search..."
                leftIcon="search"
                onChange={(e) => setFilter(e.target.value)}
              />
              <Button
                intent="primary"
                icon="small-plus"
                onClick={toggleAddOpen}
              >
                Add New
              </Button>
            </ControlGroup>
          </>
        }
      />

      {groupedAccounts && (
        <>
          {groupedAccounts.map((group) => (
            <div key={`account-group-${group.name}`}>
              <h3>{ucfirst(group.name)}</h3>
              <HTMLTable striped interactive style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="right">Balance</th>
                    <th style={{ width: 40 }}> </th>
                  </tr>
                </thead>
                <tbody>
                  {group.accounts.map((account) => (
                    <tr key={`accounts-${account.id}`}>
                      <td className="middle">
                        <Link to={`/accounts/${account.id}`}>
                          {account.name}
                        </Link>{' '}
                        {!account.isOpen && <Tag intent="danger">Closed</Tag>}
                      </td>
                      <td className="middle right">
                        {currencyFormatter(account.currentBalance, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="middle right">
                        <AccountActions account={account} />
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
