import React from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  background-color: rgba(211, 211, 211, 0.65);
  overflow: auto;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2000;
  height: 100vh;
`;

const DialogContainer = styled.div`
  background-color: #fff;
  border-radius: 3px;
  margin: 10% auto 40px auto;
  max-width: 640px;
`;

const DialogBody = styled.div`
  padding: 20px;
`;

const DialogFooter = styled.div`
  background-color: #f2f2f2;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

const DialogHeader = styled.div`
  background-color: #376ceb;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  color: #fff;
  font-weight: 500;
  font-size: 1.25em;
  padding: 16px;
`;

const Dialog = ({ footer, header, children, onClose, ...props }) => (
  <Backdrop onClick={onClose} {...props}>
    <DialogContainer onClick={e => e.stopPropagation()}>
      {header && <DialogHeader>{header}</DialogHeader>}
      <DialogBody>{children}</DialogBody>
      {footer && <DialogFooter>{footer}</DialogFooter>}
    </DialogContainer>
  </Backdrop>
);

export { Dialog };
