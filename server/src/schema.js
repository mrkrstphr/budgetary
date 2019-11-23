import { gql } from 'apollo-server';

export default gql`
  scalar Date
  scalar DateTime
  scalar JSON

  directive @protected on FIELD_DEFINITION

  type ErrorDetails {
    field: String!
    message: String!
    details: JSON
  }

  type PagingInfo {
    perPage: Int
    page: Int
    totalPages: Int
    totalRecords: Int
  }

  input PagingInput {
    page: Int
    perPage: Int
  }

  type Account {
    id: ID!
    parent: Account
    name: String!
    type: String!

    isOpen: Boolean!
    showInMenu: Boolean!

    currentBalance: Float!

    thisMonth: Float!
    lastMonth: Float!
    thisYear: Float!
    total: Float!

    transactions: [Transaction]
  }

  type AccountPayload {
    errors: [ErrorDetails]
    account: Account
  }

  input CreateAccountInput {
    parentId: ID
    name: String!
    type: String!
  }

  input UpdateAccountInput {
    parentId: ID
    name: String
    type: String
  }

  type Transaction {
    id: ID!
    date: Date!
    description: String!
    amount: Float
    accounts: [AccountTransaction]
  }

  type AccountTransaction {
    id: ID!
    account: Account
    transaction: Transaction
    amount: Float
    reconciliation: Reconciliation
  }

  type TransactionCollection {
    items: [Transaction]
    paging: PagingInfo
  }

  input TransactionFilterInput {
    month: String
    accountId: ID
  }

  type TransactionPayload {
    errors: [ErrorDetails]
    transaction: Transaction
  }

  input CreateTransactionAccountInput {
    accountId: ID!
    amount: Float!
  }

  input CreateTransactionInput {
    date: Date!
    description: String!
    accounts: [CreateTransactionAccountInput]
  }

  input UpdateTransactionAccountInput {
    id: ID
    accountId: ID!
    amount: Float!
  }

  input UpdateTransactionInput {
    date: Date!
    description: String!
    accounts: [UpdateTransactionAccountInput]
  }

  type Month {
    name: String!
    totalExpenses: Float!
    totalIncome: Float!
  }

  type SpendingCategory {
    id: ID!
    category: String!
    amount: Float!
  }

  enum ReconcilationStatus {
    Open
    Complete
  }

  input ReconciliationDetailsInput {
    startDate: Date!
    endDate: Date!
    startingBalance: Float!
    endingBalance: Float!
  }

  type Reconciliation {
    id: ID!
    account: Account!
    startDate: Date!
    endDate: Date!
    startingBalance: Float!
    endingBalance: Float!
    transactions: [Transaction]!
    status: ReconcilationStatus!
    created: DateTime!
  }

  type User {
    id: ID!
    email: String!
  }

  type Token {
    id: ID!
    token: String!
    expires: DateTime!
    user: User!
  }

  type TokenPayload {
    token: Token
    errors: JSON
  }

  type NetIncomeStats {
    thisMonth: Float!
    lastMonth: Float!
    threeMonths: Float!
    twelveMonths: Float!
  }

  type Query {
    account(id: ID!): Account
    accounts(filter: String): [Account]
    months: [Month]
    reconciliations(accountId: ID!): [Reconciliation]!
    reconciliation(id: ID!): Reconciliation!
    transactions(
      filters: TransactionFilterInput
      paging: PagingInput
    ): TransactionCollection
    spendingBreakdown(month: String!): [SpendingCategory]
    netIncomeStats: NetIncomeStats!
  }

  type ReconciliationPayload {
    reconciliation: Reconciliation
    errors: [ErrorDetails]
  }

  type Mutation {
    bulkImport(transactions: [CreateTransactionInput]!): Boolean

    createAccount(account: CreateAccountInput!): AccountPayload!

    createToken(email: String!, password: String): TokenPayload

    createReconciliation(
      accountId: ID!
      details: ReconciliationDetailsInput!
    ): ReconciliationPayload!

    createTransaction(transaction: CreateTransactionInput!): TransactionPayload!

    deleteTransaction(id: ID!): Boolean

    finishReconciliation(id: ID!): ReconciliationPayload!

    markReconciled(accountId: ID!, reconciliationId: ID): AccountTransaction!

    updateAccount(id: ID!, account: UpdateAccountInput!): AccountPayload!

    updateTransaction(
      id: ID!
      transaction: UpdateTransactionInput
    ): TransactionPayload
  }
`;
