/* eslint-disable react/jsx-props-no-spreading */
import { Checkbox as BpCheckbox } from '@blueprintjs/core';
import { Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FieldError } from './FieldError';

export function Checkbox({ label, name }) {
  return (
    <Field name={name}>
      {({ field: { value }, form: { setFieldValue } }) => (
        <>
          <BpCheckbox
            checked={value === true}
            label={label}
            onChange={e => setFieldValue(name, e.target.checked)}
          />
          <ErrorMessage name={name} component={FieldError} />
        </>
      )}
    </Field>
  );
}

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};
