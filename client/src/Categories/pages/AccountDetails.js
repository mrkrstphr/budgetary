import React from 'react';
import WithAccountDetails from '../containers/WithAccountDetails';
import Statistics from '../components/Statistics';

const AccountDetails = ({ account }) => (
  <div>
    <h2>{account.name}</h2>
    <Statistics account={account} />
  </div>
);

const MapParamIdToId = Component => props => {
  return <Component id={props.match.params.id} {...props} />;
};

export default MapParamIdToId(WithAccountDetails(AccountDetails));
