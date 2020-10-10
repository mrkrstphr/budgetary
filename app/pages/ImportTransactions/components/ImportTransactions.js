/* eslint-disable react/no-array-index-key */
import {
  Alert,
  Button,
  Checkbox,
  HTMLSelect,
  HTMLTable,
  Intent,
} from '@blueprintjs/core';
import Papa from 'papaparse';
import PropTypes from 'prop-types';
import React, { useReducer } from 'react';
import { FieldColumn, FieldRow, Label } from 'component/Form';
import { Mutation } from '@apollo/client/react/components';
import gql from 'graphql-tag';
import { useHistory } from 'react-router-dom';
import { formatIsoDate } from 'lib';
import { initialState, reducer } from '../reducer';
import SelectCategory from '../../../component/SelectCategory';
import ImportTarget from './ImportTarget';
import { AppContext } from '../../../App/Context';

function getMappingOptionsFor(state, columnName) {
  const columns = state.columns.filter((column) => {
    const isNotMapped = !Object.values(state.columnMappings).includes(column);
    const isMappedToCurrentColumn =
      columnName in state.columnMappings &&
      state.columnMappings[columnName] === column;

    return isNotMapped || isMappedToCurrentColumn;
  });

  return (
    <>
      <option> </option>
      {columns.map((column) => (
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
          onChange={(account) => {
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
              onChange={(e) =>
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
              onChange={(e) =>
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
              onChange={(e) =>
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
    confirmResetOpen: PropTypes.bool.isRequired,
    firstRowAsHeaders: PropTypes.bool.isRequired,
    offsetAccount: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

function getTransactionsToImport(state) {
  const transactions = state.selectedRows.map((index) => ({
    date: formatIsoDate(
      state.rows[index][state.columns.indexOf(state.columnMappings.date)],
    ),
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
      {(bulkImport) =>
        children((transactions) => bulkImport({ variables: { transactions } }))
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
    <AppContext.Consumer>
      {({ notify }) => (
        <BulkImport>
          {(bulkImport) => (
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
                    {state.columns.map((column) => (
                      <th key={`header-${column}`}>{column}</th>
                    ))}
                    <th>Account Mapping</th>
                  </tr>
                </thead>
                <tbody>
                  {state.rows.map((csvRow, csvRowIndex) => (
                    <tr key={`transaction-${csvRowIndex}`}>
                      <td>
                        <Checkbox
                          checked={
                            state.selectAll ||
                            state.selectedRows.includes(csvRowIndex)
                          }
                          onClick={() =>
                            dispatch({
                              type: 'selectRow',
                              value: csvRowIndex,
                            })
                          }
                        />
                      </td>
                      {csvRow.map((column, columnIndex) => (
                        <td
                          className="right"
                          key={`transaction-${csvRowIndex}-${state.columns[columnIndex]}`}
                        >
                          {column}
                        </td>
                      ))}
                      <td>
                        <SelectCategory
                          value={state.transactionAccountMappings[csvRowIndex]}
                          onChange={(category) => {
                            dispatch({
                              type: 'mapTransaction',
                              index: csvRowIndex,
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
                  notify(
                    `(${transactions.length}) Transactions Imported Successfully`,
                  );
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
    </AppContext.Consumer>
  );
}

TransactionsTable.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    confirmFinishOpen: PropTypes.bool.isRequired,
    firstRowAsHeaders: PropTypes.bool.isRequired,
    offsetAccount: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    selectAll: PropTypes.bool.isRequired,
    selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
    transactionAccountMappings: PropTypes.object.isRequired,
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
      dispatch({ type: 'pickFile', data: csv.data });
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
