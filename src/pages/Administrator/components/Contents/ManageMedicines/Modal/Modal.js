import React from 'react';
import './Modal.scss';

const Modal = ({ onClose, children, additionalClass }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal-content ${additionalClass}`}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
