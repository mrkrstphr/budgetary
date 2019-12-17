import styled from 'styled-components';
import styledMap from 'styled-map';

const alignMap = styledMap`
center: center;
left: left;
right: right;
default: left;
`;

const oddEvenColorMap = styledMap`
odd: #F9F2E8;
default: #fff;
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0 5px;
  width: 100%;
`;

const Row = styled.tr`
  background-color: ${oddEvenColorMap};
`;

const Header = styled.th`
  background-color: #f25f5c;
  color: #fff;
  padding: 8px;
  text-align: ${alignMap};

  &:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  &:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;

const Cell = styled.td`
  padding: 8px;
  text-align: ${alignMap};

  &:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  &:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;

export { Cell, Header, Row, Table };
