import { set } from 'lodash';
import React from 'react';
import Select from 'react-select';
import FieldError from './FieldError';
import Label from './Label';

const SelectWrapper = ({
  name,
  label,
  container: { errors, getValue, mergeState },
  ...props
}) => {
  const value = getValue(name);
  const selectedValue = props.options.find(o => o.value === value);

  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <Select
        id={name}
        name={name}
        onChange={selected => {
          const newState = {};
          set(newState, name, selected.value);
          mergeState(newState);
        }}
        styles={{ control: styles => ({ ...styles, marginLeft: 5 }) }}
        value={selectedValue}
        {...props}
      />
      {name in errors && (
        <FieldError>
          {Array.isArray(errors[name])
            ? errors[name].map(e => <div key={e}>{e}</div>)
            : errors[name]}
        </FieldError>
      )}
    </>
  );
};

export default SelectWrapper;
