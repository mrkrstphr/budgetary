import { Label } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import React from 'react';
import { FieldError } from 'component/Form';

function FakeLabel({ children }) {
  return <div>{children}</div>;
}

export function DatePicker({ label, name, ...props }) {
  const { setFieldValue } = useFormikContext();

  const FieldLabel = label ? Label : FakeLabel;

  return (
    <Field name={name}>
      {({ field: { name, value } }) => (
        <>
          <FieldLabel htmlFor={name}>
            {label}
            <DateInput
              name={name}
              defaultValue={value}
              fill={true}
              formatDate={date => date.toLocaleDateString()}
              parseDate={str => new Date(str)}
              placeholder="M/D/YYYY"
              onChange={newValue => setFieldValue(name, newValue)}
              {...props}
            />
          </FieldLabel>
          <ErrorMessage name={name} component={FieldError} />
        </>
      )}
    </Field>
  );
}
