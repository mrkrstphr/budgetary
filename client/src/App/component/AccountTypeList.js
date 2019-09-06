import { Icon, Tag } from '@blueprintjs/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { currencyFormatter } from 'lib';

export default function AccountList({
  accounts,
  color = 'black',
  icon = 'bank-account',
}) {
  return (
    <>
      {accounts.map(account => (
        <div className="menuItem" key={`account-sidebar-${account.id}`}>
          <Link
            to={`/accounts/${account.id}`}
            className="accountLink"
            title={account.name}
          >
            <Icon icon={icon} color={color} />
            <span className="accountName">{account.name}</span>
            <Tag
              intent={account.currentBalance < 0 ? 'danger' : 'success'}
              minimal
            >
              {currencyFormatter(account.currentBalance, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Tag>
          </Link>
        </div>
      ))}
    </>
  );
}
