import React from 'react';
import { useMonths } from 'query';
import { PageTitle } from 'component';
import NetIncomeChart from './components/NetIncomeChart';
import Statistics from './components/Statistics';

export default function Dashboard() {
  const { loading, months } = useMonths();

  if (loading) {
    return null;
  }

  return (
    <>
      <PageTitle title="Dashboard" />
      <Statistics statistics={{}} />

      <h3>Net Income by Month</h3>
      <p
        style={{
          borderLeft: '3px solid #ccc',
          fontStyle: 'italic',
          color: '#bbb',
          marginBottom: 15,
          marginTop: 0,
          paddingLeft: 10,
        }}
      >
        Displays net income (income - expenses) by Month.
      </p>

      <div style={{ height: 420, width: '100%' }}>
        <NetIncomeChart months={months} />
      </div>
    </>
  );
}
