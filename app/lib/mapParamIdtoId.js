/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useParams } from 'react-router-dom';

export function mapParamIdToId(Component) {
  return function MapParamIdToIdWrapper(props) {
    const { id } = useParams();
    return <Component id={id} {...props} />;
  };
}
