import { Button, Label, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FieldError } from 'component/Form';
import { highlightText, useToggle } from 'lib';
import { useAccounts } from 'query';
import styled from 'styled-components';
import AddAccountForm from './AddAccountForm';
import { FakeLabel } from './Form/FakeLabel';

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

function filterAccounts(accounts, allowedTypes) {
  return allowedTypes.length === 0
    ? accounts
    : accounts.filter(account =>
        allowedTypes.includes(account.type.toLowerCase()),
      );
}

export function AccountSelect({ allowedTypes = [], label, name }) {
  const { loading, error, accounts, refetch } = useAccounts();
  const { setFieldValue } = useFormikContext();
  const [isAddOpen, toggleAddOpen] = useToggle();
  const [addQuery, setAddQuery] = React.useState();

  const FieldLabel = label ? Label : FakeLabel;

  return (
    <>
      {isAddOpen && (
        <AddAccountForm
          initialValues={{ name: addQuery }}
          onClose={toggleAddOpen}
          onSave={account =>
            refetch().then(() => {
              setFieldValue(name, account);
              toggleAddOpen();
            })
          }
        />
      )}
      <Field name={name}>
        {({ field: { value } }) => (
          <>
            <FieldLabel htmlFor={name}>
              {label}
              <Select
                items={
                  loading || error ? [] : filterAccounts(accounts, allowedTypes)
                }
                onItemSelect={selectedValue =>
                  setFieldValue(name, selectedValue)
                }
                itemRenderer={renderAccount}
                itemPredicate={(query, account, _index, exactMatch) => {
                  const normalizedAccount = account.name.toLowerCase();
                  const normalizedQuery = query.toLowerCase();

                  if (exactMatch) {
                    return normalizedAccount === normalizedQuery;
                  }
                  return normalizedAccount.indexOf(normalizedQuery) >= 0;
                }}
                createNewItemFromQuery={() => null}
                createNewItemRenderer={query => (
                  <MenuItem
                    icon="add"
                    text={`Create ${query}...`}
                    onClick={() => {
                      setAddQuery(query);
                      toggleAddOpen();
                    }}
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
    </>
  );
}

AccountSelect.propTypes = {
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};
