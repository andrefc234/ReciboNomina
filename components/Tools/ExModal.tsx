import React, { ReactNode } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ExModalProps {
  title: string;
  bodyComponent: ReactNode;
  showModal: boolean;
  handleClose: () => void;
}

const ExModal: React.FC<ExModalProps> = ({
  title,
  bodyComponent,
  showModal,
  handleClose,
}) => {
  return (
    <>
      

      <Modal show={showModal} onHide={handleClose}  centered  size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{bodyComponent}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExModal;
