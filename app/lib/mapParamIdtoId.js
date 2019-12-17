import React from 'react';

export function mapParamIdToId(Component) {
  return function(props) {
    return <Component id={props.match.params.id} {...props} />;
  };
}
