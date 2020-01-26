import { initialState, reducer } from './reducer';

const sampleHeaders = ['Date', 'Description', 'Amount'];
const sampleRows = [
  ['2019-10-20', 'Bought Gas', -30],
  ['2019-10-20', 'Paid Bill', -390],
  ['2019-10-21', 'Bought Pizza', -11],
  ['2019-10-21', 'Sold Services', 1500],
  ['2019-10-22', 'Bought Gas', -35],
  ['2019-10-23', 'Bought Food', -75],
];

describe('ImportTransactions reducer', () => {
  describe('invalid action', () => {
    it('should throw an error', () => {
      let result;
      try {
        reducer({}, { type: 'zombie' });
      } catch (e) {
        result = e;
      }

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('action::mapColumn', () => {
    it('should store a key-value-pair for the column', () => {
      const result = reducer(
        { columnMappings: { description: 'Column 2' } },
        { type: 'mapColumn', field: 'amount', value: 'Column 3' },
      );
      expect(result.columnMappings).toEqual({
        description: 'Column 2',
        amount: 'Column 3',
      });
    });
  });

  describe('action::mapTransaction', () => {
    it('should add the category mapped to the specific row by index', () => {
      const result = reducer(
        { transactionAccountMappings: { 1: 'ID4' } },
        { type: 'mapTransaction', index: 3, value: 'ID9' },
      );
      expect(result.transactionAccountMappings).toEqual({
        1: 'ID4',
        3: 'ID9',
      });
    });
  });

  describe('action::pickFile', () => {
    it('should autogenerate some columns matching the number of columns in the data', () => {
      const rows = [sampleHeaders, ...sampleRows];
      const result = reducer(
        {},
        { type: 'pickFile', file: 'not_a_file.jpg', data: rows },
      );
      expect(result.columns).toEqual(['Column 1', 'Column 2', 'Column 3']);
    });

    it('should add all the rows from the data', () => {
      const rows = [sampleHeaders, ...sampleRows];
      const result = reducer(
        {},
        { type: 'pickFile', file: 'not_a_file.jpg', data: rows },
      );
      expect(result.rows).toEqual(rows);
    });

    it('should selected all the rows by default', () => {
      const rows = [sampleHeaders, ...sampleRows];
      const result = reducer(
        {},
        { type: 'pickFile', file: 'not_a_file.jpg', data: rows },
      );
      expect(result.selectedRows).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });
  });

  describe('action::reset', () => {
    it('should reset the state back to initialState', () => {
      expect(reducer({}, { type: 'reset' })).toEqual(initialState);
    });
  });

  describe('action::setUseFirstRowAsHeader', () => {
    it('should set the firstRowAsHeaders value appropriately', () => {
      const result = reducer(
        {
          columns: ['Column 1', 'Column 2', 'Column 3'],
          rows: [sampleHeaders, ...sampleRows],
          selectedRows: [0, 1, 2, 3, 4, 5, 6],
        },
        { type: 'setUseFirstRowAsHeaders', value: true },
      );
      expect(result.firstRowAsHeaders).toEqual(true);

      const result2 = reducer(result, {
        type: 'setUseFirstRowAsHeaders',
        value: false,
      });
      expect(result2.firstRowAsHeaders).toEqual(false);
    });

    it('should pluck the first row and set as headers and remove it from the rows, when true', () => {
      const result = reducer(
        {
          columns: ['Column 1', 'Column 2', 'Column 3'],
          rows: [sampleHeaders, ...sampleRows],
          selectedRows: [0, 1, 2, 3, 4, 5, 6],
        },
        { type: 'setUseFirstRowAsHeaders', value: true },
      );
      expect(result.columns).toEqual(sampleHeaders);
      expect(result.rows).toEqual(sampleRows);
    });

    it('should push the headers back into the rows and autogenerate new headers, when false', () => {
      const myRows = [...sampleRows];
      const myHeaders = myRows.shift();
      const result = reducer(
        {
          columns: myHeaders,
          rows: myRows,
          selectedRows: [0, 1, 2, 3, 4, 5],
        },
        { type: 'setUseFirstRowAsHeaders', value: false },
      );
      expect(result.columns).toEqual(['Column 1', 'Column 2', 'Column 3']);
      expect(result.rows).toEqual(sampleRows);
    });

    xit('should properly set the selectedRows, false => true', () => {
      // TODO FIXME I think the logic in the reducer is not correct...
    });
  });

  describe('action::setOffsetAccount', () => {
    it('should set the offset account to the value', () => {
      expect(
        reducer({}, { type: 'setOffsetAccount', value: '14111' }).offsetAccount,
      ).toEqual('14111');
    });
  });

  describe('action::selectAll', () => {
    it('should select all the rows, when true', () => {
      const result = reducer(
        { rows: sampleRows },
        { type: 'selectAll', value: true },
      );
      expect(result.selectAll).toEqual(true);
      expect(result.selectedRows).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('should deselect all the rows, when false', () => {
      const result = reducer(
        { rows: sampleRows, selectedRows: [0, 1, 2, 3, 4, 5] },
        { type: 'selectAll', value: false },
      );
      expect(result.selectAll).toEqual(false);
      expect(result.selectedRows).toEqual([]);
    });
  });

  describe('action::selectRow', () => {
    it('should set selectAll to false', () => {
      const result = reducer(
        { rows: sampleRows, selectAll: true, selectedRows: [0, 1, 2, 3, 4, 5] },
        { type: 'selectRow', value: 2 },
      );
      expect(result.selectAll).toEqual(false);
    });

    it('should add a previously unselected row to the selected collection', () => {
      const result = reducer(
        { rows: sampleRows, selectAll: true, selectedRows: [0, 3, 4] },
        { type: 'selectRow', value: 2 },
      );
      expect(result.selectedRows).toEqual([0, 3, 4, 2]);
    });

    it('should remove a previously selected row to the selected collection', () => {
      const result = reducer(
        { rows: sampleRows, selectAll: true, selectedRows: [0, 1, 3, 4] },
        { type: 'selectRow', value: 3 },
      );
      expect(result.selectedRows).toEqual([0, 1, 4]);
    });
  });

  describe('action::toggleConfirmReset', () => {
    it('should set the boolean value to the opposite of the current value', () => {
      expect(
        reducer({ confirmResetOpen: false }, { type: 'toggleConfirmReset' })
          .confirmResetOpen,
      ).toEqual(true);

      expect(
        reducer({ confirmResetOpen: true }, { type: 'toggleConfirmReset' })
          .confirmResetOpen,
      ).toEqual(false);
    });
  });

  describe('action::toggleConfirmFinish', () => {
    it('should set the boolean value to the opposite of the current value', () => {
      expect(
        reducer({ confirmFinishOpen: false }, { type: 'toggleConfirmFinish' })
          .confirmFinishOpen,
      ).toEqual(true);

      expect(
        reducer({ confirmFinishOpen: true }, { type: 'toggleConfirmFinish' })
          .confirmFinishOpen,
      ).toEqual(false);
    });
  });
});
