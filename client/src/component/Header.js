import React from 'react';
import styled from 'styled-components';
import Icon from 'component/Icon';

const Styles = styled.h1`
  color: #555;
`;

const DEFAULT_ICON = 'usd-circle';

const holidayHeaderIcons = [
  {
    start: new Date(`${new Date().getFullYear()}-10-20`),
    end: new Date(`${new Date().getFullYear()}-10-31`),
    icon: 'jack-o-lantern',
  },
  {
    start: new Date(`${new Date().getFullYear()}-11-20`),
    end: new Date(`${new Date().getFullYear()}-11-30`),
    icon: 'turkey',
  },
  {
    start: new Date(`${new Date().getFullYear()}-12-06`),
    end: new Date(`${new Date().getFullYear()}-12-29`),
    icon: 'tree-christmas',
  },
  {
    start: new Date(`${new Date().getFullYear()}-12-30`),
    end: new Date(`${new Date().getFullYear()}-01-03`),
    icon: 'glass-cheers',
  },
];

function getHeaderIcon() {
  const now = new Date();

  for (const candidate of holidayHeaderIcons) {
    if (now >= candidate.start && now <= candidate.end) {
      return candidate.icon;
    }
  }

  return DEFAULT_ICON;
}

export default () => (
  <Styles>
    Spend <Icon icon={getHeaderIcon()} color="#555" /> Tracking
  </Styles>
);
