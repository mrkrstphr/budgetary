import { Button } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Checkbox, Input, Select } from 'component/Form';
import { useUpdateAccount } from 'mutation';
import { Dialog } from '../../component/Dialog';
import { AppContext } from '../../App/Context';

const defaultInitialValues = { name: '', initialBalance: 0, showInMenu: false };

function EditAccount({
  initialValues = defaultInitialValues,
  onClose,
  onSave,
}) {
  const [updateAccount] = useUpdateAccount();
  const { notify } = useContext(AppContext);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={({ id, ...accountDetails }, { setSubmitting }) =>
        updateAccount(id, accountDetails)
          .then(({ account }) => {
            setSubmitting(false);
            if (onSave) {
              onSave(account);
            }
            notify(`Account "${account.name}" Update`);
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
          icon="edit"
          isOpen
          title="Edit Account"
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
            <Input
              type="number"
              label="Initial Balance"
              name="initialBalance"
            />
            <Checkbox label="Show In Sidebar?" name="showInMenu" />

            <Select
              name="type"
              label="Type"
              options={[
                { value: 'bank', label: 'Bank' },
                { value: 'credit', label: 'Credit' },
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

EditAccount.propTypes = {
  initialValues: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

export default EditAccount;
