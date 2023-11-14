import React from 'react';
import { Modal } from 'react-bootstrap';

const LoadingComponent = ({ show }) => {
  return (
    <Modal show={show} centered>
      <Modal.Body className="text-center">
      <div className="spiner-example">
        <div className="sk-spinner sk-spinner-three-bounce">
          <div className="sk-bounce1"></div>
          <div className="sk-bounce2"></div>
          <div className="sk-bounce3"></div>
        </div>
        <div className="text-center">
          <p>กำลังค้นหา...</p>
        </div>
      </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingComponent;
