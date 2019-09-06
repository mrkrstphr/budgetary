import { Button, ButtonGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import moment from 'moment';
import React from 'react';
import useRouter from 'use-react-router';

// from https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples/select-examples/films.tsx
function highlightText(text, query) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

function escapeRegExpChars(text) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

function itemPredicate(query, month, _index, exactMatch) {
  const normalizedTitle = month.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
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
  const { history } = useRouter();

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
        noResults={<MenuItem disabled={true} text="No results." />}
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
