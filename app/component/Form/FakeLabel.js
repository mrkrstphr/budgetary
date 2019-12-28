import PropTypes from 'prop-types';
import React from 'react';

export function FakeLabel({ children }) {
  return <div>{children}</div>;
}

FakeLabel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
