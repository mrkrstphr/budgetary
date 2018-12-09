import { gql } from 'apollo-server';

export default gql`
  scalar Date
  scalar JSON

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
    start: Date
    end: Date
    accountId: ID!
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

  type Query {
    account: Account
    accounts(filter: String): [Account]
    transactions(
      filter: TransactionFilterInput
      paging: PagingInput
    ): TransactionCollection
  }

  type Mutation {
    createAccount(account: CreateAccountInput!): AccountPayload!
    createTransaction(transaction: CreateTransactionInput!): TransactionPayload!
    updateAccount(id: ID!, account: UpdateAccountInput!): AccountPayload!
  }
`;
