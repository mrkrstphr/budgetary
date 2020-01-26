import { Button } from '@blueprintjs/core';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import * as Yup from 'yup';
import { Dialog } from 'component/Dialog';
import { formatIsoDate } from 'lib';
import { useCreateGoal } from 'mutation';
import GoalForm from './GoalForm';
import { AppContext } from '../../../App/Context';

const AddGoalSchema = Yup.object().shape({
  account: Yup.object()
    .shape({
      id: Yup.string().required(),
    })
    .required(),
  description: Yup.string().required(),
  dueDate: Yup.date()
    .min(new Date(), 'Due Date must be greater than today')
    .required('Due Date is required')
    .typeError('Due Date is required and must be a valid date'),
  goalBalance: Yup.number().required('Goal Amount is required'),
});

function AddGoalForm({ onClose }) {
  const [createGoal] = useCreateGoal();

  const initialValues = {
    description: '',
    dueDate: null,
    goalBalance: '',
  };

  return (
    <AppContext.Consumer>
      {({ notify }) => (
        <Formik
          initialValues={initialValues}
          validationSchema={AddGoalSchema}
          validateOnBlur={false}
          onSubmit={(
            { account: { id: accountId } = {}, dueDate, ...goal } = {},
            { setSubmitting },
          ) =>
            createGoal({
              accountId,
              dueDate: formatIsoDate(dueDate),
              ...goal,
            })
              .then(({ errors }) => {
                setSubmitting(false);
                if (errors) {
                  notify('Failed to Create Goal', 'danger');
                } else {
                  notify('Goal Created Successfully');
                  onClose();
                }
              })
              .catch(() => {
                notify('Failed to Create Goal', 'danger');
                setSubmitting(false);
              })
          }
        >
          {({ handleSubmit, isSubmitting }) => (
            <Dialog
              icon="plus"
              isOpen
              title="Add Goal"
              onClose={onClose}
              footer={
                <>
                  <Button onClick={onClose}>Close</Button>
                  <Button
                    intent="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </>
              }
            >
              <GoalForm />
            </Dialog>
          )}
        </Formik>
      )}
    </AppContext.Consumer>
  );
}

AddGoalForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddGoalForm;
