import React from 'react';
import Statistics from './components/Statistics';
import { useAccountDetailsQuery } from 'query';

function AccountDetails({ id }) {
  const { account, loading } = useAccountDetailsQuery(id);

  if (loading) {
    return null;
  }

  return (
    <div>
      <h2>{account.name}</h2>
      <Statistics account={account} />
      <h3>Recent Transactions</h3>
    </div>
  );
}

const MapParamIdToId = Component => props => {
  return <Component id={props.match.params.id} {...props} />;
};

export default MapParamIdToId(AccountDetails);
