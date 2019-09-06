import {
  Button,
  Popover,
  Menu,
  MenuDivider,
  MenuItem,
} from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { AppContext } from '../Context';

const Styles = styled.div`
  background-color: ${({ theme }) => theme.appBgColor};
  align-items: center;
  height: 48px;
  color: ${({ theme }) => theme.appFgColor};
  display: flex;
  margin: 0 -20px 5px -20px;
  padding: 10px;

  .menu {
    flex: 1;
    text-align: right;

    .bp3-icon {
      color: ${({ theme }) => theme.appFgColor};
    }
  }
`;

export default () => (
  <Styles>
    <AppContext.Consumer>
      {({ logout, theme, toggleTheme, user }) => (
        <div className="menu">
          <Popover
            content={
              <Menu>
                <MenuItem
                  icon={theme.name === 'dark' ? 'lightbulb' : 'moon'}
                  text={theme.name === 'dark' ? 'Light Theme' : 'Dark Theme'}
                  onClick={toggleTheme}
                />
                <MenuDivider />
                <MenuItem icon="log-out" text="Log Out" onClick={logout} />
              </Menu>
            }
          >
            <Button icon="user" minimal />
          </Popover>
        </div>
      )}
    </AppContext.Consumer>
  </Styles>
);
