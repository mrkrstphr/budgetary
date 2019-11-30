import { Button } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import React from 'react';
import { Dialog } from 'component';
import { Input, Select } from 'component/Form';
import { useCreateAccount } from 'mutation';

function AddAccountForm({ initialValues, onClose, onSave }) {
  const [createAccount] = useCreateAccount();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(newAccount, { setSubmitting }) => {
        return createAccount(newAccount)
          .then(({ account }) => {
            setSubmitting(false);

            if (onSave) {
              onSave(account);
            }

            onClose();
            return { account };
          })
          .catch(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Dialog
          icon="plus"
          isOpen={true}
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

export default AddAccountForm;
