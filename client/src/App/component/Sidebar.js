import { Icon } from '@blueprintjs/core';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAccountsQuery } from 'query';
import AccountTypeList from './AccountTypeList';
import Logo from './Logo';

function accountType(accounts, type) {
  return accounts.filter(
    account => account.type.toLowerCase() === type.toLowerCase(),
  );
}

const SidebarStyles = styled.div`
  background-color: ${({ theme }) => theme.appBgColor};
  color: ${({ theme }) => theme.appFgColor};
  height: 100vh;
  width: 240px;

  .header {
    height: 48px;
  }

  a,
  a:visited {
    color: ${({ theme }) => theme.appFgColor};
  }

  a:hover {
    text-decoration: none;
  }

  .nav {
    margin-left: 10px;
  }

  .menuItem {
    margin: 0 -10px 0 -10px;
    padding: 20px 10px 10px 20px;

    .bp3-icon {
      margin-right: 10px;
    }

    .accountLink {
      align-items: center;
      display: flex;

      .accountName {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        padding-right: 3px;
        text-overflow: ellipsis;
      }
    }
  }

  .heading {
    color: ${({ theme }) => theme.textMutedColor};
    font-weight: 500;
    font-size: 0.9em;
    margin: 10px -10px -10px -10px;
    padding: 10px;
    text-transform: uppercase;

    .bp3-icon {
      margin-right: 10px;
    }
  }
`;

export default function Sidebar() {
  const { accounts, loading } = useAccountsQuery();

  return (
    <SidebarStyles>
      <div className="header">
        <Logo className="logo" />
      </div>

      <div className="nav">
        <div className="menuItem">
          <Link to="/">
            <Icon icon="home" color="#9179F2" /> Home
          </Link>
        </div>

        <div className="menuItem">
          <Link to="/budgets">
            <Icon icon="pie-chart" color="#9179F2" /> Budgets
          </Link>
        </div>

        <div className="menuItem">
          <Link to="/accounts">
            <Icon icon="th" color="#9179F2" /> Accounts
          </Link>
        </div>

        <div className="menuItem">
          <Link to="/transactions">
            <Icon icon="changes" color="#9179F2" /> Transactions
          </Link>
        </div>

        <div className="menuItem">
          <Link to="/goals">
            <Icon icon="locate" color="#9179F2" /> Goals
          </Link>
        </div>

        {!loading && (
          <>
            <div className="heading">Bank Accounts</div>

            <AccountTypeList
              accounts={accountType(accounts, 'bank')}
              icon="bank-account"
              color="#FF66A1"
            />

            <div className="heading">Liabilities</div>

            <AccountTypeList
              accounts={accountType(accounts, 'liabilities')}
              icon="credit-card"
              color="#669EFF"
            />
          </>
        )}
      </div>
    </SidebarStyles>
  );
}
