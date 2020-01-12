import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { BrowserTitle } from './BrowserTitle';

const PageTitleStyles = styled.div`
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  margin-bottom: 10px;
  padding-bottom: 10px;

  .title {
    align-items: center;
    display: flex;
    flex: 1;
    margin: 0;
  }
`;

export function PageTitle({ action = null, children, title }) {
  return (
    <div>
      <BrowserTitle title={title} />
      <PageTitleStyles>
        {children || <h2 className="title">{title}</h2>}
        {action}
      </PageTitleStyles>
    </div>
  );
}

PageTitle.propTypes = {
  action: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.string.isRequired,
};
