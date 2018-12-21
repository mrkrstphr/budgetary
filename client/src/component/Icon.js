import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faGlassCheers,
  faJackOLantern,
  faTreeChristmas,
  faTurkey,
  faUsdCircle,
} from '@fortawesome/pro-solid-svg-icons';

library.add(
  faGlassCheers,
  faJackOLantern,
  faTreeChristmas,
  faTurkey,
  faUsdCircle,
);

export default ({ ...props }) => <FontAwesomeIcon {...props} />;
