import { HTMLSelect, Label } from '@blueprintjs/core';
import { Field, ErrorMessage } from 'formik';
import React from 'react';

function FakeLabel({ children }) {
  return <div>{children}</div>;
}

export function Select({ label, name, options = [], ...props }) {
  const FieldLabel = label ? Label : FakeLabel;

  return (
    <Field name={name}>
      {({ field }) => (
        <>
          <FieldLabel htmlFor={field.name}>
            {label}
            <HTMLSelect fill {...field} {...props}>
              <option value=""></option>
              {options.map(option => (
                <option
                  key={`${field.name}_${option.value}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </HTMLSelect>
          </FieldLabel>
          <ErrorMessage name={field.name} component="div" />
        </>
      )}
    </Field>
  );
}
