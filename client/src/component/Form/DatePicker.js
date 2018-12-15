import React from 'react';
import ReactDatePicker from 'react-datepicker';
import styled from 'styled-components';
import { rawStyles } from './Input';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block;
    width: 100%;
  }
  input {
    ${rawStyles}
  }
`;

export const DatePicker = ({ name, onChange, value }) => (
  <DatePickerWrapper>
    <ReactDatePicker onChange={date => onChange(name, date)} selected={value} />
  </DatePickerWrapper>
);
