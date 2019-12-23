import { Dialog as Bp3Dialog } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';

export function Dialog({
  children,
  icon = '',
  isOpen = false,
  footer,
  onClose,
  title = '',
}) {
  return (
    <Bp3Dialog icon={icon} isOpen={isOpen} onClose={onClose} title={title}>
      <div className="bp3-dialog-body">{children}</div>

      <div className="bp3-dialog-footer">
        <div className="bp3-dialog-footer-actions">{footer}</div>
      </div>
    </Bp3Dialog>
  );
}

Dialog.propTypes = {
  children: PropTypes.element.isRequired,
  icon: PropTypes.string,
  isOpen: PropTypes.bool,
  footer: PropTypes.element,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};
