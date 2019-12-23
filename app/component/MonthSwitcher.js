import { Button, ButtonGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { highlightText } from 'lib';

function itemPredicate(query, month, _index, exactMatch) {
  const normalizedTitle = month.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  }
  return normalizedTitle.indexOf(normalizedQuery) >= 0;
}

function itemRenderer(month, { handleClick, modifiers, query }) {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      key={month.name}
      active={modifiers.active}
      disabled={modifiers.disabled}
      onClick={handleClick}
      text={highlightText(month.name, query)}
    />
  );
}

function formatMonth(month) {
  return moment(`${month}-01`).format('MMMM YYYY');
}

function hasPreviousMonth(months, selected) {
  const monthIndex = months.findIndex(m => m.name === selected.name);
  return monthIndex > 0;
}

function gotoPreviousMonth(history, months, selected) {
  if (hasPreviousMonth(months, selected)) {
    const monthIndex = months.findIndex(m => m.name === selected.name);
    history.push(`/transactions/${months[monthIndex - 1].name}`);
  }
}

function hasNextMonth(months, selected) {
  const monthIndex = months.findIndex(m => m.name === selected.name);
  return monthIndex < months.length - 1;
}

function gotoNextMonth(history, months, selected) {
  if (hasNextMonth(months, selected)) {
    const monthIndex = months.findIndex(m => m.name === selected.name);
    history.push(`/transactions/${months[monthIndex + 1].name}`);
  }
}

export default function MonthSwitcher({ months, selectedMonth }) {
  const history = useHistory();

  return (
    <ButtonGroup>
      <Button
        icon="chevron-left"
        disabled={!hasNextMonth(months, selectedMonth)}
        onClick={() => gotoNextMonth(history, months, selectedMonth)}
      />
      <Select
        activeItem={selectedMonth}
        items={months}
        itemsEqual={(a, b) => a.name === b.name}
        itemPredicate={itemPredicate}
        itemRenderer={itemRenderer}
        noResults={<MenuItem disabled text="No results." />}
        onItemSelect={selected => {
          history.push(`/transactions/${selected.name}`);
        }}
      >
        <Button
          icon="calendar"
          text={formatMonth(selectedMonth.name)}
          rightIcon="double-caret-vertical"
        />
      </Select>
      <Button
        icon="chevron-right"
        disabled={!hasPreviousMonth(months, selectedMonth)}
        onClick={() => gotoPreviousMonth(history, months, selectedMonth)}
      />
    </ButtonGroup>
  );
}

MonthSwitcher.propTypes = {
  months: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired }),
  ).isRequired,
  selectedMonth: PropTypes.shape({ name: PropTypes.string.isRequired }),
};
