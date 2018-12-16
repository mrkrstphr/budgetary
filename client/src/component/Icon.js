import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsdCircle } from '@fortawesome/pro-solid-svg-icons';

library.add(faUsdCircle);

export default ({ ...props }) => <FontAwesomeIcon {...props} />;
