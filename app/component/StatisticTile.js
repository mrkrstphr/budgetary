import { Callout } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Styles = styled(Callout)`
  border-radius: 4px;
  box-sizing: border-box;
  margin-right: 5px;
  padding: 10px;
  text-align: right;
  width: 320px;

  .title {
    margin: 0;
  }

  .value {
    font-size: 2.5em;
  }
`;

export const StatisticTile = ({ intent = '', title, value }) => (
  <Styles intent={intent}>
    <h4 className="bp3-heading title">{title}</h4>
    <div className="value">{value}</div>
  </Styles>
);

StatisticTile.propTypes = {
  intent: PropTypes.oneOf(['success', 'danger', 'primary']),
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
