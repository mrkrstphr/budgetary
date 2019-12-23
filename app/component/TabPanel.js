import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';

const ContainerStyles = styled.div`
  margin-bottom: 10px;

  .tabBar {
    border-bottom: 1px solid #eee;
    display: flex;
  }

  .tabContentContainer {
    background-color: ${({ theme }) => theme.bodyContentBgColor};
    padding: 10px;
  }
`;
const TabStyles = styled.div`
  border-bottom: 2px solid transparent;
  cursor: pointer;
  padding: 10px 15px;

  &.active,
  &:hover {
    background-color: ${({ theme }) => theme.bodyContentBgColor};
    border-bottom-color: #1b7bf7;
  }
`;

export const TabPanel = ({ tabs = [], contents = [], style = {} }) => {
  const [selectedTab, selectTab] = useState(0);

  if (tabs.length !== contents.length) {
    throw Error('Tabs and contents must have the same length');
  }
  return (
    <ContainerStyles style={style}>
      <div className="tabBar">
        {tabs.map(({ label }, index) => (
          <Tab
            label={label}
            key={`tab-${label}`}
            onClick={() => selectTab(index)}
            className={index === selectedTab ? 'active' : ''}
          />
        ))}
      </div>
      <div className="tabContentContainer">{contents[selectedTab]}</div>
    </ContainerStyles>
  );
};

TabPanel.propTypes = {
  contents: PropTypes.arrayOf(PropTypes.element),
  style: PropTypes.object,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
  ),
};

const Tab = ({ className = '', label, onClick = () => null }) => (
  <TabStyles className={className} onClick={onClick}>
    {label}
  </TabStyles>
);

Tab.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
