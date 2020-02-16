export const transactionFragment = `
  id
  date
  description
  amount
  accounts {
    id
    account {
      id
      name
    }
    amount
  }
`;
