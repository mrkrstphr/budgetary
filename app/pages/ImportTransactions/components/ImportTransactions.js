import {
  Alert,
  Button,
  Checkbox,
  HTMLSelect,
  HTMLTable,
  Intent,
} from '@blueprintjs/core';
import moment from 'moment';
import Papa from 'papaparse';
import PropTypes from 'prop-types';
import React, { useReducer } from 'react';
import { FieldColumn, FieldRow, Label } from 'component/Form';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { useHistory } from 'react-router-dom';
import { initialState, reducer } from '../reducer';
import SelectCategory from '../../../component/SelectCategory';
import ImportTarget from './ImportTarget';
import { ToastContext } from '../../../component/ToastContext';

function getMappingOptionsFor(state, columnName) {
  const columns = state.columns.filter(column => {
    const isNotMapped = !Object.values(state.columnMappings).includes(column);
    const isMappedToCurrentColumn =
      columnName in state.columnMappings &&
      state.columnMappings[columnName] === column;

    return isNotMapped || isMappedToCurrentColumn;
  });

  return (
    <>
      <option> </option>
      {columns.map(column => (
        <option key={`trans-account-option-${column}`} value={column}>
          {column}
        </option>
      ))}
    </>
  );
}

const ImportOptions = ({ dispatch, state }) => (
  <div>
    <h3>Options</h3>

    <FieldRow>
      <FieldColumn>
        <Label>Offset Account:</Label>
        <SelectCategory
          value={state.offsetAccount}
          onChange={account => {
            dispatch({
              type: 'setOffsetAccount',
              value: account,
            });
          }}
        />
      </FieldColumn>
    </FieldRow>

    <FieldRow>
      <FieldColumn>
        <Checkbox
          checked={state.firstRowAsHeaders}
          label="Use First Row as Headers"
          onChange={() =>
            dispatch({
              type: 'setUseFirstRowAsHeaders',
              value: !state.firstRowAsHeaders,
            })
          }
        />
      </FieldColumn>
    </FieldRow>

    <HTMLTable style={{ width: '100%' }} striped interactive>
      <thead>
        <tr>
          <th colSpan="2">Import Column Mapping</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Transaction Date</td>
          <td>
            <HTMLSelect
              onChange={e =>
                dispatch({
                  type: 'mapColumn',
                  field: 'date',
                  value: e.target.value,
                })
              }
            >
              {getMappingOptionsFor(state, 'date')}
            </HTMLSelect>
          </td>
        </tr>
        <tr>
          <td>Description</td>
          <td>
            <HTMLSelect
              onChange={e =>
                dispatch({
                  type: 'mapColumn',
                  field: 'description',
                  value: e.target.value,
                })
              }
            >
              {getMappingOptionsFor(state, 'description')}
            </HTMLSelect>
          </td>
        </tr>
        <tr>
          <td>Amount</td>
          <td>
            <HTMLSelect
              onChange={e =>
                dispatch({
                  type: 'mapColumn',
                  field: 'amount',
                  value: e.target.value,
                })
              }
            >
              {getMappingOptionsFor(state, 'amount')}
            </HTMLSelect>
          </td>
        </tr>
      </tbody>
    </HTMLTable>

    <Button
      intent="danger"
      onClick={() => dispatch({ type: 'toggleConfirmReset' })}
    >
      Reset
    </Button>
    <Alert
      cancelButtonText="Cancel"
      confirmButtonText="Start Over"
      icon="outdated"
      intent={Intent.DANGER}
      isOpen={state.confirmResetOpen}
      onCancel={() => dispatch({ type: 'toggleConfirmReset' })}
      onConfirm={() => dispatch({ type: 'reset' })}
    >
      <p>Are you sure you want start over with a new file?</p>
    </Alert>
  </div>
);

ImportOptions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.shape({
    firstRowAsHeaders: PropTypes.bool.isRequired,
    offsetAccount: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

function getTransactionsToImport(state) {
  const transactions = state.selectedRows.map(index => ({
    date: moment(
      state.rows[index][state.columns.indexOf(state.columnMappings.date)],
    ).format('YYYY-MM-DD'),
    description:
      state.rows[index][
        state.columns.indexOf(state.columnMappings.description)
      ],
    accounts: [
      {
        accountId: state.transactionAccountMappings[index].id,
        amount:
          parseFloat(
            state.rows[index][
              state.columns.indexOf(state.columnMappings.amount)
            ],
          ) * -1,
      },
      {
        accountId: state.offsetAccount.id,
        amount: parseFloat(
          state.rows[index][state.columns.indexOf(state.columnMappings.amount)],
        ),
      },
    ],
  }));

  return transactions;
}

const bulkImportQuery = gql`
  mutation bulkImport($transactions: [CreateTransactionInput]!) {
    bulkImport(transactions: $transactions)
  }
`;

function BulkImport({ children }) {
  return (
    <Mutation mutation={bulkImportQuery}>
      {bulkImport =>
        children(transactions => bulkImport({ variables: { transactions } }))
      }
    </Mutation>
  );
}

BulkImport.propTypes = {
  children: PropTypes.func.isRequired,
};

function TransactionsTable({ dispatch, state }) {
  const history = useHistory();

  return (
    <ToastContext.Consumer>
      {toaster => (
        <BulkImport>
          {bulkImport => (
            <div>
              <HTMLTable style={{ width: '100%' }} striped interactive>
                <thead>
                  <tr>
                    <th>
                      <Checkbox
                        checked={state.selectAll}
                        onClick={() =>
                          dispatch({
                            type: 'selectAll',
                            value: !state.selectAll,
                          })
                        }
                      />
                    </th>
                    {state.columns.map(column => (
                      <th key={`header-${column}`}>{column}</th>
                    ))}
                    <th>Account Mapping</th>
                  </tr>
                </thead>
                <tbody>
                  {state.rows.map((transaction, index) => (
                    <tr key={`transaction-${transaction.id}`}>
                      <td>
                        <Checkbox
                          checked={
                            state.selectAll ||
                            state.selectedRows.includes(index)
                          }
                          onClick={() =>
                            dispatch({
                              type: 'selectRow',
                              value: index,
                            })
                          }
                        />
                      </td>
                      {transaction.map(column => (
                        <td
                          className="right"
                          key={`transaction-${transaction.id}-${column}`}
                        >
                          {column}
                        </td>
                      ))}
                      <td>
                        <SelectCategory
                          value={state.transactionAccountMappings[index]}
                          onChange={category => {
                            dispatch({
                              type: 'mapTransaction',
                              index,
                              value: category,
                            });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>

              <Alert
                cancelButtonText="Cancel"
                confirmButtonText="Continue"
                icon="help"
                intent={Intent.DANGER}
                isOpen={state.confirmFinishOpen}
                onCancel={() => dispatch({ type: 'toggleConfirmFinish' })}
                onConfirm={async () => {
                  const transactions = getTransactionsToImport(state);
                  await bulkImport(transactions);
                  dispatch({ type: 'toggleConfirmFinish' });
                  toaster.show({
                    icon: 'tick-circle',
                    intent: 'success',
                    message: `(${
                      transactions.length
                    }) Transactions Imported Successfully`,
                  });
                  history.push('/transactions');
                }}
              >
                <p>
                  Are you sure you want to import the selected transactions?
                </p>
              </Alert>

              <Button
                intent="success"
                onClick={() => dispatch({ type: 'toggleConfirmFinish' })}
              >
                Finish Import
              </Button>
            </div>
          )}
        </BulkImport>
      )}
    </ToastContext.Consumer>
  );
}

TransactionsTable.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.shape({
    firstRowAsHeaders: PropTypes.bool.isRequired,
    offsetAccount: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default function ImportTransactions() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function fileSelected(details) {
    const reader = new FileReader();
    reader.onload = function onCsvFileLoad() {
      const csv = Papa.parse(reader.result, { skipEmptyLines: true });
      // TODO: FIXME: check - csv.errors
      // TODO: FIXME: check - csv.meta.truncated, csv.meta.aborted
      dispatch({ type: 'pickFile', data: csv.data, file: csv });
    };
    reader.readAsText(details.target.files[0]);
  }

  return (
    <div>
      {state.rows.length === 0 && <ImportTarget fileSelected={fileSelected} />}

      <div>
        {state.rows.length > 0 && (
          <>
            <ImportOptions dispatch={dispatch} state={state} />
            <TransactionsTable
              rows={state.rows}
              selectAll={state.selectAll}
              firstRowAsHeaders={state.firstRowAsHeaders}
              dispatch={dispatch}
              state={state}
            />
          </>
        )}
      </div>
    </div>
  );
}
