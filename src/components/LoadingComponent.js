import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const LoadingComponent = ({ show }) => {
  return (
    <Modal show={show} centered>
      <Modal.Body className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <p>Loading...</p>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingComponent;
