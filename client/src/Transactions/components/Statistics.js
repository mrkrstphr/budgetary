import React from 'react';

export default ({ month }) => (
  <div>
    <p>Expenses: {month.totalExpenses}</p>
    <p>Income: {month.totalIncome}</p>
  </div>
);
