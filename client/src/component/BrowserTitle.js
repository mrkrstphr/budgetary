import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const APP_NAME = 'Budgetary';

export function BrowserTitle({ title }) {
  return (
    <Helmet>
      <title>{title ? `${title} - ${APP_NAME}` : APP_NAME}</title>
    </Helmet>
  );
}
