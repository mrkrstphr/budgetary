import styled from 'styled-components';

export const FieldColumn = styled.div`
  flex: ${({ flex = 1 }) => flex};
  margin-left: 5px;
  margin-right: 5px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;
