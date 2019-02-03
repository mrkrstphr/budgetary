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
    account(id: ID!): Account @protected
    accounts(filter: String): [Account] @protected
    months: [Month] @protected
    transactions(
      filters: TransactionFilterInput
      paging: PagingInput
    ): TransactionCollection @protected
    spendingBreakdown(month: String!): [SpendingCategory] @protected
    netIncomeStats: NetIncomeStats!
  }

  type Mutation {
    createAccount(account: CreateAccountInput!): AccountPayload! @protected
    createToken(email: String!, password: String): TokenPayload
    createTransaction(
      transaction: CreateTransactionInput!
    ): TransactionPayload! @protected
    updateAccount(id: ID!, account: UpdateAccountInput!): AccountPayload!
      @protected
  }
`;
