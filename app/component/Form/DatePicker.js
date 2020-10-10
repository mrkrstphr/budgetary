/* eslint-disable react/jsx-props-no-spreading */
import { Label } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { formatDate } from 'lib';
import { FakeLabel } from './FakeLabel';
import { FieldError } from './FieldError';

export function DatePicker({ label, name, ...props }) {
  const { setFieldValue } = useFormikContext();

  const FieldLabel = label ? Label : FakeLabel;

  return (
    <Field name={name}>
      {({ field: { value } }) => (
        <>
          <FieldLabel htmlFor={name}>
            {label}
            <DateInput
              name={name}
              value={value}
              fill
              formatDate={(date) => formatDate(date)}
              parseDate={(str) => new Date(str)}
              placeholder="M/D/YYYY"
              onChange={(newValue) => setFieldValue(name, newValue)}
              {...props}
            />
          </FieldLabel>
          <ErrorMessage name={name} component={FieldError} />
        </>
      )}
    </Field>
  );
}

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
