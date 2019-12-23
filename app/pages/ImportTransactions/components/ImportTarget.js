import { Button, NonIdealState } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const ImportTargetStyles = styled.div`
  input[type='file'] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  label.transactions {
    display: inline-block;
  }

  .instructions {
    margin-left: 20px;
  }
`;

export default function ImportTarget({ fileSelected }) {
  return (
    <ImportTargetStyles>
      <NonIdealState
        icon="upload"
        title="Import Transactions"
        description={
          <p>
            Let&apos;s start by selecting a CSV (comma seperated values) file.
            These can often be exported from your financial institutions. Excel
            files can be opened in Excel and exported as CSV files.
          </p>
        }
        action={
          <div className="select">
            <input
              type="file"
              name="transactions"
              id="transactions"
              onChange={fileSelected}
            />
            <Button intent="success" icon="select">
              <label htmlFor="transactions" className="transactions">
                Select Import File
              </label>
            </Button>
          </div>
        }
      />
    </ImportTargetStyles>
  );
}

ImportTarget.propTypes = {
  fileSelected: PropTypes.func.isRequired,
};
