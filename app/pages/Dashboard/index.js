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
      <div style={{ width: '100%', height: 320 }}>
        <NetIncomeChart months={months} />
      </div>
    </>
  );
}
