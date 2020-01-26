import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const GoalStyles = styled.div`
  .title {
    margin-bottom: 0;
  }

  .bar {
    border-radius: 3px;
    height: 30px;
    margin: 4px auto;

    &.red {
      border: 1px solid darkred;

      .progress {
        background-color: darkred;
        background: repeating-linear-gradient(
          45deg,
          darkred,
          darkred 7px,
          firebrick 7px,
          firebrick 14px
        );
      }
    }

    &.green {
      border: 1px solid limegreen;

      .progress {
        background-color: limegreen;
        background: repeating-linear-gradient(
          45deg,
          limegreen,
          limegreen 7px,
          lightgreen 7px,
          lightgreen 14px
        );
      }
    }

    &.yellow {
      border: 1px solid gold;

      .progress {
        background-color: gold;
        background: repeating-linear-gradient(
          45deg,
          gold,
          gold 7px,
          yellow 7px,
          yellow 14px
        );
      }
    }

    .progress {
      border-radius: 3px;
      height: 100%;
    }
  }

  .details {
    align-items: center;
    display: flex;

    .account {
      flex: 1;
    }
  }
`;

function calculateGoalPercentage(goal) {
  if (goal.account.type === 'bank') {
    return Math.min(goal.account.currentBalance / goal.goalBalance, 1) * 100;
  }

  if (goal.account.type === 'liabilities') {
    // FIXME this assumes the goal balance is 0
    return Math.abs(
      Math.min(goal.account.currentBalance / goal.startingBalance, 1) * 100,
    );
  }

  return 0;
}

function getBarColor(goal) {
  const percentage = calculateGoalPercentage(goal);

  if (goal.account.type === 'bank') {
    if (percentage > 75) {
      return 'green';
    }

    if (percentage > 50) {
      return 'yellow';
    }
  }

  if (goal.account.type === 'liabilities') {
    if (percentage < 10) {
      return 'green';
    }
    if (percentage < 50) {
      return 'yellow';
    }
  }

  return 'red';
}

export default function Goal({ goal }) {
  return (
    <GoalStyles>
      <h3 className="title">{goal.description}</h3>
      <div className={`bar ${getBarColor(goal)}`}>
        <div
          className="progress"
          style={{ width: `${calculateGoalPercentage(goal)}%` }}
        />
      </div>
      <div className="details">
        <div className="account">Account: {goal.account.name}</div>
        <div className="amount">
          Goal:{' '}
          {new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(goal.goalBalance)}
        </div>
      </div>
    </GoalStyles>
  );
}

Goal.propTypes = {
  goal: PropTypes.shape({
    description: PropTypes.string.isRequired,
    account: PropTypes.shape({
      currentBalance: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bank', 'liabilities', 'credit']),
    }).isRequired,
    startingBalance: PropTypes.number.isRequired,
    goalBalance: PropTypes.number.isRequired,
  }).isRequired,
};
