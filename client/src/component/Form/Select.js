import React from 'react';
import ReactSelect from 'react-select';

export class Select extends React.Component {
  handleChange = value => {
    this.props.onChange(this.props.name, value);
  };

  handleBlur = () => {
    this.props.onBlur(this.props.name, true);
  };

  render() {
    const { options, ...props } = this.props;

    return (
      <div>
        <ReactSelect
          {...props}
          options={options}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />
        {!!this.props.error && this.props.touched && (
          <div style={{ color: 'red', marginTop: '.5rem' }}>
            {this.props.error}
          </div>
        )}
      </div>
    );
  }
}
