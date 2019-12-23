/* eslint-disable react/jsx-props-no-spreading */
import { InputGroup, Label } from '@blueprintjs/core';
import { Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

function FakeLabel({ children }) {
  return <div>{children}</div>;
}

FakeLabel.propTypes = {
  children: PropTypes.element.isRequired,
};

export function Input({ label, name, ...props }) {
  const FieldLabel = label ? Label : FakeLabel;

  return (
    <Field name={name}>
      {({ field }) => (
        <>
          <FieldLabel htmlFor={field.name}>
            {label}
            <InputGroup id={field.name} {...field} {...props} />
          </FieldLabel>
          <ErrorMessage name={field.name} component="div" />
        </>
      )}
    </Field>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
