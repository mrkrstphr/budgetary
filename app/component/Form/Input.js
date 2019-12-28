/* eslint-disable react/jsx-props-no-spreading */
import { InputGroup, Label } from '@blueprintjs/core';
import { Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FakeLabel } from './FakeLabel';
import { FieldError } from './FieldError';

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
          <ErrorMessage name={field.name} component={FieldError} />
        </>
      )}
    </Field>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};
