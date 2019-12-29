import { Button } from '@blueprintjs/core';
import React from 'react';
import { useGoals } from 'query';
import { PageTitle } from 'component';
import Goal from './component/Goal';

export default function GoalsPage() {
  const { error, loading, goals } = useGoals();

  if (error || loading) {
    // TODO FIXME: loading graphic + handle error state
    return null;
  }

  return (
    <div>
      <PageTitle
        title="Goals"
        action={
          <Button intent="success" icon="plus" onClick={() => null}>
            Create Goal
          </Button>
        }
      />
      <div>
        {goals.map(goal => (
          <Goal key={`goal-${goal.id}`} goal={goal} />
        ))}
      </div>
    </div>
  );
}
