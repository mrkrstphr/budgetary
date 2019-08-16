import React from 'react';
import Select from 'react-select';
import useRouter from 'use-react-router';

export default function MonthSwitcher({ months, selectedMonth }) {
  const { history } = useRouter();

  return (
    <div style={{ fontSize: '0.75em', width: 220 }}>
      Switch Month:
      <Select
        options={months.map(month => ({
          ...month,
          label: month.name,
          value: month.name,
        }))}
        onChange={selected => {
          history.push(`/transactions/${selected.name}`);
        }}
        value={{
          ...selectedMonth,
          label: selectedMonth.name,
          value: selectedMonth.name,
        }}
      />
    </div>
  );
}
