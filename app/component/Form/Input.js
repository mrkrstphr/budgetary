import { InputGroup, Label } from '@blueprintjs/core';
import { Field, ErrorMessage } from 'formik';
import React from 'react';

function FakeLabel({ children }) {
  return <div>{children}</div>;
}

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
