import { Button } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Input, Select } from 'component/Form';
import { useCreateAccount } from 'mutation';
import { Dialog } from './Dialog';
import { AppContext } from '../App/Context';

function AddAccountForm({ initialValues = { name: '' }, onClose, onSave }) {
  const [createAccount] = useCreateAccount();
  const { notify } = useContext(AppContext);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(newAccount, { setSubmitting }) =>
        createAccount(newAccount)
          .then(({ account }) => {
            setSubmitting(false);

            if (onSave) {
              onSave(account);
            }

            notify(`Account "${newAccount.name}" Created`);

            onClose();
            return { account };
          })
          .catch(() => {
            setSubmitting(false);
          })
      }
    >
      {({ handleSubmit, isSubmitting }) => (
        <Dialog
          icon="plus"
          isOpen
          title="Add Account"
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
          <Form>
            <Input label="Name" name="name" autoFocus />

            <Select
              name="type"
              label="Type"
              options={[
                { value: 'bank', label: 'Bank' },
                { value: 'expense', label: 'Expense' },
                { value: 'income', label: 'Income' },
                { value: 'liabilities', label: 'Liability' },
              ]}
            />
          </Form>
        </Dialog>
      )}
    </Formik>
  );
}

AddAccountForm.propTypes = {
  initialValues: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddAccountForm;
