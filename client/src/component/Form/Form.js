import { get, merge } from 'lodash';
import React, { PureComponent } from 'react';

class Form extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { values: props.initialValues || {}, errors: {} };
  }

  getValue = field => {
    return get(this.state.values, field);
  };

  mergeState = newState => {
    const mergedState = { ...this.state.values };
    merge(mergedState, newState);
    this.setState({ values: mergedState });
  };

  submit = () => {
    const { onSubmit, prepareValuesForSubmit, validate } = this.props;

    if (validate) {
      const errors = validate(this.state.values);
      if (errors && Object.keys(errors).length > 0) {
        this.setState({ errors });
        return;
      }
    }

    const submitValues = prepareValuesForSubmit
      ? prepareValuesForSubmit(this.state.values)
      : this.state.values;

    return onSubmit(submitValues).catch(e => {
      if (e.validationErrors) {
        this.setState({ errors: e.validationErrors });
      }
    });
  };

  render() {
    const { render, debug = false } = this.props;

    return (
      <div>
        <div>
          {render({
            submit: this.submit,
            container: {
              errors: this.state.errors,
              getValue: this.getValue,
              mergeState: this.mergeState,
            },
          })}
        </div>
        {debug && <pre>{JSON.stringify(this.state.values, null, 2)}</pre>}
      </div>
    );
  }
}

export default Form;
