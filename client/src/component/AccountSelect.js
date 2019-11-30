import { Button, Label, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import React from 'react';
import { FieldError } from 'component/Form';
import { useAccountsQuery } from 'query';
import styled from 'styled-components';

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

function renderAccount(account, { handleClick, modifiers, query }) {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={account.type}
      key={account.id}
      onClick={handleClick}
      text={highlightText(account.name, query)}
    />
  );
}

const WrappedButton = styled(Button)`
  .bp3-button-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 150px;
  }
`;

function FakeLabel({ children }) {
  return <div>{children}</div>;
}

export function AccountSelect({ label, name, onAddAccount }) {
  const { loading, error, accounts } = useAccountsQuery();
  const { setFieldValue } = useFormikContext();

  const FieldLabel = label ? Label : FakeLabel;

  return (
    <Field name={name}>
      {({ field: { value } }) => (
        <>
          <FieldLabel htmlFor={name}>
            {label}
            <Select
              items={loading || error ? [] : accounts}
              onItemSelect={selectedValue => setFieldValue(name, selectedValue)}
              itemRenderer={renderAccount}
              itemPredicate={(query, account, _index, exactMatch) => {
                const normalizedAccount = account.name.toLowerCase();
                const normalizedQuery = query.toLowerCase();

                if (exactMatch) {
                  return normalizedAccount === normalizedQuery;
                } else {
                  return normalizedAccount.indexOf(normalizedQuery) >= 0;
                }
              }}
              createNewItemFromQuery={query => null}
              createNewItemRenderer={(query, active, handleClick) => (
                <MenuItem
                  icon="add"
                  text={`Create ${query}...`}
                  onClick={
                    () => onAddAccount(query)
                    /*dispatch({
                    type: 'open',
                    name: query,
                    onSaveEvent: account => {
                      setFieldValue(`splits[${index}].accountId`, {
                        value: account.id,
                        label: account.name,
                      });
                    },
                  })*/
                  }
                />
              )}
            >
              <WrappedButton
                text={value ? value.name : '(Select Account)'}
                rightIcon="double-caret-vertical"
              />
            </Select>
          </FieldLabel>

          <ErrorMessage name={name} component={FieldError} />
        </>
      )}
    </Field>
  );
}
