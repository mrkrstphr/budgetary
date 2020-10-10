const initialState = {
  firstRowAsHeaders: false,
  columns: [],
  rows: [],
  selectedRows: [],
  selectAll: true,
  confirmResetOpen: false,
  confirmFinishOpen: false,
  columnMappings: {},
  offsetAccount: null,
  transactionAccountMappings: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'pickFile':
      return {
        ...state,
        columns: Array.from(action.data[0].keys()).map(
          (i) => `Column ${i + 1}`,
        ),
        rows: action.data,
        selectedRows: Array.from(action.data.keys()),
      };

    case 'setUseFirstRowAsHeaders': {
      const rows = action.value
        ? [...state.rows]
        : [state.columns, ...state.rows];
      const columns = action.value
        ? rows.shift()
        : Array.from(state.rows[0].keys()).map((i) => `Column ${i + 1}`);

      return {
        ...state,
        rows,

        firstRowAsHeaders: action.value,
        columns,
        selectedRows: state.selectAll
          ? Array.from(rows.keys())
          : state.selectedRows.filter((row, index) => index !== 0),
      };
    }

    case 'setOffsetAccount':
      return {
        ...state,
        offsetAccount: action.value,
      };

    case 'selectAll':
      return {
        ...state,
        selectAll: action.value,
        selectedRows: action.value ? [...Array.from(state.rows.keys())] : [],
      };

    case 'selectRow':
      return {
        ...state,
        selectAll: false,
        selectedRows: state.selectedRows.includes(action.value)
          ? state.selectedRows.filter((r) => r !== action.value)
          : [...state.selectedRows, action.value],
      };

    case 'toggleConfirmReset':
      return { ...state, confirmResetOpen: !state.confirmResetOpen };

    case 'toggleConfirmFinish':
      return { ...state, confirmFinishOpen: !state.confirmFinishOpen };

    case 'mapColumn':
      return {
        ...state,
        columnMappings: {
          ...state.columnMappings,
          [action.field]: action.value,
        },
      };

    case 'mapTransaction':
      return {
        ...state,
        transactionAccountMappings: {
          ...state.transactionAccountMappings,
          [action.index]: action.value,
        },
      };

    case 'reset':
      return initialState;

    default:
      throw new Error();
  }
}

export { initialState, reducer };
