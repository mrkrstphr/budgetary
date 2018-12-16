import React, { useState } from 'react';
import styled from 'styled-components';

const ContainerStyles = styled.div`
  margin-bottom: 10px;

  .tabBar {
    border-bottom: 1px solid #eee;
    display: flex;
  }

  .tabContentContainer {
    background-color: #fff;
    padding: 10px;
  }
`;
const TabStyles = styled.div`
  border-bottom: 2px solid transparent;
  cursor: pointer;
  padding: 10px 15px;

  &.active,
  &:hover {
    background-color: #fff;
    border-bottom-color: #1b7bf7;
  }
`;

export const TabPanel = ({ tabs = [], contents = [], ...props }) => {
  const [selectedTab, selectTab] = useState(0);

  if (tabs.length !== contents.length) {
    throw Error('Tabs and contents must have the same length');
  }
  return (
    <ContainerStyles {...props}>
      <div className="tabBar">
        {tabs.map(({ label }, index) => (
          <Tab
            label={label}
            key={index}
            onClick={() => selectTab(index)}
            className={index === selectedTab ? 'active' : ''}
          />
        ))}
      </div>
      <div className="tabContentContainer">{contents[selectedTab]}</div>
    </ContainerStyles>
  );
};

const Tab = ({ label, ...props }) => <TabStyles {...props}>{label}</TabStyles>;
