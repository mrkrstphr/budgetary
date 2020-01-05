import { Button, NonIdealState } from '@blueprintjs/core';
import React from 'react';
import { useGoals } from 'query';
import { PageTitle } from 'component';
import { useToggle } from 'lib';
import Goal from './component/Goal';
import AddGoalForm from './component/AddGoalForm';

export default function GoalsPage() {
  const { error, loading, goals } = useGoals();
  const [isAddOpen, toggleAddOpen] = useToggle();

  if (error || loading) {
    // TODO FIXME: loading graphic + handle error state
    return null;
  }

  return (
    <div>
      <PageTitle
        title="Goals"
        action={
          <Button intent="success" icon="plus" onClick={toggleAddOpen}>
            Create Goal
          </Button>
        }
      />
      <div>
        {isAddOpen && (
          <AddGoalForm onClose={toggleAddOpen} onSave={() => null} />
        )}
        {goals.map(goal => (
          <Goal key={`goal-${goal.id}`} goal={goal} />
        ))}
        {goals.length === 0 && (
          <NonIdealState
            icon="inbox"
            title="No Goals Found"
            description="You haven't defined any goals yet. Let's get started!"
            action={
              <Button intent="success" icon="plus" onClick={toggleAddOpen}>
                Create First Goal
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
