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
    flex: 1;
    margin: 0;
  }
`;

export function PageTitle({ action = null, title }) {
  return (
    <div>
      <BrowserTitle title={title} />
      <PageTitleStyles>
        <h2 className="title">{title}</h2>
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
  title: PropTypes.string.isRequired,
};
