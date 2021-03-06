import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';

const APP_NAME = 'Budgetary';

export function BrowserTitle({ title }) {
  return (
    <Helmet>
      <title>{title ? `${title} - ${APP_NAME}` : APP_NAME}</title>
    </Helmet>
  );
}

BrowserTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
