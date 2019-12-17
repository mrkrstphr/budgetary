import { Dialog as Bp3Dialog } from '@blueprintjs/core';
import React from 'react';

export function Dialog({ children, footer, ...props }) {
  return (
    <Bp3Dialog {...props}>
      <div className="bp3-dialog-body">{children}</div>

      <div className="bp3-dialog-footer">
        <div className="bp3-dialog-footer-actions">{footer}</div>
      </div>
    </Bp3Dialog>
  );
}
