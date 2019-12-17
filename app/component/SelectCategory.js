import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React from 'react';
import { useAccountsQuery } from 'query';

function escapeRegExpChars(text) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

// From blueprintjs examples
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

export function itemsEqual(a, b) {
  return a.id === b.id;
}

export const filterCategories = (query, category, _index, exactMatch) => {
  const normalizedName = category.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedName === normalizedQuery;
  } else {
    return normalizedName.indexOf(normalizedQuery) >= 0;
  }
};

export default function SelectCategory({ onChange, value }) {
  const { loading: accountsLoading, accounts } = useAccountsQuery();

  return (
    <Select
      itemsEqual={itemsEqual}
      onItemSelect={onChange}
      items={accountsLoading ? [] : accounts}
      itemPredicate={filterCategories}
      itemRenderer={(category, { handleClick, modifiers, query }) => {
        if (!modifiers.matchesPredicate) {
          return null;
        }
        return (
          <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            label={category.type}
            key={category.id}
            text={highlightText(category.name, query)}
            onClick={handleClick}
          />
        );
      }}
    >
      <Button
        icon="category"
        rightIcon="caret-down"
        text={value ? `${value.name}` : '(No selection)'}
      />
    </Select>
  );
}
